"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CreditCard, Loader2, CheckCircle2, AlertCircle, Clock, ArrowLeft } from "lucide-react";

function CheckoutContent({ hotelId }: { hotelId: string }) {
    const searchParams = useSearchParams();

    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lockToken, setLockToken] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(300);

    // Guest form state
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");

    const hotelName = searchParams?.get("name") || "Luxury Property";
    const price = searchParams?.get("price") || "450";
    const provider = searchParams?.get("provider") || "mock";
    const roomId = searchParams?.get("roomId") || "default-room";
    const nights = 3;
    const totalPrice = parseFloat(price) * nights;

    // Initialize Price Lock on mount
    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch("/api/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "INITIALIZE",
                        data: {
                            hotelId,
                            hotelName,
                            roomId,
                            roomType: searchParams?.get("roomType") || "Luxury Suite",
                            integration: provider,
                            pricePerNight: parseFloat(price),
                            totalPrice,
                            currency: "EUR"
                        }
                    })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setLockToken(data.token);
            } catch (err: any) {
                console.error("[Checkout Init Error]:", err);
                setError(err.message || "Failed to lock price. Please try searching again.");
            }
        };
        init();
    }, [hotelId, hotelName, roomId, provider, price, totalPrice]);

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const canProceedToPayment = guestName.trim().length > 0 && guestEmail.includes("@");

    const handleConfirm = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "CONFIRM",
                    data: {
                        lockToken,
                        guestName,
                        guestEmail,
                        hotelName, // Add this
                        roomType: searchParams?.get("roomType") || "Luxury Suite", // Add this
                        checkIn: new Date().toISOString(),
                        checkOut: new Date(Date.now() + 86400000 * nights).toISOString(),
                        guests: 2,
                        rooms: 1,
                        specialRequests,
                    }
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Redirect to dedicated confirmation page
            const params = new URLSearchParams({
                hotel: hotelName,
                checkIn: new Date().toISOString().split('T')[0],
                guests: "2"
            });
            window.location.href = `/checkout/confirmation/${data.booking.id}?${params.toString()}`;
        } catch (err: any) {
            setError(err.message || "Booking failed. Please try again.");
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
                        <button onClick={() => window.history.back()} className="flex items-center gap-1 text-sm text-brand-muted hover:text-brand mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to property
                        </button>
                        <h1 className="text-3xl font-display font-bold text-brand">Secure Checkout</h1>
                        <p className="text-brand-muted font-medium">{hotelName}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl glass ${timeLeft < 60 ? 'text-red-500 border-red-500/20' : 'text-brand-gold border-brand-gold/20'}`}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-bold">{formatTime(timeLeft)} Locked</span>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-4 mb-8">
                    {["Traveler Info", "Payment", "Confirmed"].map((label, i) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-brand text-white' : 'bg-black/5 text-brand-muted'
                                }`}>
                                {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`text-sm font-semibold ${step === i + 1 ? 'text-brand' : 'text-brand-muted'}`}>{label}</span>
                            {i < 2 && <div className="w-8 h-px bg-black/10" />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="glass p-8 rounded-3xl space-y-6">
                                        <h2 className="text-xl font-bold text-brand">Traveler Information</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-brand-muted">Full Name *</label>
                                                <input
                                                    type="text"
                                                    value={guestName}
                                                    onChange={(e) => setGuestName(e.target.value)}
                                                    placeholder="John Smith"
                                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 outline-none transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-brand-muted">Email *</label>
                                                <input
                                                    type="email"
                                                    value={guestEmail}
                                                    onChange={(e) => setGuestEmail(e.target.value)}
                                                    placeholder="john@example.com"
                                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 outline-none transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-brand-muted">Phone (Optional)</label>
                                                <input
                                                    type="tel"
                                                    value={guestPhone}
                                                    onChange={(e) => setGuestPhone(e.target.value)}
                                                    placeholder="+1 555 123 4567"
                                                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-brand-muted">Special Requests</label>
                                            <textarea
                                                value={specialRequests}
                                                onChange={(e) => setSpecialRequests(e.target.value)}
                                                placeholder="Late check-in, extra pillows, etc."
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 outline-none transition-colors resize-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setStep(2)}
                                            disabled={!canProceedToPayment}
                                            className="w-full py-4 rounded-2xl bg-brand text-white text-sm font-bold uppercase tracking-widest hover:bg-brand-gold hover:shadow-premium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="glass p-8 rounded-3xl space-y-6">
                                        <h2 className="text-xl font-bold text-brand">Payment</h2>
                                        <p className="text-sm text-brand-muted">Demo mode - no real payment will be processed.</p>
                                        <div className="p-6 bg-brand text-white rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <CreditCard className="w-8 h-8" />
                                                <div>
                                                    <p className="font-bold text-sm italic">WinWin Virtual Card</p>
                                                    <p className="text-xs opacity-60">Demo Payment Method</p>
                                                </div>
                                            </div>
                                            <ShieldCheck className="w-6 h-6 text-brand-gold" />
                                        </div>

                                        <div className="p-4 bg-black/5 rounded-xl text-sm">
                                            <p className="font-semibold text-brand">Booking for: {guestName}</p>
                                            <p className="text-brand-muted">{guestEmail}</p>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-bold">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                {error}
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            <button onClick={() => setStep(1)} className="px-6 py-4 rounded-2xl border border-black/10 text-sm font-bold text-brand hover:bg-black/5 transition-colors">
                                                Back
                                            </button>
                                            <button
                                                onClick={handleConfirm}
                                                disabled={isProcessing || timeLeft <= 0 || !lockToken}
                                                className="flex-1 py-4 rounded-2xl bg-brand text-white text-sm font-bold uppercase tracking-widest hover:bg-brand-gold hover:shadow-premium transition-all flex items-center justify-center gap-3 disabled:opacity-40"
                                            >
                                                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                                {isProcessing ? "Validating..." : `Confirm - €${totalPrice.toFixed(0)}`}
                                            </button>
                                        </div>
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
                                        <p className="text-brand-muted">
                                            Your stay at <strong>{hotelName}</strong> has been secured.
                                            A confirmation email is on its way to <strong>{guestEmail}</strong>.
                                        </p>
                                        <button onClick={() => window.location.href = '/'} className="w-full py-4 rounded-2xl border border-brand text-brand text-sm font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-all">
                                            Return Home
                                        </button>
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
                                    <span className="text-brand-muted">{nights} Nights Stay</span>
                                    <span className="text-brand">€{totalPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-brand-muted">Taxes & Fees</span>
                                    <span className="text-brand">€0.00</span>
                                </div>
                                <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                                    <span className="text-lg font-bold text-brand">Total</span>
                                    <span className="text-2xl font-bold italic text-brand">€{totalPrice.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-3xl border border-black/5">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-bold text-brand">Secure Booking</span>
                            </div>
                            <p className="text-xs text-brand-muted">
                                Your price is locked for {formatTime(timeLeft)}. All transactions are encrypted and secure.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>}>
            <CheckoutContent hotelId={params.id} />
        </Suspense>
    );
}
