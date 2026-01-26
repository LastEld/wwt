import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.config";
import { PriceLockService, PriceLockData } from "../../../services/transactions/price-lock-service";
import { BookingService } from "../../../services/transactions/booking-service";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { action } = body;

        // Route actions: INITIALIZE (Lock) or CONFIRM (Pay/Book)
        if (action === "INITIALIZE") {
            const lockData: PriceLockData = {
                ...body.data,
                userId: (session.user as any).id,
                sessionId: "client-session-id" // In production, use cookie/fingerprint
            };

            const lock = await PriceLockService.acquireLock(lockData);
            return NextResponse.json(lock);
        }

        if (action === "CONFIRM") {
            const booking = await BookingService.createBooking({
                ...body.data,
                userId: (session.user as any).id
            });
            return NextResponse.json({ success: true, booking });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("[Booking API] Error:", error);
        return NextResponse.json(
            { error: error.message || "Transaction failed" },
            { status: 500 }
        );
    }
}
