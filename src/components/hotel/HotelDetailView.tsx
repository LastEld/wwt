"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HotelGallery } from "./HotelGallery";
import { RoomList } from "./RoomList";
import { PropertyMap } from "./PropertyMap";
import { Heart, Star, ShieldCheck, Zap, BellRing } from "lucide-react";
import { useHotelReaction } from "../../hooks/use-hotel-reaction";
import { useSocket } from "../providers/socket-provider";
import { motion, AnimatePresence } from "framer-motion";

export const HotelDetailView = ({ hotel }: { hotel: any }) => {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const { mutate: react } = useHotelReaction(hotel.id);
    const { socket } = useSocket();
    const [priceAlert, setPriceAlert] = useState<any>(null);

    // 1. Socket: Join Hotel Room & Listen for price changes
    useEffect(() => {
        if (!socket) return;

        socket.emit("hotel:join", hotel.id);
        console.log(`[Socket] Joined room hotel:${hotel.id}`);

        socket.on("price:update", (data: any) => {
            console.log("[Socket] Live Price Alert:", data);
            setPriceAlert(data);
        });

        return () => {
            socket.emit("hotel:leave", hotel.id);
            socket.off("price:update");
        };
    }, [socket, hotel.id]);

    const toggleLike = () => {
        const next = !isLiked;
        setIsLiked(next);
        react({
            hotelId: hotel.id,
            integration: hotel.provider,
            type: next ? "LIKE" : "DISLIKE",
            priceAtReaction: hotel.price.amount,
            starRating: hotel.starRating,
            amenities: hotel.amenities
        });
    };

    const handleReserve = () => {
        router.push(`/checkout/${hotel.id}?name=${encodeURIComponent(hotel.name)}&price=${hotel.price.amount}&provider=${hotel.provider}`);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Price Alert Banner */}
            <AnimatePresence>
                {priceAlert && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-brand-gold text-white text-center py-2 px-4 flex items-center justify-center gap-3 font-bold text-xs uppercase overflow-hidden"
                    >
                        <BellRing className="w-4 h-4" />
                        Live Update: Price for this property just dropped to €{priceAlert.newPrice}!
                        <button className="underline ml-4" onClick={() => setPriceAlert(null)}>Dismiss</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Intro Bar */}
            <div className="pt-32 pb-8 px-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-gold">Luxury Discovery</span>
                        <div className="flex items-center text-brand-gold">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs font-bold ml-1">{hotel.starRating}.0</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-brand mb-4">
                        {hotel.name}
                    </h1>
                    <p className="text-brand-muted text-lg font-medium">{hotel.location.address}</p>
                </div>

                <div className="flex gap-4">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleLike}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLiked ? "bg-red-500 text-white shadow-lg" : "glass text-brand hover:scale-110"
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    </motion.button>
                    <div className="text-right">
                        <div className="text-sm font-bold uppercase tracking-tighter text-brand-muted">Starting from</div>
                        <div className="text-4xl font-bold italic text-brand">€{hotel.price.amount}</div>
                    </div>
                </div>
            </div>

            <HotelGallery images={hotel.images} />

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-16 pb-32">
                <div className="lg:col-span-2">
                    <section className="mb-16">
                        <h2 className="font-display text-3xl font-bold text-brand mb-8">About this property</h2>
                        <p className="text-brand-muted text-lg leading-relaxed mb-8">
                            Experience the pinnacle of Parisian elegance. This historic property, newly neuralized
                            for modern comfort, offers an unparalleled wellness ecosystem including a world-class
                            subterranean spa, curated forest-derived breakfasts, and neural-sync sleep systems in every suite.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {hotel.amenities.map((a: string) => (
                                <div key={a} className="flex items-center gap-2 text-sm font-bold text-brand uppercase">
                                    <ShieldCheck className="w-5 h-5 text-brand-gold" />
                                    {a}
                                </div>
                            ))}
                        </div>
                    </section>

                    <RoomList rooms={hotel.rooms} />

                    <PropertyMap location={hotel.location} />
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block">
                    <div className="sticky top-32 glass p-8 rounded-[32px] border border-black/5 shadow-premium">
                        <div className="bg-brand text-white p-6 rounded-2xl mb-8 flex items-center gap-4">
                            <Zap className="w-8 h-8 text-brand-gold" />
                            <div>
                                <h4 className="font-bold text-sm tracking-tight">Neural Price Lock</h4>
                                <p className="text-[10px] opacity-60 font-medium">Monitoring providers in real-time</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-brand-muted">3 Nights stay</span>
                                <span className="text-brand">€1,350</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-brand-muted">Neural Matching Fee</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <div className="w-full h-px bg-black/5" />
                            <div className="flex justify-between items-center">
                                <span className="font-display text-xl font-bold text-brand">Total</span>
                                <span className="text-2xl font-bold italic text-brand">€1,350</span>
                            </div>
                        </div>

                        <button
                            onClick={handleReserve}
                            className="w-full py-5 rounded-2xl bg-brand text-white font-bold uppercase tracking-widest hover:bg-brand-gold transition-all shadow-lg active:scale-95"
                        >
                            Reserve Instant Match
                        </button>
                        <p className="text-center text-[10px] font-bold text-brand-muted mt-4 uppercase">No credit card required today</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
