import { OpenAI } from "openai";
import { logger } from "../../lib/logger";

export interface ItineraryDisplay {
    day: number;
    title: string;
    description: string;
    activities: {
        time: string;
        activity: string;
        details: string;
        supplierId?: string;
    }[];
    hotel?: {
        hotelId: string;
        name: string;
        bookingToken?: string;
    };
}

export interface StructuredItinerary {
    title: string;
    destination: string;
    durationDays: number;
    totalEstimatedPrice: number;
    currency: string;
    days: ItineraryDisplay[];
}

export class ItineraryService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    /**
     * Generates a structured JSON itinerary based on agent requirements.
     */
    async generateItinerary(requirements: string): Promise<StructuredItinerary> {
        // Simulator Fallback for placeholder API keys
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("xxx")) {
            logger.warn("[ItineraryService] Placeholder API key detected, entering Simulator mode");
            return this.simulateItinerary(requirements);
        }

        const systemPrompt = `
            You are a luxury travel architect for winwin.travel. 
            You generate bookable, high-fidelity travel itineraries in JSON format.
            You must only output the JSON object. 
            The itinerary must be sophisticated, and luxurious, and use high-end vocabulary.
            Ensure every day has at least 3 activities and one property suggestion.
        `;

        const userPrompt = `
            Generate a detailed multi-day itinerary based on the following requirements:
            "${requirements}"
            
            JSON Schema:
            {
                "title": string,
                "destination": string,
                "durationDays": number,
                "totalEstimatedPrice": number,
                "currency": string,
                "days": [
                    {
                        "day": number,
                        "title": string,
                        "description": string,
                        "activities": [
                            { "time": string, "activity": string, "details": string, "supplierId": string }
                        ],
                        "hotel": { "hotelId": string, "name": string }
                    }
                ]
            }
        `;

        try {
            logger.info({ requirements: requirements.substring(0, 50) }, "[ItineraryService] Calling OpenAI gpt-4o");
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
            });

            const content = response.choices[0].message.content || "{}";
            logger.info("[ItineraryService] Successfully received JSON from GPT");
            return JSON.parse(content) as StructuredItinerary;
        } catch (error: any) {
            logger.error({
                message: error.message,
                code: error?.code,
                type: error?.type,
                status: error?.status
            }, "[ItineraryService] OpenAI/Parsing failure");
            throw error;
        }
    }

    /**
     * High-fidelity simulator for travel itineraries.
     */
    private simulateItinerary(requirements: string): StructuredItinerary {
        return {
            title: `Neural Journey: ${requirements.substring(0, 20)}...`,
            destination: "Discovery Zone",
            durationDays: 3,
            totalEstimatedPrice: 4500,
            currency: "EUR",
            days: [
                {
                    day: 1,
                    title: "Arrival & Neural Synchronization",
                    description: "Private transfer to your boutique property followed by a curated wellness session.",
                    activities: [
                        { time: "14:00", activity: "VIP Check-in", details: "Hand-picked suite overlooking the valley.", supplierId: "hotel-123" },
                        { time: "19:00", activity: "Tasting Menu", details: "Exclusive private dining experience." }
                    ],
                    hotel: { hotelId: "hotel-123", name: "Urban Boutique Hotel" }
                }
            ]
        };
    }
}

export const itineraryService = new ItineraryService();
