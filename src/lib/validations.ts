import * as z from "zod";

// ==========================================
// Search API Schemas
// ==========================================

export const SearchRequestSchema = z.object({
    destination: z.string().optional(),
    location: z.object({
        name: z.string(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        radius: z.number().min(1).max(100).optional(),
    }).optional(),
    dates: z.object({
        checkIn: z.string(),
        checkOut: z.string(),
    }).optional(),
    occupancy: z.object({
        adults: z.number().int().min(1).max(10).optional(),
        children: z.array(z.number().int().min(0).max(17)).optional(),
        rooms: z.number().int().min(1).max(10).optional(),
    }).optional(),
    currency: z.string().length(3).optional(),
    filters: z.record(z.string(), z.unknown()).optional(),
    sort: z.enum(["relevance", "price_asc", "price_desc", "rating"]).optional(),
    userId: z.string().optional(),
    query: z.string().max(500).optional(),
});

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

// ==========================================
// Booking API Schemas
// ==========================================

export const BookingInitializeSchema = z.object({
    action: z.literal("INITIALIZE"),
    data: z.object({
        hotelId: z.string().min(1),
        roomType: z.string().min(1),
        integration: z.string().min(1),
        pricePerNight: z.number().positive(),
        totalPrice: z.number().positive(),
        currency: z.string().length(3),
        checkIn: z.string(),
        checkOut: z.string(),
        nights: z.number().int().positive(),
        guests: z.number().int().positive().optional(),
    }),
});

export const BookingConfirmSchema = z.object({
    action: z.literal("CONFIRM"),
    data: z.object({
        lockId: z.string().min(1),
        guestName: z.string().min(1).max(200),
        guestEmail: z.string().email(),
        guestPhone: z.string().max(30).optional(),
        specialRequests: z.string().max(1000).optional(),
    }),
});

export const BookingRequestSchema = z.union([
    BookingInitializeSchema,
    BookingConfirmSchema,
]);

export type BookingRequest = z.infer<typeof BookingRequestSchema>;

// ==========================================
// Chat API Schemas
// ==========================================

export const ChatRequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().max(5000),
    })).min(1).max(50),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// ==========================================
// Reactions API Schemas
// ==========================================

export const ReactionRequestSchema = z.object({
    hotelId: z.string().min(1),
    integration: z.string().optional(),
    type: z.enum(["LIKE", "DISLIKE"]),
    priceAtReaction: z.number().positive().optional(),
    starRating: z.number().min(1).max(5).optional(),
    amenities: z.array(z.string()).optional(),
});

export type ReactionRequest = z.infer<typeof ReactionRequestSchema>;

// ==========================================
// Validation Helper
// ==========================================

export function validateRequest<T>(schema: z.ZodType<T>, data: unknown):
    { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    const messages = result.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
    ).join("; ");
    return { success: false, error: messages };
}
