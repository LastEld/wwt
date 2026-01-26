import { NextRequest, NextResponse } from "next/server";
import { PricingService } from "../../../../../services/ai/pricing-service";
import { logger } from "../../../../../lib/logger";

/**
 * API Route for Predictive Pricing Forecasts.
 * POST /api/ai/pricing/forecast
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { hotelId, currentPrice } = body;

        if (!hotelId || !currentPrice) {
            return NextResponse.json({ error: "Missing hotelId or currentPrice" }, { status: 400 });
        }

        logger.info({ hotelId }, "[Pricing API] Requesting forecast");

        const forecast = await PricingService.forecastPriceChange(hotelId, currentPrice);

        return NextResponse.json({
            forecast,
            generatedAt: new Date().toISOString()
        });
    } catch (error: any) {
        logger.error({ error: error.message }, "[Pricing API] Forecast failed");
        return NextResponse.json(
            { error: "Forecast generation failed", details: error.message },
            { status: 500 }
        );
    }
}
