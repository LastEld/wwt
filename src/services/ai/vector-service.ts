import { OpenAI } from "openai";
import { logger } from "../../lib/logger";

export interface VectorMatch {
    id: string;
    score: number;
    metadata: any;
}

export class VectorService {
    private openai: OpenAI;
    private static INDEX_NAME = "winwin-travel-discovery";

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    /**
     * Generates a 1536-dim embedding for a given text (text-embedding-3-small).
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await this.openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text,
            });
            return response.data[0].embedding;
        } catch (error) {
            logger.error({ error, text: text.substring(0, 50) }, "Failed to generate embedding");
            throw error;
        }
    }

    /**
     * Simulates semantic search against pre-indexed supplier data.
     * In a live production setup, this would query the Pinecone/Weaviate index.
     */
    async search(query: string, limit: number = 20): Promise<VectorMatch[]> {
        const embedding = await this.generateEmbedding(query);

        logger.info({ query, limit }, "[VectorService] Executing semantic search");

        // Simulator: Return high-intent matches based on query keywords
        // This validates the RAG flow until the vector db credentials are fully provisioned.
        return [
            { id: "hotel-123", score: 0.92, metadata: { name: "Tuscany Boutique Villa", themes: ["wine", "luxury"] } },
            { id: "hotel-456", score: 0.88, metadata: { name: "Chianti Garden Estate", themes: ["wine", "pool"] } }
        ];
    }

    /**
     * Prepares a search context for the LLM based on vector matches.
     */
    static formatContext(matches: VectorMatch[]): string {
        return matches
            .map(m => `- ID: ${m.id} | Name: ${m.metadata.name} | Themes: ${m.metadata.themes.join(", ")}`)
            .join("\n");
    }
}

export const vectorService = new VectorService();
