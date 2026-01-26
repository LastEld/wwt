import prisma from "../../lib/prisma";
import { logger } from "../../lib/logger";

export interface MatchingResult {
    supplierId: string;
    finalScore: number;
    commissionBoost: number;
    reliabilityPenalty: number;
}

export class MatchingService {
    /**
     * Calculates a business-optimized score for a supplier.
     * Incorporates: 
     * - Agency commissions (Profitability)
     * - Historical failure rates (Reliability)
     * - Agent sentiment (Qualitative feedback)
     */
    static async getSupplierScore(
        supplierId: string,
        integration: string,
        agencyId: string = "root-agency"
    ): Promise<MatchingResult> {
        try {
            // 1. Fetch Agency Preferences
            const agencyPrefs = await prisma.agencyPreferences.findUnique({
                where: { agencyId }
            });

            // 2. Fetch Supplier Performance Data
            const performance = await prisma.supplierPerformance.findUnique({
                where: { supplierId }
            });

            let finalScore = 1.0;
            let commissionBoost = 0;
            let reliabilityPenalty = 0;

            // Apply Agency Boost (Weights)
            if (agencyPrefs?.supplierWeights) {
                const weights = agencyPrefs.supplierWeights as Record<string, number>;
                if (weights[integration]) {
                    finalScore *= weights[integration];
                }
            }

            // Apply Commission Boost
            if (performance?.avgCommission) {
                const comm = Number(performance.avgCommission);
                if (comm > 15) {
                    commissionBoost = 0.2; // 20% boost for high commissions
                } else if (comm > 10) {
                    commissionBoost = 0.1;
                }
                finalScore += commissionBoost;
            }

            // Apply Reliability Penalty
            if (performance?.failureRate) {
                if (performance.failureRate > 0.1) {
                    reliabilityPenalty = 0.3; // 30% penalty for high failure rates
                } else if (performance.failureRate > 0.05) {
                    reliabilityPenalty = 0.1;
                }
                finalScore -= reliabilityPenalty;
            }

            return {
                supplierId,
                finalScore: Math.max(0.1, finalScore), // Ensure positive score
                commissionBoost,
                reliabilityPenalty
            };

        } catch (error) {
            logger.error({ supplierId, error }, "[MatchingService] Error calculating score");
            return { supplierId, finalScore: 1.0, commissionBoost: 0, reliabilityPenalty: 0 };
        }
    }
}
