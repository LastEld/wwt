import prisma from "../../lib/prisma";
import { ReactionType } from "@prisma/client";

export class ReactionService {
    /**
     * Records a user's reaction to a hotel.
     */
    static async record(params: {
        userId?: string;
        sessionId: string;
        hotelId: string;
        integration: string;
        type: ReactionType;
        priceAtReaction?: number;
        starRating?: number;
        amenities?: string[];
    }) {
        const userId = params.userId || "anonymous";

        return prisma.reaction.upsert({
            where: {
                userId_hotelId_integration: {
                    userId,
                    hotelId: params.hotelId,
                    integration: params.integration,
                },
            },
            update: {
                type: params.type,
                priceAtReaction: params.priceAtReaction,
                starRating: params.starRating,
                amenities: params.amenities || [],
            },
            create: {
                userId,
                hotelId: params.hotelId,
                integration: params.integration,
                type: params.type,
                priceAtReaction: params.priceAtReaction,
                starRating: params.starRating,
                amenities: params.amenities || [],
            },
        });
    }

    /**
     * Retrieves all reactions for a specific user.
     */
    static async getUserReactions(userId: string) {
        return prisma.reaction.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
}
