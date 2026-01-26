"use client";

import { MapPin, Sparkles } from "lucide-react";

export const PropertyMap = ({ location }: { location: any }) => {
    return (
        <section className="mb-16">
            <h2 className="font-display text-3xl font-bold text-brand mb-8">Location Context</h2>
            <div className="relative h-[400px] rounded-[32px] overflow-hidden bg-brand-light border border-black/5">
                {/* Placeholder for real map (Mapbox/Google) */}
                <div className="absolute inset-0 bg-[#f8f9fa] flex items-center justify-center">
                    <div className="text-center group">
                        <div className="w-16 h-16 bg-white rounded-full shadow-premium flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <MapPin className="w-8 h-8 text-brand-gold" />
                        </div>
                        <p className="font-bold text-sm text-brand">{location.address}</p>
                        <div className="flex gap-2 justify-center mt-6">
                            <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-brand-gold" />
                                <span className="text-[10px] font-bold uppercase text-brand">Nearby Spa</span>
                            </div>
                            <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-brand-gold" />
                                <span className="text-[10px] font-bold uppercase text-brand">Forest Trail</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
