"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, Wifi, Utensils, Waves, ParkingCircle, Dumbbell } from "lucide-react";

interface FilterBarProps {
    activeFilters?: string[];
    onFilterToggle?: (amenity: string) => void;
    sortBy?: string;
    onSortChange?: (sort: string) => void;
}

export const FilterBar = ({ activeFilters = [], onFilterToggle, sortBy = "relevance", onSortChange }: FilterBarProps) => {
    const categories = [
        { icon: Waves, label: "Pool", value: "pool" },
        { icon: Wifi, label: "WiFi", value: "wifi" },
        { icon: Utensils, label: "Restaurant", value: "restaurant" },
        { icon: ParkingCircle, label: "Parking", value: "parking" },
        { icon: Dumbbell, label: "Gym", value: "gym" },
    ];

    return (
        <div className="sticky top-[88px] z-40 w-full glass py-4 mb-12">
            <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
                <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-black/5 hover:border-brand-gold transition-colors text-sm font-bold text-brand shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilters.length > 0 && (
                        <span className="ml-1 w-5 h-5 rounded-full bg-brand-gold text-white text-xs flex items-center justify-center">
                            {activeFilters.length}
                        </span>
                    )}
                </button>

                <div className="w-px h-8 bg-black/10 shrink-0" />

                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                    {categories.map((cat) => {
                        const isActive = activeFilters.includes(cat.value);
                        return (
                            <motion.button
                                key={cat.value}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onFilterToggle?.(cat.value)}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl border transition-all text-sm font-semibold whitespace-nowrap ${
                                    isActive
                                        ? 'bg-brand text-white border-brand shadow-lg'
                                        : 'border-black/5 hover:bg-white hover:shadow-glass text-brand-muted hover:text-brand'
                                }`}
                            >
                                <cat.icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-brand-gold'}`} />
                                {cat.label}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="hidden lg:flex ml-auto items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange?.(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-brand focus:ring-0 cursor-pointer"
                    >
                        <option value="relevance">Neural Selection</option>
                        <option value="price_asc">Price (Low to High)</option>
                        <option value="price_desc">Price (High to Low)</option>
                        <option value="rating">Highest Rating</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
