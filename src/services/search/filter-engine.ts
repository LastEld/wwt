import { HotelOffer } from "../../integrations/integration-adapter.interface";

export interface FilterCriteria {
    priceMin?: number;
    priceMax?: number;
    starRating?: number[];
    amenities?: string[];
    minRating?: number;
    mealPlan?: string[];
    freeCancellation?: boolean;
    excludedHotelIds?: Set<string>;
}

export class FilterEngine {
    static apply(offers: HotelOffer[], criteria: FilterCriteria): HotelOffer[] {
        return offers.filter(offer => {
            // Reaction-based exclusion
            if (criteria.excludedHotelIds?.has(offer.id)) return false;

            // Price Check
            if (criteria.priceMin && offer.price.amount < criteria.priceMin) return false;
            if (criteria.priceMax && offer.price.amount > criteria.priceMax) return false;

            // Star Rating Check
            if (criteria.starRating && criteria.starRating.length > 0) {
                if (!criteria.starRating.includes(offer.starRating)) return false;
            }

            // Review Score Check
            if (criteria.minRating && offer.reviewScore < criteria.minRating) return false;

            // Amenities Check (Must have all requested)
            if (criteria.amenities && criteria.amenities.length > 0) {
                const offerAmenitiesSet = new Set(offer.amenities.map((a: string) => a.toLowerCase()));
                const allPresent = criteria.amenities.every((req: string) =>
                    offerAmenitiesSet.has(req.toLowerCase())
                );
                if (!allPresent) return false;
            }

            // Meal Plan Check
            if (criteria.mealPlan && criteria.mealPlan.length > 0) {
                // Simple string match for MVP
                if (!offer.amenities.some(a => criteria.mealPlan?.includes(a))) return false;
            }

            // Free Cancellation Check
            if (criteria.freeCancellation && !offer.cancellationPolicy?.toLowerCase().includes("free")) {
                return false;
            }

            return true;
        });
    }
}
