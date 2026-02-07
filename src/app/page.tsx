/**
 * WinWin Travel - Home Page (Search)
 *
 * Server Component for initial render performance.
 * Interactive search components are client-side leaf nodes.
 */

import { HomeSearchForm } from "@/components/search/HomeSearchForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth.config";
import { Sparkles, ArrowRight, Heart, Calendar } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
    const session = await getServerSession(authOptions);

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-black py-20 lg:py-32">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" />

                <div className="container relative mx-auto px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <div>
                            <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl mb-6">
                                {session ? (
                                    <>Welcome back, <span className="text-brand-gold italic">{session.user?.name?.split(' ')[0] || 'Traveler'}</span></>
                                ) : (
                                    "Find Your Perfect Stay"
                                )}
                            </h1>
                            <p className="mt-6 text-lg text-white/70 md:text-xl max-w-2xl mx-auto">
                                {session
                                    ? "Your neural profile is optimized. Discover 12 new matches found since your last visit."
                                    : "AI-powered hotel search with personalized recommendations. Compare prices from multiple providers in seconds."
                                }
                            </p>
                        </div>

                        <HomeSearchForm />
                    </div>
                </div>
            </section>

            {session && (
                <section className="py-20 bg-brand-light/50">
                    <div className="container mx-auto px-4">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <div className="flex items-center gap-2 text-brand-gold mb-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Neural Matches</span>
                                </div>
                                <h2 className="text-4xl font-display font-bold text-brand">Picks for your next escape</h2>
                            </div>
                            <Link href="/search" className="flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-gold transition-colors group">
                                View all matches <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { name: "Aman Tokyo", location: "Tokyo, Japan", price: 1200, match: 98 },
                                { name: "Six Senses Ibiza", location: "Ibiza, Spain", price: 850, match: 94 },
                                { name: "The Brando", location: "Tetiaroa, French Polynesia", price: 2400, match: 92 }
                            ].map((hotel, i) => (
                                <div key={i} className="glass group cursor-pointer overflow-hidden rounded-3xl border border-black/5 hover:border-brand-gold/30 transition-all hover:shadow-premium">
                                    <div className="relative h-64 bg-black/5 overflow-hidden">
                                        <div className="absolute top-4 left-4 z-10">
                                            <div className="px-3 py-1.5 rounded-full bg-brand/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/10">
                                                <Sparkles className="w-3 h-3 text-brand-gold" />
                                                {hotel.match}% MATCH
                                            </div>
                                        </div>
                                        <div className="w-full h-full bg-gradient-to-br from-brand/20 to-brand/40 group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-brand">{hotel.name}</h3>
                                            <Heart className="w-5 h-5 text-brand-muted hover:text-red-500 hover:fill-red-500 transition-colors" />
                                        </div>
                                        <p className="text-sm text-brand-muted mb-4">{hotel.location}</p>
                                        <div className="flex justify-between items-center pt-4 border-t border-black/5">
                                            <div className="flex items-center gap-2 text-xs text-brand-muted font-medium">
                                                <Calendar className="w-3 h-3" /> May 12 - May 18
                                            </div>
                                            <div className="text-lg font-bold text-brand italic">€{hotel.price}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-center font-display text-3xl font-bold text-foreground">
                        Why WinWin Travel?
                    </h2>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="card group cursor-pointer">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-2xl transition-transform group-hover:scale-110">
                                🤖
                            </div>
                            <h3 className="font-display text-xl font-semibold">AI-Powered Matching</h3>
                            <p className="mt-2 text-muted-foreground">
                                Our AI learns your preferences and recommends hotels you{"'"}ll love.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card group cursor-pointer">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-2xl transition-transform group-hover:scale-110">
                                💰
                            </div>
                            <h3 className="font-display text-xl font-semibold">Best Price Guarantee</h3>
                            <p className="mt-2 text-muted-foreground">
                                Compare prices from multiple providers and always get the best deal.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card group cursor-pointer">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success-500/20 text-2xl transition-transform group-hover:scale-110">
                                ⚡
                            </div>
                            <h3 className="font-display text-xl font-semibold">Real-time Updates</h3>
                            <p className="mt-2 text-muted-foreground">
                                Live availability and price updates while you browse.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
