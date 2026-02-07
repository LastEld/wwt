"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useHotelReaction } from "../../hooks/use-hotel-reaction";

import { HotelOffer } from "../../integrations/integration-adapter.interface";

interface HotelCardProps {
    hotel: HotelOffer & { score?: number };
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
    const router = useRouter();
    const [currentImg, setCurrentImg] = useState(0);
    const { mutate: react, isPending: isSubmitting } = useHotelReaction(hotel.id);
    const [isLiked, setIsLiked] = useState(false);

    const handleToggleLike = async () => {
        const nextState = !isLiked;
        setIsLiked(nextState);

        react({
            hotelId: hotel.id,
            integration: hotel.provider,
            type: nextState ? "LIKE" : "DISLIKE",
            priceAtReaction: hotel.price.amount,
            starRating: hotel.starRating,
            amenities: hotel.amenities
        });
    };

    const images = hotel.images?.length > 0 ? hotel.images : ["/placeholders/hotel-1.jpg"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-glass hover:shadow-premium transition-all duration-500 border border-black/5"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImg}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full relative"
                    >
                        <img
                            src={images[currentImg]}
                            alt={hotel.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* AI Match Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand">
                            AI Match {Math.round((hotel.score || 0) * 100)}%
                        </span>
                    </div>
                </div>

                <div className="absolute top-4 right-4 z-10">
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLike();
                        }}
                        disabled={isSubmitting}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-red-500 text-white shadow-lg' : 'glass text-brand hover:scale-110'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>
                </div>

                {/* Carousel Controls (Mobile) */}
                <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {images.map((_: any, i: number) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImg ? 'bg-white scale-125' : 'bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < hotel.starRating ? 'text-brand-gold fill-brand-gold' : 'text-black/10'}`}
                                />
                            ))}
                        </div>
                        <h3 className="font-display text-xl font-bold text-brand line-clamp-1">
                            {hotel.name}
                        </h3>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-brand italic">€{hotel.price.amount}</span>
                        <span className="text-[10px] uppercase font-bold text-brand-muted tracking-tight">Per Night</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-brand-muted mb-6">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{hotel.location?.address || 'Luxembourg City'}</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                    {hotel.amenities?.slice(0, 3).map((amenity: string) => (
                        <span key={amenity} className="px-2.5 py-1 rounded-lg bg-black/5 text-[10px] font-bold uppercase text-brand-muted">
                            {amenity}
                        </span>
                    ))}
                    {hotel.amenities?.length > 3 && (
                        <span className="text-[10px] font-bold text-brand-gold">+{hotel.amenities.length - 3} More</span>
                    )}
                </div>

                <button
                    onClick={() => router.push(`/hotel/${hotel.id}?name=${encodeURIComponent(hotel.name)}&provider=${hotel.provider}&price=${hotel.price.amount}`)}
                    className="w-full py-4 rounded-2xl bg-brand text-white text-sm font-bold uppercase tracking-widest hover:bg-brand-gold hover:shadow-premium transition-all active:scale-95"
                >
                    View Property
                </button>
            </div>
        </motion.div>
    );
};
