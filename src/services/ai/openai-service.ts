import OpenAI from "openai";
import { ToolBridge, TOOL_DEFINITIONS } from "./tool-bridge";
import { ProfileService } from "./profile-service";
import { searchOrchestrator } from "../search/search-orchestrator";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export class OpenAIService {
    /**
     * High-performance chat stream with tool-call automation.
     */
    static async chatStream(messages: any[], userId?: string) {
        const profile = userId ? await ProfileService.getProfile(userId).catch(() => null) : null;

        // Inject personalization context into system prompt
        const systemPrompt = `
You are the WinWin Travel AI Concierge. 
User Preference Context: ${profile ? JSON.stringify(profile) : "New Traveler"}
Always priorityze clarity and luxury tone.
        `;

        const response = await client.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            tools: TOOL_DEFINITIONS as any,
            stream: true,
        });

        return response;
    }

    /**
     * Executes tool calls and returns the results to GPT.
     */
    static async handleToolCalls(toolCalls: any[], userId?: string) {
        const results = [];
        for (const tc of toolCalls) {
            const data = await ToolBridge.handleToolCall(
                tc.function.name,
                JSON.parse(tc.function.arguments),
                userId
            );
            results.push({
                tool_call_id: tc.id,
                role: "tool",
                name: tc.function.name,
                content: JSON.stringify(data)
            });
        }
        return results;
    }
}
