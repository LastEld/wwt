import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { handleApiError } from "../../../lib/api-error";

/**
 * GET /api/deals
 * Returns trending destinations and flash deals
 */
export async function GET() {
    try {
        // Fetch trending destinations from DemandSignal
        let trendingDestinations: any[] = [];

        try {
            const signals = await prisma.demandSignal.findMany({
                orderBy: { strength: "desc" },
                take: 4,
            });

            trendingDestinations = signals.map((s) => ({
                name: s.destination,
                searchCount: s.searchCount,
                trend: s.trend || "STABLE",
                imageUrl: getDestinationImage(s.destination),
            }));
        } catch {
            // Fallback if DB not available
            trendingDestinations = getMockTrending();
        }

        // If no DB results, use mock data
        if (trendingDestinations.length === 0) {
            trendingDestinations = getMockTrending();
        }

        // Mock flash deals with calculated discounts
        const deals = getMockDeals();

        return NextResponse.json({
            trending: trendingDestinations,
            deals,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        const result = handleApiError(error, "DealsAPI");
        return NextResponse.json(
            { error: result.error },
            { status: result.status }
        );
    }
}

function getDestinationImage(destination: string): string {
    const images: Record<string, string> = {
        "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
        "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
        "Maldives": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
        "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
        "London": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
        "Rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
        "Barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
    };
    return images[destination] || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800";
}

function getMockTrending() {
    return [
        { name: "Dubai", searchCount: 15420, trend: "RISING", imageUrl: getDestinationImage("Dubai") },
        { name: "Maldives", searchCount: 12890, trend: "RISING", imageUrl: getDestinationImage("Maldives") },
        { name: "Paris", searchCount: 11200, trend: "STABLE", imageUrl: getDestinationImage("Paris") },
        { name: "Tokyo", searchCount: 9850, trend: "RISING", imageUrl: getDestinationImage("Tokyo") },
    ];
}

function getMockDeals() {
    return [
        {
            id: "deal-1",
            hotelName: "The Ritz Paris",
            location: "Paris, France",
            originalPrice: 850,
            discountedPrice: 595,
            discountPercent: 30,
            imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
            rating: 4.9,
            expiresIn: "2h 45m",
            amenities: ["Spa", "Pool", "Fine Dining"],
        },
        {
            id: "deal-2",
            hotelName: "Burj Al Arab",
            location: "Dubai, UAE",
            originalPrice: 1200,
            discountedPrice: 899,
            discountPercent: 25,
            imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            rating: 5.0,
            expiresIn: "5h 12m",
            amenities: ["Private Beach", "Helipad", "Butler Service"],
        },
        {
            id: "deal-3",
            hotelName: "Aman Tokyo",
            location: "Tokyo, Japan",
            originalPrice: 780,
            discountedPrice: 546,
            discountPercent: 30,
            imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
            rating: 4.8,
            expiresIn: "8h 30m",
            amenities: ["Onsen", "Zen Garden", "Michelin Restaurant"],
        },
        {
            id: "deal-4",
            hotelName: "Soneva Fushi",
            location: "Maldives",
            originalPrice: 1500,
            discountedPrice: 1125,
            discountPercent: 25,
            imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
            rating: 4.9,
            expiresIn: "12h 0m",
            amenities: ["Overwater Villa", "Diving", "Cinema"],
        },
        {
            id: "deal-5",
            hotelName: "Claridge's",
            location: "London, UK",
            originalPrice: 650,
            discountedPrice: 455,
            discountPercent: 30,
            imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            rating: 4.7,
            expiresIn: "3h 20m",
            amenities: ["Afternoon Tea", "Art Deco", "Concierge"],
        },
        {
            id: "deal-6",
            hotelName: "Mandarin Oriental",
            location: "Barcelona, Spain",
            originalPrice: 520,
            discountedPrice: 364,
            discountPercent: 30,
            imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            rating: 4.8,
            expiresIn: "6h 45m",
            amenities: ["Rooftop Pool", "Spa", "Gourmet Dining"],
        },
    ];
}
