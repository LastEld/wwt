import { NextRequest, NextResponse } from "next/server";
import { searchOrchestrator } from "../../../services/search/search-orchestrator";
import { NormalizedSearchRequest } from "../../../integrations/integration-adapter.interface";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic request validation & normalization
        const searchRequest: NormalizedSearchRequest = {
            destination: {
                name: body.location?.name || body.destination || "Unknown",
                lat: body.location?.lat,
                lng: body.location?.lng,
                radius: body.location?.radius || 5,
            },
            stay: {
                checkIn: new Date(body.dates?.checkIn || Date.now()),
                checkOut: new Date(body.dates?.checkOut || Date.now() + 86400000),
            },
            occupancy: {
                adults: body.occupancy?.adults || 2,
                children: body.occupancy?.children || [],
                rooms: body.occupancy?.rooms || 1,
            },
            currency: body.currency || "EUR",
        };

        const { results, facets } = await searchOrchestrator.search(
            searchRequest,
            body.filters || {},
            body.sort || 'relevance',
            body.userId, // In production, this comes from session
            undefined, // sessionId
            body.query // Natural Language Query
        );

        return NextResponse.json({
            searchId: crypto.randomUUID(),
            totalResults: results.length,
            results: results,
            facets: facets
        });
    } catch (error: any) {
        console.error("[Search API] Error:", error);
        return NextResponse.json(
            { error: "Failed to process search request", details: error.message },
            { status: 500 }
        );
    }
}
