import { HotelOffer } from "../../integrations/integration-adapter.interface";
import { UserPreferenceProfile } from "./profile-service";

export class ScoringEngine {
    /**
     * Calculates a heuristic score for a hotel based on user preferences.
     * Result is a value between 0 and 1.
     */
    static calculateHeuristicScore(offer: HotelOffer, profile: UserPreferenceProfile): number {
        let score = 0.5; // Base score

        // 1. Price Sensitivity Match (PSS)
        // Profile range provides a baseline for what the user is comfortable with.
        const price = offer.price.amount;
        const { min, max } = profile.preferredPriceRange;
        if (price >= min && price <= max) {
            score += 0.15;
        } else if (price < min) {
            score += 0.05; // Still positive but potentially lower quality than desired
        } else {
            score -= 0.1; // Over budget
        }

        // 2. Star Rating Alignment
        const starDiff = Math.abs(offer.starRating - profile.preferredStarRating);
        if (starDiff === 0) {
            score += 0.1;
        } else if (starDiff === 1) {
            score += 0.05;
        } else {
            score -= 0.05 * starDiff;
        }

        // 3. Amenity Vector Overlap
        const offerAmenities = new Set(offer.amenities.map(a => a.toLowerCase()));
        let amenityBoost = 0;

        Object.entries(profile.amenityImportance).forEach(([amenity, weight]) => {
            if (offerAmenities.has(amenity)) {
                amenityBoost += weight * 0.05; // Each matching amenity adds/removes based on importance
            }
        });

        score += Math.max(-0.25, Math.min(0.25, amenityBoost));

        // 4. Dislike Pruning (Redundant since FilterEngine handles this, but for safety)
        if (profile.avoidHotelIds.includes(offer.id)) {
            return 0;
        }

        return Math.max(0, Math.min(1, score));
    }

    /**
     * Placeholder for neural score integration.
     * Stage 1 Ranker uses Heuristic. Stage 2 (NeuralRanker) will improve this.
     */
    static calculatePersonalizedScore(offer: HotelOffer, profile: UserPreferenceProfile, neuralWeight: number = 0): number {
        const heuristic = this.calculateHeuristicScore(offer, profile);
        // In Stage 2, neuralWeight will be the output from TwoTowerModel
        return (heuristic * 0.4) + (neuralWeight * 0.6);
    }
}
