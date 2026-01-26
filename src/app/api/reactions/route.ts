import { NextRequest, NextResponse } from "next/server";
import { ReactionService } from "../../../services/ai/reaction-service";
import { ProfileService } from "../../../services/ai/profile-service";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.config";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { hotelId, integration, type, priceAtReaction, starRating, amenities } = body;

        if (!hotelId || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const reaction = await ReactionService.record({
            userId: (session?.user as any)?.id,
            sessionId: "browser-session", // In production, use session cookie/fingerprint
            hotelId,
            integration,
            type,
            priceAtReaction,
            starRating,
            amenities
        });

        // If logged in, trigger background re-learn
        if ((session?.user as any)?.id) {
            ProfileService.learnPreferences((session.user as any).id).catch((err: Error) =>
                console.error(`[AI Learning] Error for user ${(session.user as any).id}:`, err)
            );
        }

        return NextResponse.json({ success: true, reactionId: reaction.id });
    } catch (error: any) {
        console.error("[Reactions API] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
