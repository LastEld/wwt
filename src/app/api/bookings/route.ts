import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.config";
import { PriceLockService, PriceLockData } from "../../../services/transactions/price-lock-service";
import { BookingService } from "../../../services/transactions/booking-service";
import { withRateLimit } from "../../../lib/with-rate-limit";
import { handleApiError } from "../../../lib/api-error";

async function handleGet(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bookings = await BookingService.getUserBookings((session.user as any).id);
        return NextResponse.json(bookings);
    } catch (error) {
        const result = handleApiError(error, "BookingAPI.GET");
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
}

async function handlePost(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const raw = await req.json();

        // Validate request based on action
        const { BookingRequestSchema, validateRequest } = await import("../../../lib/validations");
        const parsed = validateRequest(BookingRequestSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
        const body = parsed.data;
        const { action } = body;

        // Route actions: INITIALIZE (Lock) or CONFIRM (Pay/Book)
        if (action === "INITIALIZE" && "hotelId" in body.data) {
            const lockData = {
                ...body.data,
                userId: (session.user as any).id,
                sessionId: req.cookies.get("next-auth.session-token")?.value || (session.user as any).id,
            } as unknown as PriceLockData;

            const lock = await PriceLockService.acquireLock(lockData);
            return NextResponse.json(lock);
        }

        if (action === "CONFIRM" && "lockId" in body.data) {
            const booking = await BookingService.createBooking({
                ...body.data,
                userId: (session.user as any).id
            } as any);
            return NextResponse.json({ success: true, booking });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        const result = handleApiError(error, "BookingAPI.POST");
        return NextResponse.json(
            { error: result.error },
            { status: result.status }
        );
    }
}

const rateLimitOptions = {
    limit: 10,
    windowSeconds: 60,
    prefix: 'bookings',
};

export const GET = withRateLimit(handleGet, rateLimitOptions);
export const POST = withRateLimit(handlePost, rateLimitOptions);
