import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.config";
import { OpenAIService } from "../../../services/ai/openai-service";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const { messages } = await req.json();

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

    } catch (error: any) {
        console.error("[Chat API] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
