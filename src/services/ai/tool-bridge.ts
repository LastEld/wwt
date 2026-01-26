import { searchOrchestrator } from "../search/search-orchestrator";
import { logger } from "../../lib/logger";

export const TOOL_DEFINITIONS = [
    {
        type: "function",
        function: {
            name: "search_hotels",
            description: "Search for hotels based on location, dates, and preferences.",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "City or landmark name" },
                    checkIn: { type: "string", description: "ISO date string" },
                    checkOut: { type: "string", description: "ISO date string" },
                    adults: { type: "number", default: 2 },
                    minPrice: { type: "number" },
                    maxPrice: { type: "number" },
                    amenities: { type: "array", items: { type: "string" } }
                },
                required: ["location"]
            }
        }
    }
];

export class ToolBridge {
    /**
     * Maps function calls from GPT to internal service methods.
     */
    static async handleToolCall(name: string, args: any, userId?: string) {
        if (name === "search_hotels") {
            logger.info({ location: args.location }, "ToolBridge triggering AI search");

            // 1. Resolve Conversational Dates
            let checkIn = args.checkIn ? new Date(args.checkIn) : new Date();
            let checkOut = args.checkOut ? new Date(args.checkOut) : new Date(Date.now() + 86400000 * 3);

            // Handle "Ambiguity" as per guidelines: "Next Weekend" logic if not specified
            if (!args.checkIn) {
                const today = new Date();
                const daysToFriday = (5 - today.getDay() + 7) % 7;
                const nextFriday = new Date(today.getTime() + daysToFriday * 86400000);
                const nextSunday = new Date(nextFriday.getTime() + 2 * 86400000);
                checkIn = nextFriday;
                checkOut = nextSunday;
            }

            const request = {
                destination: {
                    name: args.location,
                    lat: 48.8566, // Default to center if landmark unknown for MVP
                    lng: 2.3522
                },
                stay: {
                    checkIn,
                    checkOut
                },
                occupancy: {
                    adults: args.adults || 2,
                    children: [],
                    rooms: 1
                },
                currency: "EUR"
            };

            const filters = {
                minPrice: args.minPrice,
                maxPrice: args.maxPrice,
                amenities: args.amenities
            };

            // 2. Clear previous search state via socket in orchestrator or just return data
            const results = await searchOrchestrator.search(request as any, filters, "relevance", userId);

            return {
                status: "success",
                count: results.results.length,
                topResults: results.results.slice(0, 3).map(r => ({
                    id: r.id,
                    name: r.name,
                    price: r.price.amount,
                    score: (r as any).score
                }))
            };
        }

        throw new Error(`Tool ${name} not found`);
    }
}
