"use client";

import { useState, useEffect } from "react";
import { SearchHero } from "@/components/search/SearchHero";
import { FilterBar } from "@/components/search/FilterBar";
import { HotelCard } from "@/components/search/HotelCard";
import { useSocket } from "@/components/providers/socket-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

export default function SearchPage() {
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchStatus, setSearchStatus] = useState<string | null>(null);
    const { socket, isConnected } = useSocket();

    // Listen for real-time progressive results
    useEffect(() => {
        if (!socket) return;

        socket.on("search:partial_results", (data: any) => {
            console.log(`[Realtime] Received ${data.count} results from ${data.provider}`);
            setResults(prev => {
                // Simple deduplication for progressive updates
                const existingIds = new Set(prev.map(r => r.id));
                const newResults = data.offers.filter((o: any) => !existingIds.has(o.id));
                return [...prev, ...newResults].sort((a, b) => (b.score || 0) - (a.score || 0));
            });
            setSearchStatus(`Found ${data.count} matches via ${data.provider}...`);
        });

        return () => {
            socket.off("search:partial_results");
        };
    }, [socket]);

    const handleSearch = async (locationName: string = "Paris") => {
        setIsLoading(true);
        setResults([]);
        setSearchStatus("AI is scanning providers...");

        try {
            const resp = await fetch("/api/search", {
                method: "POST",
                body: JSON.stringify({
                    location: { name: locationName, lat: 48.8566, lng: 2.3522 },
                    dates: { checkIn: new Date(), checkOut: new Date(Date.now() + 86400000 * 3) },
                    occupancy: { adults: 2, children: [], rooms: 1 },
                    userId: "alex-123" // Test persona
                })
            });
            const data = await resp.json();
            // Even if REST returns full results, the socket might have sent partials already.
            // We merge to ensure consistency.
            setResults(prev => {
                const existingIds = new Set(prev.map(r => r.id));
                const finalResults = data.results.filter((o: any) => !existingIds.has(o.id));
                return [...prev, ...finalResults].sort((a, b) => (b.score || 0) - (a.score || 0));
            });
        } finally {
            setIsLoading(false);
            setSearchStatus(null);
        }
    };

    return (
        <div className="min-h-screen bg-brand-light/30">
            <SearchHero onSearch={handleSearch} />

            <FilterBar />

            <main className="max-w-7xl mx-auto px-4 pb-32">
                {/* Status indicator for progressive loading */}
                <AnimatePresence>
                    {searchStatus && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 mb-8 text-brand-gold font-bold text-xs uppercase tracking-widest"
                        >
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {searchStatus}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Grid */}
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {results.map((hotel, i) => (
                            <HotelCard key={hotel.id} hotel={hotel} />
                        ))}
                    </div>
                ) : (
                    !isLoading && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-white rounded-3xl shadow-glass flex items-center justify-center mx-auto mb-6 text-brand-gold">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h2 className="font-display text-2xl font-bold text-brand mb-2">Ready for Discovery?</h2>
                            <p className="text-brand-muted mb-8">Enter your destination above and let our AI find your perfect stay.</p>
                            <button
                                onClick={() => handleSearch()}
                                className="bg-brand text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold hover:shadow-premium transition-all"
                            >
                                Launch Search Engine
                            </button>
                        </div>
                    )
                )}

                {/* Loading Skeletons */}
                {isLoading && results.length === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl aspect-[4/5] shimmer" />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
