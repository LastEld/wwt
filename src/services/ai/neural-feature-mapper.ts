import { HotelOffer } from "../../integrations/integration-adapter.interface";
import { UserPreferenceProfile } from "./profile-service";

/**
 * Maps domain objects to Float32Arrays for ONNX inference.
 * Vector lengths: User=128, Hotel=256
 */
export class NeuralFeatureMapper {
    static mapUser(profile: UserPreferenceProfile): Float32Array {
        const vector = new Float32Array(128).fill(0);

        // 1. Preferred Star Rating (Normalized 0-1)
        vector[0] = profile.preferredStarRating / 5;

        // 2. Price Preference (Normalized 0-1 based on a 1k scale)
        vector[1] = Math.min(1, profile.preferredPriceRange.max / 1000);

        // 3. Amenity Importance (Top 10 common amenities mapped to specific indices)
        const commonAmenities = ['wifi', 'pool', 'spa', 'gym', 'breakfast', 'parking', 'bar', 'restaurant', 'air conditioning', 'room service'];
        commonAmenities.forEach((amenity, i) => {
            vector[2 + i] = profile.amenityImportance[amenity] || 0;
        });

        return vector;
    }

    static mapHotel(offer: HotelOffer): Float32Array {
        const vector = new Float32Array(256).fill(0);

        // 1. Star Rating
        vector[0] = offer.starRating / 5;

        // 2. Base Price
        vector[1] = Math.min(1, offer.price.amount / 1000);

        // 3. Review Score
        vector[2] = offer.reviewScore / 10;

        // 4. Amenities (One-hotish encoding for common ones)
        const commonAmenities = ['wifi', 'pool', 'spa', 'gym', 'breakfast', 'parking', 'bar', 'restaurant', 'air conditioning', 'room service'];
        offer.amenities.forEach(a => {
            const idx = commonAmenities.indexOf(a.toLowerCase());
            if (idx !== -1) vector[3 + idx] = 1;
        });

        return vector;
    }
}
