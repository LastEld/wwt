import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const protectedPaths = [
    "/checkout",
    "/profile",
    "/wishlist",
    "/bookings",
];

// API routes that require authentication (already checked in handlers, but defense in depth)
const protectedApiPaths = [
    "/api/bookings",
    "/api/reactions",
    "/api/ai/profile",
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if this path needs protection
    const isProtectedPage = protectedPaths.some((p) => pathname.startsWith(p));
    const isProtectedApi = protectedApiPaths.some((p) => pathname.startsWith(p));

    if (!isProtectedPage && !isProtectedApi) {
        return NextResponse.next();
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
        if (isProtectedApi) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        // Redirect to sign-in for pages
        const signInUrl = new URL("/auth/signin", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Protected pages
        "/checkout/:path*",
        "/profile/:path*",
        "/wishlist/:path*",
        "/bookings/:path*",
        // Protected API routes
        "/api/bookings/:path*",
        "/api/reactions/:path*",
        "/api/ai/profile/:path*",
    ],
};
