import { NextRequest, NextResponse } from "next/server";
import { itineraryService } from "../../../../services/ai/itinerary-service";
import { logger } from "../../../../lib/logger";

/**
 * API Route to generate structured AI itineraries.
 * POST /api/ai/itinerary
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { requirements } = body;

        if (!requirements) {
            return NextResponse.json({ error: "Missing requirements for itinerary generation" }, { status: 400 });
        }

        // Diagnostic: Log current environment state
        logger.info({ hasApiKey: !!process.env.OPENAI_API_KEY }, "[Itinerary API] Environment Pre-check");

        const itinerary = await itineraryService.generateItinerary(requirements);

        return NextResponse.json({
            itinerary,
            generatedAt: new Date().toISOString(),
            status: "success"
        });
    } catch (error: any) {
        logger.error({ error: error.message, stack: error.stack }, "[Itinerary API] Generation failed");
        return NextResponse.json(
            { error: "Itinerary generation failed", details: error.message, tip: "Check OpenAI API Key and quota" },
            { status: 500 }
        );
    }
}
