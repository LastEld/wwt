/**
 * Hotel-related TypeScript Types
 * 
 * DTOs for hotel details, rooms, and amenities.
 */

import type { GeoLocation, CancellationPolicy, MealPlanType } from './search';

// ============================================
// Hotel Detail Types
// ============================================

export interface HotelDetails {
    id: string;
    integrationName: string;
    hotelId: string;
    name: string;
    description: string;
    starRating: number;
    reviewScore: number;
    reviewCount: number;
    location: HotelLocation;
    images: HotelImage[];
    amenities: HotelAmenity[];
    policies: HotelPolicies;
    rooms: RoomType[];
    reviews?: HotelReview[];
}

export interface HotelLocation extends GeoLocation {
    address: string;
    city: string;
    country: string;
    postalCode?: string;
    neighborhood?: string;
    distanceFromCenter?: number; // km
    nearbyAttractions?: NearbyAttraction[];
}

export interface NearbyAttraction {
    name: string;
    type: 'landmark' | 'transport' | 'dining' | 'shopping' | 'entertainment';
    distance: number; // meters
    walkingTime?: number; // minutes
}

export interface HotelImage {
    url: string;
    caption?: string;
    category: 'exterior' | 'room' | 'bathroom' | 'lobby' | 'pool' | 'restaurant' | 'other';
    isPrimary?: boolean;
}

// ============================================
// Amenity Types
// ============================================

export interface HotelAmenity {
    id: string;
    name: string;
    category: AmenityCategory;
    icon?: string;
}

export type AmenityCategory =
    | 'general'
    | 'room'
    | 'wellness'
    | 'dining'
    | 'business'
    | 'accessibility'
    | 'family'
    | 'pets';

// ============================================
// Room Types
// ============================================

export interface RoomType {
    roomId: string;
    name: string;
    description: string;
    bedConfiguration: BedConfiguration[];
    maxOccupancy: number;
    size?: number; // sqm
    images: HotelImage[];
    amenities: string[];
    mealPlan: MealPlanType;
    pricePerNight: number;
    totalPrice: number;
    currency: string;
    availableRooms: number;
    cancellationPolicy: CancellationPolicy;
}

export interface BedConfiguration {
    type: 'single' | 'double' | 'queen' | 'king' | 'sofa-bed' | 'bunk';
    count: number;
}

// ============================================
// Policy Types
// ============================================

export interface HotelPolicies {
    checkIn: TimePolicy;
    checkOut: TimePolicy;
    cancellation: CancellationPolicy;
    paymentMethods: string[];
    childrenPolicy?: string;
    petPolicy?: PetPolicy;
    smokingPolicy: 'allowed' | 'designated-areas' | 'non-smoking';
}

export interface TimePolicy {
    from: string; // HH:mm
    to?: string;  // HH:mm
}

export interface PetPolicy {
    allowed: boolean;
    types?: string[];
    fee?: number;
    restrictions?: string;
}

// ============================================
// Review Types
// ============================================

export interface HotelReview {
    id: string;
    author: string;
    date: string;
    score: number;
    title?: string;
    content: string;
    categories?: ReviewCategory[];
    tripType?: 'business' | 'family' | 'couple' | 'solo' | 'group';
}

export interface ReviewCategory {
    name: string;
    score: number;
}
