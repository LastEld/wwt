import { OpenAI } from "openai";
import { logger } from "../../lib/logger";

export type CommunicationTemplate = "CLIENT_INTRO" | "PROPOSAL_SUMMARY" | "FOLLOW_UP";

export interface TemplateData {
    agentName: string;
    clientName: string;
    hotelNames: string[];
    destination: string;
    highlights: string[];
    priceRange?: string;
}

export class CommunicationService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    /**
     * Generates high-fidelity luxury travel content based on selected template.
     */
    async generateContent(template: CommunicationTemplate, data: TemplateData): Promise<string> {
        // Simulator Fallback for placeholder API keys
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("xxx")) {
            logger.warn("[CommunicationService] Placeholder API key detected, entering Simulator mode");
            return `[SIMULATED ${template}] High-fidelity luxury content draft for ${data.clientName} regarding ${data.destination}. (Requires valid OpenAI Key for full GPT-4o output)`;
        }

        const systemPrompt = `
            You are a luxury travel concierge writing for a high-end travel agency called WinWin Travel.
            Your tone is sophisticated, professional, and personalized.
            Always use rich vocabulary and emphasize hyper-personalization and data-driven insights.
            Format output in clean Markdown.
        `;

        const userPrompt = this.getPromptForTemplate(template, data);

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
            });

            return response.choices[0].message.content || "";
        } catch (error) {
            logger.error({ error, template }, "[CommunicationService] Failed to generate content");
            throw new Error("Failed to generate luxury content");
        }
    }

    private getPromptForTemplate(template: CommunicationTemplate, data: TemplateData): string {
        const hotelList = data.hotelNames.join(", ");
        const highlightList = data.highlights.join(", ");

        switch (template) {
            case "CLIENT_INTRO":
                return `Draft a sophisticated introductory email from ${data.agentName} to ${data.clientName} regarding their upcoming trip to ${data.destination}. Mention that we are using neural discovery to curate options including ${hotelList}.`;
            case "PROPOSAL_SUMMARY":
                return `Create a compelling trip proposal summary for ${data.clientName} for a luxury stay in ${data.destination}. Feature these key highlights: ${highlightList}. The suggested properties are ${hotelList}. Emphasize the curated nature of these matches.`;
            case "FOLLOW_UP":
                return `Write a polite, high-luxury follow-up email from ${data.agentName} to ${data.clientName}. Reference our previous proposal for ${data.destination} and mention that availability for ${data.hotelNames[0]} is tightening.`;
            default:
                return "";
        }
    }
}

export const communicationService = new CommunicationService();
