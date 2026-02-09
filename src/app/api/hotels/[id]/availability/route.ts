import { NextRequest, NextResponse } from "next/server";
import { MockAdapter } from "../../../../../integrations/mock/mock-adapter";
import { HotelbedsAdapter } from "../../../../../integrations/hotelbeds/hotelbeds-adapter";
import { PricingService } from "../../../../../services/pricing/pricing-service";
import { handleApiError } from "../../../../../lib/api-error";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const hotelId = params.id;
        const { searchParams } = new URL(req.url);
        const checkIn = new Date(searchParams.get("checkIn") || Date.now());
        const checkOut = new Date(searchParams.get("checkOut") || Date.now() + 86400000);
        const roomId = searchParams.get("roomId");

        // Adapter Factory Logic
        let adapter;
        if (hotelId.startsWith("hb-")) {
            adapter = new HotelbedsAdapter();
        } else {
            adapter = new MockAdapter();
        }

        const availability = await adapter.checkAvailability(
            hotelId,
            roomId || "default",
            { checkIn, checkOut }
        );

        if (!availability.available) {
            return NextResponse.json({ available: false, reason: "No longer available" }, { status: 404 });
        }

        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

        // In a real scenario, basePrice would come from availability check
        const basePrice = availability.newPrice || 250;
        const breakdown = PricingService.calculateTotal(basePrice, nights);

        return NextResponse.json({
            available: true,
            breakdown,
            roomsLeft: availability.roomsLeft
        });
    } catch (error) {
        const result = handleApiError(error, "HotelAvailabilityAPI");
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
}
