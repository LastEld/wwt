/**
 * Booking-related TypeScript Types
 * 
 * DTOs for booking requests, confirmations, and status.
 */

// ============================================
// Booking Request Types
// ============================================

export interface BookingRequest {
    hotelId: string;
    roomId: string;
    integrationName: string;
    checkIn: string; // ISO date
    checkOut: string; // ISO date
    guests: BookingGuests;
    rooms: number;
    guestDetails: GuestDetails;
    paymentMethod: PaymentMethod;
    specialRequests?: string;
    priceLockToken: string; // Redis price lock token
}

export interface BookingGuests {
    adults: number;
    children?: ChildGuest[];
}

export interface ChildGuest {
    age: number;
    name?: string;
}

export interface GuestDetails {
    title: 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Other';
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

export interface PaymentMethod {
    type: 'card' | 'paypal' | 'bank-transfer';
    // Card details handled by payment processor (Stripe)
    paymentIntentId?: string;
}

// ============================================
// Booking Response Types
// ============================================

export interface BookingConfirmation {
    bookingId: string;
    confirmationNumber: string;
    status: BookingStatusType;
    hotel: BookingHotelInfo;
    room: BookingRoomInfo;
    stay: BookingStayInfo;
    pricing: BookingPricing;
    guestDetails: GuestDetails;
    createdAt: string;
    confirmationEmail: string;
}

export interface BookingHotelInfo {
    hotelId: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    checkInInstructions?: string;
}

export interface BookingRoomInfo {
    roomId: string;
    name: string;
    description: string;
    mealPlan: string;
}

export interface BookingStayInfo {
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: BookingGuests;
    rooms: number;
}

export interface BookingPricing {
    pricePerNight: number;
    subtotal: number;
    taxes: number;
    fees: number;
    total: number;
    currency: string;
    breakdown: PriceBreakdownItem[];
}

export interface PriceBreakdownItem {
    label: string;
    amount: number;
    type: 'room' | 'tax' | 'fee' | 'discount';
}

// ============================================
// Booking Status Types
// ============================================

export type BookingStatusType =
    | 'pending'
    | 'confirmed'
    | 'cancelled'
    | 'completed'
    | 'failed'
    | 'refund-pending';

export interface BookingStatusUpdate {
    bookingId: string;
    previousStatus: BookingStatusType;
    newStatus: BookingStatusType;
    timestamp: string;
    reason?: string;
}

// ============================================
// Price Lock Types
// ============================================

export interface PriceLockRequest {
    hotelId: string;
    roomId: string;
    integrationName: string;
    pricePerNight: number;
    totalPrice: number;
    currency: string;
    sessionId: string;
}

export interface PriceLockResponse {
    token: string;
    expiresAt: string; // ISO date
    locked: boolean;
    price: {
        perNight: number;
        total: number;
        currency: string;
    };
}
