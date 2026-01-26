"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search as SearchIcon } from "lucide-react";

interface SearchHeroProps {
    onSearch?: (location: string) => void;
}

export const SearchHero = ({ onSearch }: SearchHeroProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [location, setLocation] = useState("");

    return (
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
            {/* Abstract Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-widest mb-6"
                >
                    Personalized Discovery Engine
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-display font-bold text-brand leading-tight mb-8"
                >
                    Your Perfect Stay, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-gold">
                        Neuralized for You.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-brand-muted text-lg md:text-xl max-w-2xl mx-auto mb-12"
                >
                    Experience hotel search evolved. Our AI learns your preferences in real-time to surface
                    hidden gems that match your unique wellness profile.
                </motion.p>

                {/* Search Bar Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className={`glass p-2 rounded-[28px] max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 transition-all duration-500 ${isFocused ? 'shadow-premium ring-1 ring-brand-gold/20' : ''
                        }`}
                >
                    {/* Location */}
                    <div className="w-full md:w-1/3 p-4 flex items-center gap-3 hover:bg-black/5 transition-colors rounded-2xl cursor-pointer group">
                        <MapPin className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted">Location</span>
                            <input
                                type="text"
                                placeholder="Where to?"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => e.key === 'Enter' && onSearch?.(location)}
                                className="bg-transparent border-none p-0 text-sm font-semibold text-brand placeholder:text-brand/40 focus:ring-0 w-full"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-10 bg-black/10" />

                    {/* Dates */}
                    <div className="w-full md:w-1/3 p-4 flex items-center gap-3 hover:bg-black/5 transition-colors rounded-2xl cursor-pointer group">
                        <Calendar className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted">Check-in</span>
                            <span className="block text-sm font-semibold text-brand">Add dates</span>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-10 bg-black/10" />

                    {/* Occupancy */}
                    <div className="w-full md:w-1/3 p-4 flex items-center gap-3 hover:bg-black/5 transition-colors rounded-2xl cursor-pointer group">
                        <Users className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted">Guests</span>
                            <span className="block text-sm font-semibold text-brand">2 Adults</span>
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={() => onSearch?.(location)}
                        className="w-full md:w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white hover:bg-brand-gold hover:shadow-premium transition-all group shrink-0"
                    >
                        <SearchIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
