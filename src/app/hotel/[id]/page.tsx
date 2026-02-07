import { HotelDetailView } from "@/components/hotel/HotelDetailView";
import { MockAdapter } from "@/integrations/mock/mock-adapter";

const mockAdapter = new MockAdapter();

export default async function HotelPage({ params }: { params: { id: string } }) {
    const { id } = params;

    let hotel;
    try {
        const details = await mockAdapter.getHotelDetails(id);
        hotel = {
            id: details.id,
            name: details.name,
            provider: details.provider,
            starRating: details.starRating,
            reviewScore: details.reviewScore,
            location: details.location,
            images: details.images.length > 0 ? details.images : [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1551882547-ff43c638f511?auto=format&fit=crop&q=80&w=800",
            ],
            price: details.price,
            amenities: details.amenities,
            description: details.description,
            rooms: details.rooms.map(r => ({
                id: r.id,
                name: r.name,
                description: r.description,
                price: r.price,
                images: r.images.length > 0 ? r.images : ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=600"],
                amenities: r.amenities,
                capacity: r.capacity,
                available: r.available,
            })),
        };
    } catch {
        // Fallback to static mock
        hotel = {
            id,
            name: "Luxe Grand Resort",
            provider: "mock",
            starRating: 5,
            reviewScore: 9.2,
            location: { lat: 48.8566, lng: 2.3522, address: "123 Rue de Rivoli, Paris" },
            images: [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1551882547-ff43c638f511?auto=format&fit=crop&q=80&w=800",
            ],
            price: { amount: 250, currency: "EUR" },
            amenities: ["WiFi", "Pool", "Spa", "Gym", "Breakfast"],
            description: "A beautiful hotel in the heart of the city.",
            rooms: [
                { id: `${id}-room-1`, name: "Deluxe King Room", description: "Spacious room with a king-size bed.", price: { amount: 250 }, images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=600"], amenities: ["TV", "Mini-bar"], capacity: { adults: 2, children: 1 }, available: true },
            ],
        };
    }

    return <HotelDetailView hotel={hotel} />;
}
