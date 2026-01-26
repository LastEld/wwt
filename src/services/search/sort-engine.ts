import { HotelOffer } from "../../integrations/integration-adapter.interface";

export type SortField = 'price_asc' | 'price_desc' | 'rating' | 'relevance';

export class SortEngine {
    static apply(offers: HotelOffer[], field: SortField = 'relevance'): HotelOffer[] {
        const sorted = [...offers];

        switch (field) {
            case 'price_asc':
                return sorted.sort((a, b) => a.price.amount - b.price.amount);
            case 'price_desc':
                return sorted.sort((a, b) => b.price.amount - a.price.amount);
            case 'rating':
                return sorted.sort((a, b) => b.starRating - a.starRating);
            case 'relevance':
                // For now, relevance is review score. 
                // In Step 6, this will use AI matching score.
                return sorted.sort((a, b) => b.reviewScore - a.reviewScore);
            default:
                return sorted;
        }
    }
}
