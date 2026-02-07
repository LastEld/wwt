"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    User, Mail, Calendar, ShieldCheck,
    TrendingUp, Star, DollarSign, Activity,
    Clock, CheckCircle2, AlertCircle, ArrowRight,
    BrainCircuit, Sparkles, Loader2
} from "lucide-react";
import Link from "next/link";

interface Booking {
    id: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    currency: string;
    status: string;
    confirmationId?: string;
}

interface AIProfile {
    preferredStarRating: number;
    preferredPriceRange: { min: number; max: number };
    amenityImportance: Record<string, number>;
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [aiProfile, setAiProfile] = useState<AIProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return;
            try {
                const [bookingsResp, profileResp] = await Promise.all([
                    fetch("/api/bookings"),
                    fetch("/api/ai/profile")
                ]);

                const bookingsData = await bookingsResp.json();
                const profileData = await profileResp.json();

                if (bookingsData.error || profileData.error) {
                    console.error("API Error:", bookingsData.error || profileData.error);
                }

                setBookings(Array.isArray(bookingsData) ? bookingsData : []);
                setAiProfile(profileData.error ? null : profileData);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session]);

    if (!session) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 text-brand-gold animate-spin mb-4" />
                <p className="text-brand-muted">Authenticating...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: User Info & AI Profile */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-premium border border-brand/5"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-brand/5 border-2 border-brand-gold/20 flex items-center justify-center mb-4 overflow-hidden">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt={session.user.name || ""} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-brand" />
                                    )}
                                </div>
                                <h1 className="font-display text-2xl font-bold text-brand">{session.user?.name}</h1>
                                <div className="flex items-center gap-1 text-brand-muted text-sm mt-1">
                                    <Mail className="w-4 h-4" />
                                    <span>{session.user?.email}</span>
                                </div>
                                <div className="mt-6 flex gap-2">
                                    <span className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Elite Member
                                    </span>
                                    <span className="bg-brand/5 text-brand px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Neural Profile */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-brand rounded-3xl p-8 text-white shadow-premium relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <BrainCircuit className="w-24 h-24" />
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-brand-gold" />
                                <h2 className="font-display text-xl font-bold">Neural Insights</h2>
                            </div>

                            {isLoading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-white/10 rounded w-3/4" />
                                    <div className="h-4 bg-white/10 rounded w-1/2" />
                                    <div className="h-4 bg-white/10 rounded w-5/6" />
                                </div>
                            ) : aiProfile ? (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                            <span>Preferred Quality</span>
                                            <span className="text-brand-gold">{aiProfile.preferredStarRating} Stars</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(aiProfile.preferredStarRating / 5) * 100}%` }}
                                                className="h-full bg-brand-gold"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                            <span>Price Sensitivity</span>
                                            <span className="text-brand-gold">€{aiProfile?.preferredPriceRange?.max || 1000} Max</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "65%" }}
                                                className="h-full bg-brand-gold"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3 block">Top Priorities</span>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(aiProfile.amenityImportance)
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 4)
                                                .map(([amenity, weight]) => (
                                                    <span key={amenity} className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded border border-white/5">
                                                        {amenity.replace('_', ' ')} ({(weight * 100).toFixed(0)}%)
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-white/50 text-sm">Start exploring to build your neural profile.</p>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Column: Bookings */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-premium border border-brand/5"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-brand" />
                                    <h2 className="font-display text-2xl font-bold text-brand">Booking History</h2>
                                </div>
                                <span className="text-sm font-bold text-brand-muted">{bookings.length} reservations</span>
                            </div>

                            {isLoading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-24 bg-brand-light/20 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-20 bg-brand-light/10 rounded-3xl border-2 border-dashed border-brand/5">
                                    <AlertCircle className="w-12 h-12 text-brand/10 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-brand mb-2">No bookings found</h3>
                                    <p className="text-brand-muted mb-6">Your future adventures will appear here.</p>
                                    <Link href="/search" className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-gold transition-colors inline-block">
                                        Explore Destinations
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((booking, i) => (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl border border-brand/5 hover:border-brand-gold/30 hover:bg-brand-light/30 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                                <div className="w-12 h-12 rounded-xl bg-brand/5 flex items-center justify-center text-brand">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-brand">{booking.hotelName}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-brand-muted">
                                                        <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span className="font-bold text-brand-gold">{booking.status}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                                                <div className="text-right">
                                                    <div className="text-xs text-brand-muted uppercase font-bold tracking-widest">Total</div>
                                                    <div className="font-bold text-brand">€{booking.totalPrice.toLocaleString()}</div>
                                                </div>
                                                <div className="bg-brand text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Account Security */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl p-8 shadow-premium border border-brand/5"
                        >
                            <h2 className="font-display text-xl font-bold text-brand mb-6 flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-brand-gold" />
                                Account Security
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-brand-light/50 border border-brand/5">
                                    <div className="text-sm font-bold text-brand mb-1">Two-Factor Authentication</div>
                                    <div className="text-xs text-brand-muted mb-3">Add an extra layer of security to your account.</div>
                                    <button className="text-xs font-bold text-brand-gold hover:underline">Setup now →</button>
                                </div>
                                <div className="p-4 rounded-2xl bg-brand-light/50 border border-brand/5">
                                    <div className="text-sm font-bold text-brand mb-1">Session Management</div>
                                    <div className="text-xs text-brand-muted mb-3">Monitor and logout from other active sessions.</div>
                                    <button className="text-xs font-bold text-brand-gold hover:underline">View activity →</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
