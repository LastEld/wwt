"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReactionPayload {
    hotelId: string;
    integration: string;
    type: "LIKE" | "DISLIKE" | "VIEW";
    priceAtReaction?: number;
    starRating?: number;
    amenities?: string[];
}

export const useHotelReaction = (hotelId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ReactionPayload) => {
            const resp = await fetch("/api/reactions", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            if (!resp.ok) throw new Error("Failed to record reaction");
            return resp.json();
        },
        // Optimistic Update
        onMutate: async (newReaction) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["reactions", hotelId] });

            // Snapshot the previous value
            const previousReaction = queryClient.getQueryData(["reactions", hotelId]);

            // Optimistically update to the new value
            queryClient.setQueryData(["reactions", hotelId], newReaction);

            // Return a context object with the snapshotted value
            return { previousReaction };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newReaction, context: any) => {
            queryClient.setQueryData(["reactions", hotelId], context?.previousReaction);
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["reactions", hotelId] });
            // Also invalidate profile since it depends on reactions
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};
