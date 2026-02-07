import { NextRequest, NextResponse } from "next/server";
import { ReactionService } from "../../../services/ai/reaction-service";
import { ProfileService } from "../../../services/ai/profile-service";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.config";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const reactions = await ReactionService.getUserReactions((session.user as any).id);
        // Return only 'LIKE' reactions for wishlist or all for ranking
        const showAll = req.nextUrl.searchParams.get("all") === "true";
        const filtered = showAll ? reactions : reactions.filter(r => r.type === "LIKE");

        return NextResponse.json(filtered);
    } catch (error: any) {
        console.error("[Reactions API] GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

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
