import { IntegrationAdapter, NormalizedSearchRequest, HotelOffer } from "../../integrations/integration-adapter.interface";
import { MockAdapter } from "../../integrations/mock/mock-adapter";
import { HotelbedsAdapter } from "../../integrations/hotelbeds/hotelbeds-adapter";
import { areSameHotels } from "./identity-resolution";
import { FilterEngine, FilterCriteria } from "./filter-engine";
import { SortEngine, SortField } from "./sort-engine";
import { ProfileService } from "../ai/profile-service";
import { RankingPipeline } from "../ai/ranking-pipeline";
import { RealtimeGateway } from "../realtime/realtime-gateway";
import { vectorService } from "../ai/vector-service";
import { logger } from "../../lib/logger";

export class SearchOrchestrator {
    private adapters: IntegrationAdapter[] = [];

    constructor() {
        // Register adapters
        this.adapters.push(new MockAdapter());
        this.adapters.push(new HotelbedsAdapter());

        // Sort by priority
        this.adapters.sort((a, b) => a.priority - b.priority);
    }

    async search(
        request: NormalizedSearchRequest,
        filters: FilterCriteria = {},
        sort: SortField = 'relevance',
        userId?: string,
        sessionId?: string,
        naturalLanguageQuery?: string
    ): Promise<{ results: HotelOffer[]; facets: any }> {
        logger.info({
            destination: request.destination.name,
            hasNLQ: !!naturalLanguageQuery
        }, "Initiating multi-provider search");

        // 0. (Optional) Initial Candidate Retrieval via RAG
        let candidateIds: string[] = [];
        if (naturalLanguageQuery) {
            try {
                const matches = await vectorService.search(naturalLanguageQuery);
                candidateIds = matches.map(m => m.id);
                logger.info({ count: candidateIds.length }, "[Orchestrator] RAG Candidates identified");
            } catch (err) {
                logger.error({ err, query: naturalLanguageQuery }, "[Orchestrator] RAG retrieval failed, falling back to keyword search");
            }
        }

        // If userId provided, fetch AI profile
        const profile = userId ? await ProfileService.getProfile(userId).catch(() => null) : null;

        // 1. Fan-out with progressive emission
        const results = await Promise.allSettled(
            this.adapters.map(async (adapter) => {
                try {
                    const offers = await adapter.search(request);

                    // Emit internal "found" event for progressive UI
                    const room = userId ? `user:${userId}` : (sessionId ? `session:${sessionId}` : null);
                    if (room) {
                        RealtimeGateway.broadcast(room, "search:partial_results", {
                            provider: adapter.name,
                            count: offers.length,
                            offers: offers
                        });
                    }

                    return offers;
                } catch (err: any) {
                    logger.error({ adapter: adapter.name, err }, "Search adapter failed");
                    return [] as HotelOffer[];
                }
            })
        );

        // 2. Aggregate
        let allOffers: HotelOffer[] = [];
        results.forEach(res => {
            if (res.status === 'fulfilled' && res.value) {
                allOffers = [...allOffers, ...res.value];
            }
        });

        // 3. Deduplicate (Identity Resolution)
        const uniqueOffers = this.deduplicate(allOffers);

        // 3.5 Blend RAG Candidates (if applicable)
        // If we have candidates from RAG, ensure they are prioritized or filtered
        const blendedOffers = candidateIds.length > 0
            ? uniqueOffers.filter(o => candidateIds.includes(o.hotelId) || candidateIds.includes(o.id))
            : uniqueOffers;

        // 4. Filter
        const filteredOffers = FilterEngine.apply(blendedOffers, filters);

        // 5. AI Re-Ranking (Step 6)
        // We pass the already filtered/deduplicated list to the AI Ranking Pipeline
        const rankedResults = await RankingPipeline.rank(filteredOffers, profile);

        // 6. Calculate Facets (Spec requirement)
        const facets = this.calculateFacets(uniqueOffers);

        return {
            results: rankedResults,
            facets
        };
    }

    private calculateFacets(offers: HotelOffer[]) {
        const prices = offers.map(o => o.price.amount);
        const amenitiesMap: Record<string, number> = {};

        offers.forEach(o => {
            o.amenities.forEach((a: string) => {
                const lower = a.toLowerCase();
                amenitiesMap[lower] = (amenitiesMap[lower] || 0) + 1;
            });
        });

        return {
            priceRange: {
                min: Math.min(...prices, 0),
                max: Math.max(...prices, 0)
            },
            amenityCounts: amenitiesMap
        };
    }

    private deduplicate(offers: HotelOffer[]): HotelOffer[] {
        const unique: HotelOffer[] = [];

        for (const offer of offers) {
            const existing = unique.find(u =>
                areSameHotels(
                    { name: u.name, lat: u.location.lat, lng: u.location.lng },
                    { name: offer.name, lat: offer.location.lat, lng: offer.location.lng }
                )
            );

            if (existing) {
                // Merge Logic: Keep lowest price, combine amenities and images
                if (offer.price.amount < existing.price.amount) {
                    existing.price = offer.price;
                }
                existing.amenities = Array.from(new Set([...existing.amenities, ...offer.amenities]));
                existing.images = Array.from(new Set([...existing.images, ...offer.images]));
            } else {
                unique.push({ ...offer });
            }
        }

        return unique;
    }
}

// Singleton for easy use across app
export const searchOrchestrator = new SearchOrchestrator();
