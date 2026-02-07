"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Calendar, MapPin, Users, ArrowRight, Coffee, ShieldCheck, Printer } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ConfirmationPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const hotelName = searchParams?.get("hotel") || "Luxury Grand Resort";
    const checkIn = searchParams?.get("checkIn") || "2026-05-12";
    const guests = searchParams?.get("guests") || "2";

    return (
        <main className="min-h-screen pt-32 pb-20 bg-brand-light/30">
            <div className="max-w-4xl mx-auto px-4">
                {/* Success Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass bg-green-500/5 border-green-500/20 p-8 rounded-3xl text-center mb-8"
                >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-brand mb-2">Booking Confirmed!</h1>
                    <p className="text-brand-muted font-medium">Your itinerary has been secured and sent to your email.</p>
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-black/5 text-xs font-bold text-brand">
                        <span className="text-brand-muted">Confirmation ID:</span>
                        <span className="font-mono">WWT-{params.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Booking Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass p-8 rounded-3xl space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-brand mb-1">{hotelName}</h2>
                                    <p className="flex items-center gap-1.5 text-sm text-brand-muted">
                                        <MapPin className="w-4 h-4" /> 123 Luxury Ave, Tokyo, Japan
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-1">Status</div>
                                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold border border-green-500/20 uppercase">
                                        Confirmed
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-black/5">
                                <div>
                                    <div className="flex items-center gap-2 text-brand-muted mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Check-in</span>
                                    </div>
                                    <p className="text-sm font-bold text-brand">{checkIn}</p>
                                    <p className="text-[10px] text-brand-muted">From 3:00 PM</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-brand-muted mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Check-out</span>
                                    </div>
                                    <p className="text-sm font-bold text-brand">2026-05-18</p>
                                    <p className="text-[10px] text-brand-muted">By 11:00 AM</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-brand-muted mb-2">
                                        <Users className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Guests</span>
                                    </div>
                                    <p className="text-sm font-bold text-brand">{guests} Adults</p>
                                    <p className="text-[10px] text-brand-muted">1 Luxury Suite</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-black/5">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold mb-4">Included Amenities</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-sm text-brand font-medium">
                                        <Coffee className="w-4 h-4 text-brand-muted" /> Daily Boutique Breakfast
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-brand font-medium">
                                        <ShieldCheck className="w-4 h-4 text-brand-muted" /> Premium Travel Insurance
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-brand rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 blur-3xl rounded-full -mr-20 -mt-20" />
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-4">Want to personalize your stay?</h3>
                                <p className="text-white/70 text-sm mb-6 max-w-md">
                                    Chat with your neural assistant to arrange airport transfers, spa treatments, or local hidden gems.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="px-6 py-3 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-gold/90 transition-all flex items-center gap-2">
                                        Open AI Assistant <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button className="px-6 py-3 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition-all border border-white/10">
                                        Manage Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / QR */}
                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl text-center border border-black/5">
                            <div className="w-48 h-48 bg-white p-4 rounded-2xl mx-auto mb-6 border border-black/5 shadow-inner flex items-center justify-center">
                                {/* Mock QR Code */}
                                <div className="w-full h-full bg-[url('/qr-mock.png')] bg-cover opacity-20 bg-slate-200 rounded-lg flex items-center justify-center italic text-[10px] text-brand-muted">
                                    Digital Pass - Verified
                                </div>
                            </div>
                            <p className="text-xs text-brand-muted mb-6">
                                Show this digital pass at check-in for a zero-friction arrival experience.
                            </p>
                            <button className="w-full py-4 border border-black/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-brand hover:bg-black/5 transition-all flex items-center justify-center gap-2">
                                <Printer className="w-4 h-4" /> Print Receipt
                            </button>
                        </div>

                        <Link href="/" className="block w-full py-4 rounded-2xl bg-white text-brand text-xs font-bold uppercase tracking-widest text-center border border-black/5 hover:border-brand-gold transition-colors">
                            Back to Discovery
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
