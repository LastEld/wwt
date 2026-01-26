import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { ReactionType } from "@prisma/client";

export interface UserPreferenceProfile {
    amenityImportance: Record<string, number>;
    preferredStarRating: number;
    preferredPriceRange: { min: number; max: number };
    avoidHotelIds: string[];
}

export class ProfileService {
    private static CACHE_PREFIX = "profile:";

    /**
     * Learns a user's preferences by analyzing their reaction history.
     * Implements the "Amenity Importance Vector" using a weighted frequency model.
     */
    static async learnPreferences(userId: string): Promise<UserPreferenceProfile> {
        const reactions = await prisma.reaction.findMany({
            where: { userId },
        });

        if (reactions.length === 0) {
            return this.getDefaultProfile();
        }

        const likedHotels = reactions.filter((r: any) => r.type === "LIKE" as ReactionType);
        const dislikedHotels = reactions.filter((r: any) => r.type === "DISLIKE" as ReactionType);

        // 1. Feature Extraction: Amenity Importance Vector (Weighted)
        const amenityWeights: Record<string, number> = {};

        // Process Likes (+1 weight)
        likedHotels.forEach((reaction: any) => {
            reaction.amenities.forEach((amenity: string) => {
                const key = amenity.toLowerCase();
                amenityWeights[key] = (amenityWeights[key] || 0) + 1;
            });
        });

        // Process Dislikes (-1 weight)
        dislikedHotels.forEach((reaction: any) => {
            reaction.amenities.forEach((amenity: string) => {
                const key = amenity.toLowerCase();
                amenityWeights[key] = (amenityWeights[key] || 0) - 1;
            });
        });

        // 2. Star Rating Preference
        const totalStars = likedHotels.reduce((acc: number, r: any) => acc + (r.starRating || 3), 0);
        const avgStars = likedHotels.length > 0 ? totalStars / likedHotels.length : 3;

        // 3. Price Range Analysis
        const prices = likedHotels
            .map((r: any) => r.priceAtReaction ? Number(r.priceAtReaction) : null)
            .filter((p: number | null): p is number => p !== null);

        const profile: UserPreferenceProfile = {
            amenityImportance: amenityWeights,
            preferredStarRating: Math.round(avgStars),
            preferredPriceRange: {
                min: prices.length > 0 ? Math.min(...prices) * 0.8 : 0,
                max: prices.length > 0 ? Math.max(...prices) * 1.2 : 1000
            },
            avoidHotelIds: dislikedHotels.map((r: any) => r.hotelId)
        };

        // Cache the learned profile
        await redis.setex(
            `${this.CACHE_PREFIX}${userId}`,
            3600,
            JSON.stringify(profile)
        );

        return profile;
    }

    static async getProfile(userId: string): Promise<UserPreferenceProfile> {
        const cached = await redis.get(`${this.CACHE_PREFIX}${userId}`);
        if (cached) return JSON.parse(cached);
        return this.learnPreferences(userId);
    }

    private static getDefaultProfile(): UserPreferenceProfile {
        return {
            amenityImportance: {},
            preferredStarRating: 3,
            preferredPriceRange: { min: 0, max: 1000 },
            avoidHotelIds: []
        };
    }
}
