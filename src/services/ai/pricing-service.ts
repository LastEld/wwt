import prisma from "../../lib/prisma";
import { logger } from "../../lib/logger";

export interface PricingForecast {
    currentPrice: number;
    forecastedPrice: number;
    confidence: number;
    trend: "RISING" | "STABLE" | "FALLING";
    recommendation: string;
}

export class PricingService {
    /**
     * Forecasts price changes for a specific property based on historical data.
     * Implements a simulated time-series regression for the MVP.
     */
    static async forecastPriceChange(hotelId: string, currentPrice: number): Promise<PricingForecast> {
        try {
            const history = await prisma.priceHistory.findMany({
                where: { hotelId },
                orderBy: { recordedAt: "desc" },
                take: 10
            });

            if (history.length < 3) {
                return {
                    currentPrice,
                    forecastedPrice: currentPrice,
                    confidence: 0.4,
                    trend: "STABLE",
                    recommendation: "Insufficient historical data for a high-confidence forecast. Monitor closely."
                };
            }

            // Simple Linear Regression Simulation
            const prices = history.map(h => Number(h.price));
            const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
            const isRising = prices[0] > prices[prices.length - 1];

            const forecastedPrice = isRising ? currentPrice * 1.12 : currentPrice * 0.95;
            const trend = isRising ? "RISING" : "STABLE";

            return {
                currentPrice,
                forecastedPrice: Math.round(forecastedPrice),
                confidence: 0.75,
                trend,
                recommendation: isRising
                    ? "Prices are trending upwards for this property. Recommend booking within 48 hours."
                    : "Prices are stable. No immediate rush to book, but keep an eye on holiday demand."
            };
        } catch (error) {
            logger.error({ hotelId, error }, "[PricingService] Forecast failed");
            throw new Error("Pricing forecast unavailable");
        }
    }

    /**
     * Records a price snapshot into the history lakehouse.
     */
    static async recordPrice(hotelId: string, integration: string, price: number): Promise<void> {
        await prisma.priceHistory.create({
            data: {
                hotelId,
                integration,
                price
            }
        });
    }
}
