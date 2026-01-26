"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export const Footer = () => {
    return (
        <footer className="bg-brand text-white pt-24 pb-12 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center text-white font-bold italic">
                                W
                            </div>
                            <span className="font-display text-2xl font-bold tracking-tight">
                                WinWin<span className="text-brand-gold">Travel</span>
                            </span>
                        </Link>
                        <p className="text-brand-muted text-lg max-w-md leading-relaxed">
                            Luxury personalized discovery for the modern traveler.
                            Our neural engine ensures every stay is a perfect match for your wellness profile.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-sm mb-8 text-brand-gold">Platform</h4>
                        <ul className="space-y-4 text-brand-muted font-medium">
                            <li><Link href="/search" className="hover:text-white transition-colors">Discovery</Link></li>
                            <li><Link href="/deals" className="hover:text-white transition-colors">Neural Deals</Link></li>
                            <li><Link href="/experiences" className="hover:text-white transition-colors">Experiences</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-sm mb-8 text-brand-gold">Company</h4>
                        <ul className="space-y-4 text-brand-muted font-medium">
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Vision</Link></li>
                            <li><Link href="/partners" className="hover:text-white transition-colors">Partnerships</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Traveler Privacy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-brand-muted text-sm font-medium">
                        © 2026 WinWin Travel. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/50">Neural v1.2</span>
                        <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
