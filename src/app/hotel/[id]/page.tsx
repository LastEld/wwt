import { ShieldCheck, Zap } from "lucide-react";
import { HotelDetailView } from "@/components/hotel/HotelDetailView";

export default async function HotelPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // Simulation: Fetching detail data
    const hotel = {
        id,
        name: "L'Hôtel de la Marine",
        provider: "Hotelbeds",
        starRating: 5,
        reviewScore: 9.4,
        location: {
            lat: 48.8566,
            lng: 2.3522,
            address: "2 Place de la Concorde, 75008 Paris"
        },
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1551882547-ff43c638f511?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
        ],
        price: {
            amount: 450,
            currency: "EUR"
        },
        amenities: ["WiFi", "Pool", "Spa", "Gym", "Breakfast"],
        rooms: [
            { name: "Deluxe King Room", price: { amount: 450 }, images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=600"] },
            { name: "Executive Suite", price: { amount: 680 }, images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600"] },
            { name: "Presidential Lodge", price: { amount: 1200 }, images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600"] }
        ]
    };

    return <HotelDetailView hotel={hotel} />;
}
