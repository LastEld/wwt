import { NextRequest, NextResponse } from "next/server";
import { searchOrchestrator } from "../../../services/search/search-orchestrator";
import { NormalizedSearchRequest } from "../../../integrations/integration-adapter.interface";
import { SearchRequestSchema, validateRequest } from "../../../lib/validations";
import { withRateLimit } from "../../../lib/with-rate-limit";
import { handleApiError } from "../../../lib/api-error";

async function handlePost(req: NextRequest) {
    try {
        const raw = await req.json();
        const parsed = validateRequest(SearchRequestSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
        const body = parsed.data;

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
            (body.sort || 'relevance') as any,
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
    } catch (error) {
        const result = handleApiError(error, "SearchAPI");
        return NextResponse.json(
            { error: result.error },
            { status: result.status }
        );
    }
}

export const POST = withRateLimit(handlePost, {
    limit: 30,
    windowSeconds: 60,
    prefix: 'search',
});
