import { NextRequest, NextResponse } from "next/server";
import { communicationService, CommunicationTemplate, TemplateData } from "../../../../services/ai/communication-service";
import { logger } from "../../../../lib/logger";
import { handleApiError } from "../../../../lib/api-error";

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
    } catch (error) {
        const result = handleApiError(error, "GenerateContentAPI");
        return NextResponse.json(
            { error: result.error },
            { status: result.status }
        );
    }
}
