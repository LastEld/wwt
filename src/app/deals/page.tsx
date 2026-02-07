"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Clock, Sparkles, MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Deal {
    id: string;
    hotelName: string;
    location: string;
    originalPrice: number;
    discountedPrice: number;
    discountPercent: number;
    imageUrl: string;
    rating: number;
    expiresIn: string;
    amenities: string[];
}

interface TrendingDestination {
    name: string;
    searchCount: number;
    trend: "RISING" | "STABLE" | "FALLING";
    imageUrl: string;
}

export default function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [trending, setTrending] = useState<TrendingDestination[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const resp = await fetch("/api/deals");
                const data = await resp.json();
                setDeals(data.deals || []);
                setTrending(data.trending || []);
            } catch (error) {
                console.error("Failed to fetch deals:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDeals();
    }, []);

    return (
        <main className="min-h-screen pt-24 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-black py-20">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />

                <div className="container mx-auto px-4 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Flame className="w-6 h-6 text-brand-gold" />
                            <span className="text-brand-gold font-bold text-sm uppercase tracking-widest">
                                Limited Time Offers
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
                            Exclusive <span className="text-brand-gold">Deals</span>
                        </h1>
                        <p className="text-xl text-white/70">
                            Neural-curated offers with guaranteed best prices.
                            Our AI monitors millions of rates to bring you unmatched value.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Trending Destinations */}
            <section className="py-16 bg-brand-light/30">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="w-6 h-6 text-brand-gold" />
                        <h2 className="font-display text-2xl font-bold text-brand">Trending Now</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {trending.map((dest, i) => (
                            <motion.div
                                key={dest.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={`/search?destination=${encodeURIComponent(dest.name)}`}
                                    className="group block relative h-48 rounded-2xl overflow-hidden"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${dest.imageUrl})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="font-display text-lg font-bold text-white">{dest.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${dest.trend === "RISING" ? "text-green-400" :
                                                    dest.trend === "FALLING" ? "text-red-400" : "text-white/60"
                                                }`}>
                                                {dest.trend === "RISING" ? "🔥 Hot" : dest.trend}
                                            </span>
                                            <span className="text-white/50 text-xs">
                                                {dest.searchCount.toLocaleString()} searches
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Flash Deals */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-brand-gold" />
                            <h2 className="font-display text-2xl font-bold text-brand">Flash Deals</h2>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-brand-muted">
                            <Clock className="w-4 h-4" />
                            <span>Expires soon</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl aspect-[4/5] shimmer" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {deals.map((deal, i) => (
                                <motion.div
                                    key={deal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="relative h-56">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${deal.imageUrl})` }}
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                                                -{deal.discountPercent}%
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-brand-gold" />
                                            <span className="text-white text-xs font-medium">{deal.expiresIn}</span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center gap-1 mb-2">
                                            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                                            <span className="text-sm font-semibold text-brand">{deal.rating}</span>
                                        </div>
                                        <h3 className="font-display text-xl font-bold text-brand mb-2">{deal.hotelName}</h3>
                                        <div className="flex items-center gap-1 text-brand-muted text-sm mb-4">
                                            <MapPin className="w-4 h-4" />
                                            <span>{deal.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-brand-muted line-through text-sm">€{deal.originalPrice}</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-brand">€{deal.discountedPrice}</span>
                                                    <span className="text-brand-muted text-sm">/night</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/hotel/${deal.id}`}
                                                className="bg-brand text-white p-3 rounded-xl hover:bg-brand-gold transition-colors"
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 bg-brand">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display text-3xl font-bold text-white mb-4">
                        Never Miss a Deal
                    </h2>
                    <p className="text-white/70 mb-8 max-w-xl mx-auto">
                        Get personalized price drop alerts delivered to your inbox.
                        Our AI tracks your preferences and notifies you when prices fall.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-gold"
                        />
                        <button className="bg-brand-gold text-brand px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
