import { NextRequest, NextResponse } from "next/server";
import { communicationService, CommunicationTemplate, TemplateData } from "../../../../services/ai/communication-service";
import { logger } from "../../../../lib/logger";

/**
 * API Route to generate AI-powered luxury communication drafts.
 * POST /api/ai/generate-content
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { template, ...data } = body;

        if (!template || !data.clientName || !data.destination) {
            return NextResponse.json({ error: "Missing required template data" }, { status: 400 });
        }

        logger.info({ template, destination: data.destination }, "[AI Content API] Processing generation request");

        const content = await communicationService.generateContent(
            template as CommunicationTemplate,
            data as TemplateData
        );

        return NextResponse.json({
            template,
            content,
            generatedAt: new Date().toISOString(),
        });
    } catch (error: any) {
        logger.error({ error: error.message }, "[AI Content API] Generation failed");
        return NextResponse.json(
            { error: "Content generation failed", details: error.message },
            { status: 500 }
        );
    }
}
