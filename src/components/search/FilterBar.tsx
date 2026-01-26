"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, Wifi, Utensils, Waves, ParkingCircle, Dumbbell } from "lucide-react";

export const FilterBar = () => {
    const categories = [
        { icon: Waves, label: "Pool" },
        { icon: Wifi, label: "Free Wifi" },
        { icon: Utensils, label: "Restaurant" },
        { icon: ParkingCircle, label: "Parking" },
        { icon: Dumbbell, label: "Fitness" },
    ];

    return (
        <div className="sticky top-[88px] z-40 w-full glass py-4 mb-12">
            <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
                {/* Advanced Filters Button */}
                <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-black/5 hover:border-brand-gold transition-colors text-sm font-bold text-brand shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>

                <div className="w-px h-8 bg-black/10 shrink-0" />

                {/* Simple Chips */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                    {categories.map((cat, i) => (
                        <motion.button
                            key={cat.label}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl border border-black/5 hover:bg-white hover:shadow-glass transition-all text-sm font-semibold text-brand-muted hover:text-brand whitespace-nowrap"
                        >
                            <cat.icon className="w-4 h-4 text-brand-gold" />
                            {cat.label}
                        </motion.button>
                    ))}
                </div>

                <div className="hidden lg:flex ml-auto items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Sort by:</span>
                    <select className="bg-transparent border-none text-sm font-bold text-brand focus:ring-0 cursor-pointer">
                        <option>Neural Selection</option>
                        <option>Price (Low to High)</option>
                        <option>Highest Rating</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
