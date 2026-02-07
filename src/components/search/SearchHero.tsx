"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search as SearchIcon } from "lucide-react";

interface SearchHeroProps {
    onSearch?: (params: { location: string; checkIn: string; checkOut: string; adults: number }) => void;
    initialLocation?: string;
    initialCheckIn?: string;
    initialCheckOut?: string;
    compact?: boolean;
}

export const SearchHero = ({ onSearch, initialLocation = "", initialCheckIn = "", initialCheckOut = "", compact = false }: SearchHeroProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [location, setLocation] = useState(initialLocation);
    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);
    const [adults, setAdults] = useState(2);

    const handleSubmit = () => {
        onSearch?.({ location, checkIn, checkOut, adults });
    };

    if (compact) {
        return (
            <section className="relative pt-24 pb-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`glass p-2 rounded-[28px] flex flex-col md:flex-row items-center gap-2 transition-all duration-500 ${isFocused ? 'shadow-premium ring-1 ring-brand-gold/20' : ''}`}
                    >
                        <div className="w-full md:flex-1 p-3 flex items-center gap-3 hover:bg-black/5 transition-colors rounded-2xl group">
                            <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
                            <input
                                type="text"
                                placeholder="Where to?"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                className="bg-transparent border-none p-0 text-sm font-semibold text-brand placeholder:text-brand/40 focus:ring-0 w-full"
                            />
                        </div>
                        <div className="hidden md:block w-px h-8 bg-black/10" />
                        <div className="w-full md:w-auto p-3 flex items-center gap-2 hover:bg-black/5 transition-colors rounded-2xl">
                            <Calendar className="w-4 h-4 text-brand-gold shrink-0" />
                            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-transparent border-none p-0 text-xs font-semibold text-brand focus:ring-0 w-28" />
                            <span className="text-brand-muted text-xs">-</span>
                            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-transparent border-none p-0 text-xs font-semibold text-brand focus:ring-0 w-28" />
                        </div>
                        <button onClick={handleSubmit} className="w-full md:w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white hover:bg-brand-gold transition-all shrink-0">
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
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

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className={`glass p-2 rounded-[28px] max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 transition-all duration-500 ${isFocused ? 'shadow-premium ring-1 ring-brand-gold/20' : ''}`}
                >
                    {/* Location */}
                    <div className="w-full md:w-1/4 p-4 flex items-center gap-3 hover:bg-black/5 transition-colors rounded-2xl group">
                        <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
                        <div className="text-left w-full">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted">Location</span>
                            <input
                                type="text"
                                placeholder="Where to?"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                className="bg-transparent border-none p-0 text-sm font-semibold text-brand placeholder:text-brand/40 focus:ring-0 w-full"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-10 bg-black/10" />

                    {/* Check-in */}
                    <div className="w-full md:w-1/4 p-4 flex items-center gap-3 hover:bg-black/5 transition-colors rounded-2xl group">
                        <Calendar className="w-5 h-5 text-brand-gold shrink-0" />
                        <div className="text-left w-full">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted">Check-in</span>
                            <input
                                type="date"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="bg-transparent border-none p-0 text-sm font-semibold text-brand focus:ring-0 w-full"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-10 bg-black/10" />

                    {/* Check-out */}
                    <div className="w-full md:w-1/4 p-4 flex items-center gap-3 hover:bg-black/5 transition-colors rounded-2xl group">
                        <Calendar className="w-5 h-5 text-brand-gold shrink-0" />
                        <div className="text-left w-full">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted">Check-out</span>
                            <input
                                type="date"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="bg-transparent border-none p-0 text-sm font-semibold text-brand focus:ring-0 w-full"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-10 bg-black/10" />

                    {/* Guests */}
                    <div className="w-full md:w-auto p-4 flex items-center gap-3 hover:bg-black/5 transition-colors rounded-2xl group">
                        <Users className="w-5 h-5 text-brand-gold shrink-0" />
                        <div className="text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted">Guests</span>
                            <select
                                value={adults}
                                onChange={(e) => setAdults(parseInt(e.target.value))}
                                className="bg-transparent border-none p-0 text-sm font-semibold text-brand focus:ring-0 cursor-pointer"
                            >
                                <option value={1}>1 Adult</option>
                                <option value={2}>2 Adults</option>
                                <option value={3}>3 Adults</option>
                                <option value={4}>4 Adults</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full md:w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white hover:bg-brand-gold hover:shadow-premium transition-all group shrink-0"
                    >
                        <SearchIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
