"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchHero } from "@/components/search/SearchHero";
import { FilterBar } from "@/components/search/FilterBar";
import { HotelCard } from "@/components/search/HotelCard";
import { useSocket } from "@/components/providers/socket-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

function SearchContent() {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<any[]>([]);
    const [facets, setFacets] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchStatus, setSearchStatus] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("relevance");
    const { socket } = useSocket();

    const initialDestination = searchParams?.get("destination") || "";
    const initialCheckIn = searchParams?.get("checkIn") || "";
    const initialCheckOut = searchParams?.get("checkOut") || "";

    // Listen for real-time progressive results
    useEffect(() => {
        if (!socket) return;

        socket.on("search:partial_results", (data: any) => {
            setResults(prev => {
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

    const handleSearch = useCallback(async (params: { location: string; checkIn: string; checkOut: string; adults: number }) => {
        const locationName = params.location || "Paris";
        setIsLoading(true);
        setResults([]);
        setSearchStatus("AI is scanning providers...");

        const checkIn = params.checkIn ? new Date(params.checkIn) : new Date();
        const checkOut = params.checkOut ? new Date(params.checkOut) : new Date(Date.now() + 86400000 * 3);

        try {
            const resp = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: { name: locationName },
                    dates: { checkIn, checkOut },
                    occupancy: { adults: params.adults || 2, children: [], rooms: 1 },
                    filters: {
                        amenities: activeFilters.length > 0 ? activeFilters : undefined,
                    },
                    sort: sortBy,
                })
            });
            const data = await resp.json();
            setResults(prev => {
                const existingIds = new Set(prev.map(r => r.id));
                const finalResults = data.results.filter((o: any) => !existingIds.has(o.id));
                return [...prev, ...finalResults].sort((a, b) => (b.score || 0) - (a.score || 0));
            });
            if (data.facets) setFacets(data.facets);
        } finally {
            setIsLoading(false);
            setSearchStatus(null);
        }
    }, [activeFilters, sortBy]);

    // Auto-search if URL has destination param
    useEffect(() => {
        if (initialDestination) {
            handleSearch({
                location: initialDestination,
                checkIn: initialCheckIn,
                checkOut: initialCheckOut,
                adults: 2,
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFilterToggle = (amenity: string) => {
        setActiveFilters(prev =>
            prev.includes(amenity) ? prev.filter(f => f !== amenity) : [...prev, amenity]
        );
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort);
    };

    // Client-side sort
    const sortedResults = [...results].sort((a, b) => {
        if (sortBy === "price_asc") return a.price.amount - b.price.amount;
        if (sortBy === "price_desc") return b.price.amount - a.price.amount;
        if (sortBy === "rating") return b.reviewScore - a.reviewScore;
        return (b.score || 0) - (a.score || 0);
    });

    // Client-side amenity filter
    const filteredResults = activeFilters.length > 0
        ? sortedResults.filter(h => activeFilters.every(f => h.amenities?.some((a: string) => a.toLowerCase().includes(f.toLowerCase()))))
        : sortedResults;

    return (
        <div className="min-h-screen bg-brand-light/30">
            <SearchHero
                onSearch={handleSearch}
                initialLocation={initialDestination}
                initialCheckIn={initialCheckIn}
                initialCheckOut={initialCheckOut}
                compact
            />

            <FilterBar
                activeFilters={activeFilters}
                onFilterToggle={handleFilterToggle}
                sortBy={sortBy}
                onSortChange={handleSortChange}
            />

            <main className="max-w-7xl mx-auto px-4 pb-32">
                {/* Result count */}
                {filteredResults.length > 0 && !isLoading && (
                    <p className="text-sm font-semibold text-brand-muted mb-6">
                        {filteredResults.length} propert{filteredResults.length === 1 ? 'y' : 'ies'} found
                    </p>
                )}

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
                {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResults.map((hotel) => (
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
                                onClick={() => handleSearch({ location: "Paris", checkIn: "", checkOut: "", adults: 2 })}
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

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-brand-light/30 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>}>
            <SearchContent />
        </Suspense>
    );
}
