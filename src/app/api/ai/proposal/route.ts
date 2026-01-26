import { NextRequest, NextResponse } from "next/server";
import { proposalService } from "../../../../services/ai/proposal-service";
import { StructuredItinerary } from "../../../../services/ai/itinerary-service";
import { logger } from "../../../../lib/logger";

/**
 * API Route to synthesize branded proposals from itineraries.
 * POST /api/ai/proposal
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { itinerary, agentName } = body;

        if (!itinerary) {
            return NextResponse.json({ error: "Missing itinerary for proposal generation" }, { status: 400 });
        }

        logger.info({ itineraryId: itinerary.id }, "[Proposal API] Generating branded document");

        const proposal = proposalService.generateProposal(itinerary as StructuredItinerary, agentName);

        return NextResponse.json({
            proposal,
            generatedAt: new Date().toISOString(),
            status: "ready"
        });
    } catch (error: any) {
        logger.error({ error: error.message }, "[Proposal API] Synthesis failed");
        return NextResponse.json(
            { error: "Proposal synthesis failed", details: error.message },
            { status: 500 }
        );
    }
}
