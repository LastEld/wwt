import { StructuredItinerary } from "./itinerary-service";
import { logger } from "../../lib/logger";

export interface Proposal {
    id: string;
    itineraryId: string;
    agencyName: string;
    agentName: string;
    clientName: string;
    title: string;
    summary: string;
    totalPrice: number;
    currency: string;
    days: any[];
    brandedAssets: {
        logoUrl: string;
        primaryColor: string;
        heroImage: string;
    };
}

export class ProposalService {
    /**
     * Fuses a structured itinerary with agency branding and luxury content.
     */
    generateProposal(itinerary: StructuredItinerary, agentName: string = "WinWin Agent"): Proposal {
        logger.info({ destination: itinerary.destination }, "[ProposalService] Synthesizing branded proposal");

        const proposalId = `prop_${Math.random().toString(36).substr(2, 9)}`;

        return {
            id: proposalId,
            itineraryId: "itinerary-123", // Linked to the source
            agencyName: "WinWin Travel",
            agentName,
            clientName: "Valued Client",
            title: itinerary.title,
            summary: `A bespoke journey through ${itinerary.destination}, curated specifically for your preferences. This exclusive proposal features neural-matched properties and hand-selected experiences.`,
            totalPrice: itinerary.totalEstimatedPrice,
            currency: itinerary.currency,
            days: itinerary.days.map(day => ({
                ...day,
                // Add luxury branding to day descriptions
                description: `[Curated] ${day.description}`
            })),
            brandedAssets: {
                logoUrl: "/brand/logo-gold.png",
                primaryColor: "#D4AF37", // Renaissance Gold
                heroImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000"
            }
        };
    }

    /**
     * Simulate PDF generation trigger.
     * In production, this would call a Puppeteer service.
     */
    async generatePdf(proposalId: string): Promise<string> {
        logger.info({ proposalId }, "[ProposalService] Initiating PDF synthesis");
        return `https://storage.winwin.travel/proposals/${proposalId}.pdf`;
    }
}

export const proposalService = new ProposalService();
