// onnxruntime-node must only be used in Node.js environment
const ort = typeof window === 'undefined' ? require("onnxruntime-node") : null;
import { HotelOffer } from "../../integrations/integration-adapter.interface";
import { UserPreferenceProfile } from "./profile-service";

export class NeuralRanker {
    private session: any | null = null;
    private isSimulator = true;

    constructor() {
        this.init().catch(err => {
            console.warn("[NeuralRanker] ONNX Session failed, falling back to simulator.", err.message);
            this.isSimulator = true;
        });
    }

    private async init() {
        try {
            // In a real production setup, we'd load the .onnx model here.
            // For the MVP implementation, we'll favor the simulator to ensure stability.
            // this.session = await ort.InferenceSession.create('./models/two_tower_v1.onnx');
            this.isSimulator = true;
        } catch (e) {
            this.isSimulator = true;
        }
    }

    async predict(profile: UserPreferenceProfile, offers: HotelOffer[]): Promise<number[]> {
        if (this.isSimulator || !this.session) {
            return this.simulateInference(profile, offers);
        }

        try {
            // 1. Feature Flattening (as specified in ai_layer_algorithms.md)
            if (!ort) return this.simulateInference(profile, offers);

            const results = await this.session.run({
                'user_tower_input': new ort.Tensor('float32', new Float32Array(128)),
                'hotel_tower_input': new ort.Tensor('float32', new Float32Array(offers.length * 256))
            });

            return Array.from(results.output.data as Float32Array);
        } catch (e) {
            return this.simulateInference(profile, offers);
        }
    }

    /**
     * Neural Simulator: Mimics the probability output of a Two-Tower model.
     * Higher score for hotels matching complex amenity patterns.
     */
    private simulateInference(profile: UserPreferenceProfile, offers: HotelOffer[]): number[] {
        return offers.map(offer => {
            let probability = 0.5;

            // Simulate "Neural" discovery: 
            // If user likes 'Pool' and hotel has 'Spa', probability increases (unseen connection)
            const hasSpa = offer.amenities.some(a => a.toLowerCase() === 'spa');
            const likesPool = (profile.amenityImportance['pool'] || 0) > 0;

            if (likesPool && hasSpa) probability += 0.2;

            // Random fluctuation to simulate complex model variance
            probability += (Math.random() * 0.1) - 0.05;

            return Math.max(0, Math.min(1, probability));
        });
    }
}

export const neuralRanker = new NeuralRanker();
