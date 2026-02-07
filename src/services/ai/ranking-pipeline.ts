import { HotelOffer } from "../../integrations/integration-adapter.interface";
import { UserPreferenceProfile } from "./profile-service";
import { ScoringEngine } from "./scoring-engine";
import { neuralRanker } from "./neural-ranker";
import { NeuralFeatureMapper } from "./neural-feature-mapper";
import { MatchingService } from "./matching-service";

export class RankingPipeline {
    /**
     * Performs high-performance 2-Stage Re-ranking.
     */
    static async rank(
        offers: HotelOffer[],
        profile: UserPreferenceProfile | null
    ): Promise<HotelOffer[]> {
        if (!profile || offers.length === 0) return offers;

        // --- STAGE 1: HEURISTIC PRUNING (Top 100) ---
        // Fast path to eliminate clearly irrelevant results
        const candidatePool = offers
            .map(offer => ({
                offer,
                hScore: ScoringEngine.calculateHeuristicScore(offer, profile)
            }))
            .sort((a, b) => b.hScore - a.hScore)
            .slice(0, 100);

        // --- STAGE 2: NEURAL RE-RANKING ---
        const topOffers = candidatePool.map(c => c.offer);
        const userFeatures = NeuralFeatureMapper.mapUser(profile);
        const neuralProbabilities = await neuralRanker.predict(profile, topOffers);

        const FINAL_SCORED_RESULTS = await Promise.all(candidatePool.map(async (candidate, index) => {
            const neuralBoost = neuralProbabilities[index] || 0.5;

            // Step 2.2: Add Intelligent Supplier Matching score
            const businessMatching = await MatchingService.getSupplierScore(
                candidate.offer.id,
                candidate.offer.provider
            );

            const finalScore = ScoringEngine.calculatePersonalizedScore(
                candidate.offer,
                profile,
                neuralBoost
            ) * businessMatching.finalScore;

            return {
                ...candidate.offer,
                score: parseFloat(finalScore.toFixed(4)),
                businessMetrics: businessMatching
            };
        }));

        // --- STAGE 3: DIVERSITY INJECTION ---
        return this.applyDiversity(FINAL_SCORED_RESULTS.sort((a, b) => b.score - a.score));
    }

    /**
     * Ensures top results aren't dominated by one provider or price bracket.
     * Uses a penalized diversity score for the top elements.
     */
    private static applyDiversity(results: any[]): any[] {
        if (results.length < 5) return results;

        const diverse: any[] = [];
        const pool = [...results];

        while (diverse.length < 10 && pool.length > 0) {
            // Find the best item that isn't too similar to what's already picked
            let bestIdx = 0;
            let bestScore = -Infinity;

            for (let i = 0; i < Math.min(pool.length, 20); i++) {
                const item = pool[i];
                let penalty = 0;

                // Provider diversity penalty
                if (diverse.some(d => d.provider === item.provider)) penalty += 0.1;

                // Price bracket similarity penalty
                const bracket = Math.floor(item.price.amount / 100);
                if (diverse.some(d => Math.floor(d.price.amount / 100) === bracket)) penalty += 0.05;

                const currentScore = item.score - penalty;
                if (currentScore > bestScore) {
                    bestScore = currentScore;
                    bestIdx = i;
                }
            }

            diverse.push(pool.splice(bestIdx, 1)[0]);
        }

        return [...diverse, ...pool];
    }
}
