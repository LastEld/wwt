import {
    HotelOffer,
    IntegrationAdapter,
    NormalizedSearchRequest,
    HotelDetails,
    AvailabilityResult,
    BookingRequest,
    BookingConfirmation,
    DateRange,
    RoomDetails
} from "../integration-adapter.interface";

export class MockAdapter implements IntegrationAdapter {
    readonly name = "mock";
    readonly priority = 100;

    async search(request: NormalizedSearchRequest): Promise<HotelOffer[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            {
                id: "mock-hotel-1",
                name: "Luxe Grand Resort",
                provider: this.name,
                starRating: 5,
                reviewScore: 9.2,
                location: {
                    lat: 48.8566,
                    lng: 2.3522,
                    address: "123 Rue de Rivoli, Paris",
                },
                images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
                price: {
                    amount: 250,
                    currency: "EUR",
                    totalAmount: 500,
                },
                amenities: ["WiFi", "Pool", "Spa", "Gym"],
            },
            {
                id: "mock-hotel-2",
                name: "Urban Boutique Hotel",
                provider: this.name,
                starRating: 4,
                reviewScore: 8.5,
                location: {
                    lat: 48.8606,
                    lng: 2.3376,
                    address: "15 Avenue de l'Opéra, Paris",
                },
                images: ["https://images.unsplash.com/photo-1551882547-ff43c33fefee"],
                price: {
                    amount: 180,
                    currency: "EUR",
                    totalAmount: 360,
                },
                amenities: ["WiFi", "Breakfast", "Bar"],
            }
        ];
    }

    async getHotelDetails(hotelId: string): Promise<HotelDetails> {
        const hotels = await this.search({} as any);
        const hotel = hotels.find(h => h.id === hotelId) || hotels[0];

        return {
            ...hotel,
            description: "A beautiful hotel in the heart of the city, offering premium services and stunning views.",
            facilities: ["Room Service", "Laundry", "Concierge"],
            rooms: [
                {
                    id: `${hotelId}-room-1`,
                    name: "Deluxe King Room",
                    description: "Spacious room with a king-size bed and city view.",
                    capacity: { adults: 2, children: 1 },
                    amenities: ["TV", "Mini-bar", "Coffee Machine"],
                    images: [hotel.images[0]],
                    price: { amount: hotel.price.amount, currency: hotel.price.currency },
                    available: true
                }
            ]
        };
    }

    async checkAvailability(hotelId: string, roomId: string, dates: DateRange): Promise<AvailabilityResult> {
        return {
            available: true,
            priceChanged: false,
            roomsLeft: 3
        };
    }

    async createBooking(request: BookingRequest): Promise<BookingConfirmation> {
        return {
            bookingId: `mock-res-${Math.floor(Math.random() * 10000)}`,
            status: "CONFIRMED",
            providerConfirmationId: "HB-MOCK-999",
            totalPrice: 500,
            currency: "EUR"
        };
    }
}
