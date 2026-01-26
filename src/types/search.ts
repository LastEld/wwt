/**
 * Search-related TypeScript Types
 * 
 * DTOs for search requests, filters, and responses.
 */

// ============================================
// Search Request Types
// ============================================

export interface SearchRequest {
    location: LocationQuery;
    stay: StayDetails;
    guests: GuestConfiguration;
    filters?: SearchFilters;
    pagination: PaginationParams;
    sort?: SortOption;
    integrations?: string[];
}

export interface LocationQuery {
    latitude: number;
    longitude: number;
    radius: number; // km
    address?: string;
    placeId?: string; // Google Places ID
}

export interface StayDetails {
    checkIn: string; // ISO date
    checkOut: string; // ISO date
}

export interface GuestConfiguration {
    adults: number;
    children?: number[];  // Ages of children
    rooms: number;
}

export interface PaginationParams {
    limit: number;
    offset: number;
}

// ============================================
// Filter Types
// ============================================

export interface SearchFilters {
    priceRange?: PriceRange;
    reviewScore?: ReviewScoreFilter;
    starRating?: number[];
    amenities?: string[];
    mealPlan?: MealPlanType[];
    freeCancellation?: boolean;
    hideDisliked?: boolean;
    hideLiked?: boolean;
}

export interface PriceRange {
    min: number;
    max: number;
    currency?: string;
}

export interface ReviewScoreFilter {
    min: number;
    max?: number;
}

export type MealPlanType =
    | 'room-only'
    | 'breakfast'
    | 'half-board'
    | 'full-board'
    | 'all-inclusive';

// ============================================
// Sort Types
// ============================================

export type SortOption =
    | 'price-asc'
    | 'price-desc'
    | 'rating-desc'
    | 'distance-asc'
    | 'relevance';

// ============================================
// Search Response Types
// ============================================

export interface SearchResponse {
    hotels: HotelSearchResult[];
    total: number;
    page: number;
    pageSize: number;
    filters: AppliedFilters;
    searchId: string;
    processingTime: number; // ms
    providerStatus: ProviderStatus[];
}

export interface HotelSearchResult {
    id: string; // Internal composite ID
    integrationName: string;
    hotelId: string;
    roomId: string;
    name: string;
    starRating: number;
    reviewScore: number;
    reviewCount: number;
    location: GeoLocation;
    address: string;
    images: string[];
    roomType: string;
    pricePerNight: number;
    totalPrice: number;
    currency: string;
    amenities: string[];
    mealPlan: MealPlanType;
    cancellationPolicy: CancellationPolicy;
    availableRooms: number;
    // AI personalization
    matchScore?: number;
    userReaction?: 'LIKE' | 'DISLIKE' | null;
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface CancellationPolicy {
    freeCancellation: boolean;
    deadline?: string; // ISO date
    penalties?: CancellationPenalty[];
}

export interface CancellationPenalty {
    fromDate: string;
    percentage: number;
}

export interface AppliedFilters {
    priceRange: PriceRange;
    activeFilters: string[];
}

export interface ProviderStatus {
    name: string;
    status: 'success' | 'partial' | 'error';
    resultsCount: number;
    responseTime: number;
}
