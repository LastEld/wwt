/**
 * WinWin Travel - Home Page (Search)
 * 
 * Server Component for initial render performance.
 * Interactive search components are client-side leaf nodes.
 */

export default function HomePage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 py-20 lg:py-32">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary-300/20 blur-3xl" />

                <div className="container relative mx-auto px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                            Find Your Perfect Stay
                        </h1>
                        <p className="mt-6 text-lg text-primary-100 md:text-xl">
                            AI-powered hotel search with personalized recommendations.
                            Compare prices from multiple providers in seconds.
                        </p>

                        {/* Search Form Placeholder */}
                        <div className="mt-10 rounded-2xl bg-white/10 p-6 backdrop-blur-xl">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-left text-sm font-medium text-white/80">
                                        Destination
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Where are you going?"
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-left text-sm font-medium text-white/80">
                                        Check-in
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-left text-sm font-medium text-white/80">
                                        Check-out
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                </div>
                            </div>

                            <button className="mt-6 w-full rounded-xl bg-accent-400 px-8 py-4 font-semibold text-primary-900 shadow-lg transition-all duration-300 hover:bg-accent-300 hover:shadow-xl active:scale-[0.98] md:w-auto">
                                Search Hotels
                            </button>
                        </div>
                    </div>
                </div>
            </section>

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
