"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Star, ArrowRight, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface WishlistItem {
    id: string;
    hotelId: string;
    integration: string;
    priceAtReaction?: number;
    starRating?: number;
    amenities: string[];
    createdAt: string;
    // We'll mock the hotel details since we only have hotelId in reactions
    hotelName?: string;
    location?: string;
    imageUrl?: string;
}

export default function WishlistPage() {
    const { data: session } = useSession();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!session) return;
            try {
                const resp = await fetch("/api/reactions");
                const data = await resp.json();

                // Hydrate with mock hotel names/images since reactions only store ID
                const hydrated = data.map((item: any) => ({
                    ...item,
                    hotelName: getMockHotelName(item.hotelId),
                    location: "Luxury Destination",
                    imageUrl: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60`,
                }));

                setWishlist(hydrated);
            } catch (error) {
                console.error("Failed to fetch wishlist:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, [session]);

    const removeFromWishlist = async (id: string, hotelId: string, integration: string) => {
        try {
            await fetch("/api/reactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hotelId,
                    integration,
                    type: "NONE" // Assuming NONE removes the like
                }),
            });
            setWishlist(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
        }
    };

    function getMockHotelName(id: string) {
        const names: Record<string, string> = {
            "mock-hotel-1": "Luxe Grand Resort",
            "mock-hotel-2": "Urban Boutique Hotel",
            "mock-hotel-3": "Royal Safari Lodge",
        };
        return names[id] || `Hotel ${id.substring(0, 5)}`;
    }

    if (!session) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center p-4 text-center">
                <Heart className="w-16 h-16 text-brand-gold/20 mb-6" />
                <h1 className="font-display text-3xl font-bold text-brand mb-4">Your Wishlist Awaits</h1>
                <p className="text-brand-muted max-w-md mb-8">
                    Sign in to save your favorite luxury destinations and get AI-powered price alerts.
                </p>
                <Link href="/auth/signin" className="bg-brand text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-gold transition-colors">
                    Sign In to Save
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="font-display text-4xl font-bold text-brand mb-2">My Wishlist</h1>
                        <p className="text-brand-muted">Your curated selection of neural-matched escapes.</p>
                    </div>
                    <div className="bg-brand-light px-4 py-2 rounded-full border border-brand/5 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-brand-gold fill-brand-gold" />
                        <span className="font-bold text-brand">{wishlist.length} Saved</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-brand-light/20 rounded-3xl border-2 border-dashed border-brand/10">
                        <ShoppingBag className="w-16 h-16 text-brand/10 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-brand mb-2">No favorites yet</h2>
                        <p className="text-brand-muted mb-8">Start exploring and save the hotels that catch your eye.</p>
                        <Link href="/search" className="inline-flex items-center gap-2 text-brand font-bold hover:text-brand-gold transition-colors">
                            Discover Hotels <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {wishlist.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="relative h-60">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${item.imageUrl})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <button
                                            onClick={() => removeFromWishlist(item.id, item.hotelId, item.integration)}
                                            className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                                                <span className="text-white text-sm font-bold">{item.starRating}</span>
                                            </div>
                                            <h3 className="font-display text-xl font-bold text-white">{item.hotelName}</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-1 text-brand-muted text-sm mb-4">
                                            <MapPin className="w-4 h-4" />
                                            <span>{item.location}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {item.amenities.slice(0, 3).map(a => (
                                                <span key={a} className="text-[10px] uppercase tracking-wider font-bold bg-brand-light text-brand px-2 py-1 rounded">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-brand-muted text-xs">Saved price</span>
                                                <div className="text-xl font-bold text-brand">
                                                    €{item.priceAtReaction || "???"}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/hotel/${item.hotelId}`}
                                                className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-gold transition-colors flex items-center gap-2"
                                            >
                                                Details <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </main>
    );
}
