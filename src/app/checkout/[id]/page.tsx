"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CreditCard, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function CheckoutPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const hotelId = params.id;

    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lockToken, setLockToken] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

    const hotelName = searchParams.get("name") || "Luxury Property";
    const price = searchParams.get("price") || "450";

    // 1. Initialize Price Lock on mount
    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch("/api/bookings", {
                    method: "POST",
                    body: JSON.stringify({
                        action: "INITIALIZE",
                        data: {
                            hotelId,
                            hotelName,
                            roomId: searchParams.get("roomId") || "default-room",
                            roomType: "Luxury Suite",
                            integration: searchParams.get("provider") || "Mock",
                            pricePerNight: parseFloat(price),
                            totalPrice: parseFloat(price) * 3, // Mock 3 nights
                            currency: "EUR"
                        }
                    })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setLockToken(data.token);
            } catch (err: any) {
                setError("Failed to lock price. Please try searching again.");
            }
        };
        init();
    }, [hotelId, searchParams, price]);

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleConfirm = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                body: JSON.stringify({
                    action: "CONFIRM",
                    data: {
                        lockToken,
                        guestName: "Alex Traveler", // Mock form data
                        guestEmail: "alex@winwin.travel",
                        checkIn: new Date().toISOString(),
                        checkOut: new Date(Date.now() + 86400000 * 3).toISOString(),
                        guests: 2,
                        rooms: 1
                    }
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="min-h-screen bg-brand-light/30 pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header / Timer */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-brand">Secure Checkout</h1>
                        <p className="text-brand-muted font-medium">{hotelName}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl glass ${timeLeft < 60 ? 'text-red-500 border-red-500/20' : 'text-brand-gold border-brand-gold/20'}`}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-bold">{formatTime(timeLeft)} Locked</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="glass p-8 rounded-3xl space-y-6">
                                        <h2 className="text-xl font-bold text-brand">Traveler Information</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-brand-muted">Name</label>
                                                <input type="text" readOnly value="Alex Traveler" className="w-full px-4 py-3 rounded-xl border border-black/5 bg-black/5" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-brand-muted">Email</label>
                                                <input type="email" readOnly value="alex@winwin.travel" className="w-full px-4 py-3 rounded-xl border border-black/5 bg-black/5" />
                                            </div>
                                        </div>
                                        <button onClick={() => setStep(2)} className="btn-primary w-full">Continue to Payment</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="glass p-8 rounded-3xl space-y-6">
                                        <h2 className="text-xl font-bold text-brand">Mock Payment Processing</h2>
                                        <div className="p-6 bg-brand text-white rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <CreditCard className="w-8 h-8" />
                                                <div>
                                                    <p className="font-bold text-sm italic">WinWin Virtual Card</p>
                                                    <p className="text-xs opacity-60">•••• 5683</p>
                                                </div>
                                            </div>
                                            <ShieldCheck className="w-6 h-6 text-brand-gold" />
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-bold">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleConfirm}
                                            disabled={isProcessing || timeLeft <= 0}
                                            className="btn-primary w-full flex items-center justify-center gap-3"
                                        >
                                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                            {isProcessing ? "Validating with Provider..." : `Confirm Reservation • €${parseFloat(price) * 3}`}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                    <div className="glass p-12 rounded-3xl text-center space-y-6">
                                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h2 className="text-3xl font-display font-bold text-brand">Booking Confirmed!</h2>
                                        <p className="text-brand-muted">Your neural stay has been secured. A confirmation email is on its way to alex@winwin.travel.</p>
                                        <button onClick={() => window.location.href = '/'} className="btn-secondary w-full">Return Home</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="hidden lg:block space-y-6">
                        <div className="glass p-6 rounded-3xl border border-black/5">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-brand-gold mb-6">Stay Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-brand-muted">3 Nights Stay</span>
                                    <span className="text-brand">€{parseFloat(price) * 3}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-brand-muted">Taxes & Fees</span>
                                    <span className="text-brand">€0.00</span>
                                </div>
                                <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                                    <span className="text-lg font-bold text-brand">Total</span>
                                    <span className="text-2xl font-bold italic text-brand">€{parseFloat(price) * 3}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
