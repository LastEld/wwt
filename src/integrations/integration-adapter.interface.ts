export interface DateRange {
    checkIn: Date;
    checkOut: Date;
}

export interface NormalizedSearchRequest {
    destination: {
        lat?: number;
        lng?: number;
        radius?: number;
        name: string;
    };
    stay: DateRange;
    occupancy: {
        adults: number;
        children: number[];
        rooms: number;
    };
    currency: string;
}

export interface HotelOffer {
    id: string;
    name: string;
    provider: string;
    starRating: number;
    reviewScore: number;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    images: string[];
    price: {
        amount: number;
        currency: string;
        totalAmount: number;
    };
    amenities: string[];
    cancellationPolicy?: string;
}

export interface HotelDetails extends HotelOffer {
    description: string;
    rooms: RoomDetails[];
    facilities: string[];
    contact?: {
        phone?: string;
        email?: string;
    };
}

export interface RoomDetails {
    id: string;
    name: string;
    description: string;
    capacity: {
        adults: number;
        children: number;
    };
    amenities: string[];
    images: string[];
    price: {
        amount: number;
        currency: string;
    };
    available: boolean;
}

export interface AvailabilityResult {
    available: boolean;
    priceChanged: boolean;
    newPrice?: number;
    roomsLeft?: number;
}

export interface BookingRequest {
    hotelId: string;
    roomId: string;
    dates: DateRange;
    guestName: string;
    guestEmail: string;
    paymentDetails: any;
}

export interface BookingConfirmation {
    bookingId: string;
    status: 'CONFIRMED' | 'PENDING' | 'FAILED';
    providerConfirmationId?: string;
    totalPrice: number;
    currency: string;
}

export interface IntegrationAdapter {
    readonly name: string;
    readonly priority: number;
    search(request: NormalizedSearchRequest): Promise<HotelOffer[]>;
    getHotelDetails(hotelId: string): Promise<HotelDetails>;
    checkAvailability(hotelId: string, roomId: string, dates: DateRange): Promise<AvailabilityResult>;
    createBooking(request: BookingRequest): Promise<BookingConfirmation>;
}
