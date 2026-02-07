"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sparkles, Calendar, MapPin, Clock, Users, ChevronRight, Loader2, Wand2 } from "lucide-react";
import Link from "next/link";

interface Experience {
    id: string;
    title: string;
    destination: string;
    duration: string;
    price: number;
    imageUrl: string;
    highlights: string[];
    category: string;
}

const FEATURED_EXPERIENCES: Experience[] = [
    {
        id: "exp-1",
        title: "Parisian Art & Gastronomy",
        destination: "Paris, France",
        duration: "5 Days",
        price: 4500,
        imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
        highlights: ["Private Louvre Tour", "Michelin Dining", "Seine Cruise"],
        category: "Cultural",
    },
    {
        id: "exp-2",
        title: "Japanese Zen Immersion",
        destination: "Kyoto, Japan",
        duration: "7 Days",
        price: 6800,
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
        highlights: ["Ryokan Stay", "Tea Ceremony", "Temple Meditation"],
        category: "Wellness",
    },
    {
        id: "exp-3",
        title: "Maldives Ocean Sanctuary",
        destination: "Maldives",
        duration: "6 Days",
        price: 8900,
        imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
        highlights: ["Overwater Villa", "Diving Safari", "Sunset Cruise"],
        category: "Beach",
    },
    {
        id: "exp-4",
        title: "Safari & Luxury Lodge",
        destination: "Kenya",
        duration: "8 Days",
        price: 7500,
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
        highlights: ["Big Five Safari", "Hot Air Balloon", "Bush Dinner"],
        category: "Adventure",
    },
    {
        id: "exp-5",
        title: "Amalfi Coast Escape",
        destination: "Italy",
        duration: "5 Days",
        price: 5200,
        imageUrl: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800",
        highlights: ["Villa Stay", "Private Yacht", "Cooking Class"],
        category: "Romantic",
    },
    {
        id: "exp-6",
        title: "Nordic Lights Adventure",
        destination: "Norway",
        duration: "6 Days",
        price: 6100,
        imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
        highlights: ["Aurora Viewing", "Dog Sledding", "Ice Hotel"],
        category: "Adventure",
    },
];

const CATEGORIES = ["All", "Cultural", "Wellness", "Beach", "Adventure", "Romantic"];

export default function ExperiencesPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
    const [prompt, setPrompt] = useState("");

    const filteredExperiences = selectedCategory === "All"
        ? FEATURED_EXPERIENCES
        : FEATURED_EXPERIENCES.filter(exp => exp.category === selectedCategory);

    const handleGenerateItinerary = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        try {
            const resp = await fetch("/api/ai/itinerary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requirements: prompt }),
            });
            const data = await resp.json();
            setGeneratedItinerary(data);
        } catch (error) {
            console.error("Failed to generate itinerary:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-black py-20">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />

                <div className="container mx-auto px-4 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Compass className="w-6 h-6 text-brand-gold" />
                            <span className="text-brand-gold font-bold text-sm uppercase tracking-widest">
                                Curated Journeys
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
                            Unforgettable <span className="text-brand-gold">Experiences</span>
                        </h1>
                        <p className="text-xl text-white/70">
                            Hand-crafted itineraries designed by our neural travel architects.
                            Each journey is a masterpiece of discovery.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* AI Itinerary Generator */}
            <section className="py-16 bg-brand-light/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <Wand2 className="w-6 h-6 text-brand-gold" />
                            <h2 className="font-display text-2xl font-bold text-brand">AI Journey Generator</h2>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <p className="text-brand-muted mb-6">
                                Describe your dream journey and let our AI craft a personalized itinerary just for you.
                            </p>

                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A 5-day romantic getaway in Tuscany with wine tasting and cooking classes..."
                                className="w-full h-32 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-brand-gold transition-colors"
                            />

                            <button
                                onClick={handleGenerateItinerary}
                                disabled={isGenerating || !prompt.trim()}
                                className="mt-4 w-full bg-brand text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Your Journey...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate My Journey
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Generated Itinerary */}
                        <AnimatePresence>
                            {generatedItinerary && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-8 bg-white rounded-3xl p-8 shadow-lg"
                                >
                                    <h3 className="font-display text-2xl font-bold text-brand mb-2">
                                        {generatedItinerary.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-brand-muted text-sm mb-6">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {generatedItinerary.destination}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {generatedItinerary.durationDays} Days
                                        </span>
                                        <span className="font-bold text-brand-gold">
                                            €{generatedItinerary.totalEstimatedPrice?.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {generatedItinerary.days?.map((day: any) => (
                                            <div key={day.day} className="border-l-2 border-brand-gold pl-4">
                                                <h4 className="font-bold text-brand">Day {day.day}: {day.title}</h4>
                                                <p className="text-brand-muted text-sm">{day.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="mt-6 w-full bg-brand-gold text-brand py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-brand transition-colors hover:text-white">
                                        Book This Journey
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat
                                        ? "bg-brand text-white"
                                        : "bg-gray-100 text-brand-muted hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Experiences Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="font-display text-2xl font-bold text-brand mb-8">Featured Journeys</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredExperiences.map((exp, i) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="relative h-56">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${exp.imageUrl})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-brand-gold text-brand px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            {exp.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="font-display text-xl font-bold text-white">{exp.title}</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-brand-muted text-sm mb-4">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {exp.destination}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {exp.duration}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {exp.highlights.map((h) => (
                                            <span key={h} className="text-xs bg-brand-light/50 text-brand px-2 py-1 rounded-full">
                                                {h}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-brand-muted text-sm">From</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-brand">€{exp.price.toLocaleString()}</span>
                                                <span className="text-brand-muted text-sm">/person</span>
                                            </div>
                                        </div>
                                        <button className="bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-gold transition-colors flex items-center gap-2">
                                            View <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
