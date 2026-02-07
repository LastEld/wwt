import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth.config";
import { ProfileService } from "../../../../services/ai/profile-service";

/**
 * GET /api/ai/profile
 * Returns the learned AI profile for the current user
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const profile = await ProfileService.getProfile(userId);

        return NextResponse.json(profile);
    } catch (error: any) {
        console.error("[Profile API] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
