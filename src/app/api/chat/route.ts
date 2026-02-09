import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.config";
import { OpenAIService } from "../../../services/ai/openai-service";
import { withRateLimit } from "../../../lib/with-rate-limit";
import { handleApiError } from "../../../lib/api-error";

export const dynamic = 'force-dynamic';

async function handlePost(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const raw = await req.json();

        const { ChatRequestSchema, validateRequest } = await import("../../../lib/validations");
        const parsed = validateRequest(ChatRequestSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
        const { messages } = parsed.data;

        const stream = await OpenAIService.chatStream(
            messages,
            (session?.user as any)?.id
        );

        // SSE Encoder for character streaming
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                let toolCalls: any[] = [];

                for await (const chunk of stream) {
                    const delta = chunk.choices[0]?.delta;

                    if (delta?.content) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: delta.content })}\n\n`));
                    }

                    if (delta?.tool_calls) {
                        // Accumulate tool calls for handling
                        toolCalls = [...toolCalls, ...delta.tool_calls];
                    }
                }

                // If tool calls were initiated, trigger execution and a second model turn (optional or simplified for MVP)
                if (toolCalls.length > 0) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'status', content: 'Searching our network...' })}\n\n`));

                    const toolResults = await OpenAIService.handleToolCalls(toolCalls, (session?.user as any)?.id);
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'tool_result', content: toolResults })}\n\n`));
                }

                controller.close();
            }
        });

        return new NextResponse(readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (error) {
        const result = handleApiError(error, "ChatAPI");
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
}

export const POST = withRateLimit(handlePost, {
    limit: 20,
    windowSeconds: 60,
    prefix: 'chat',
});
