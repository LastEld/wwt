"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, User, Heart, Menu } from "lucide-react";
import { motion } from "framer-motion";

export const Header = () => {
    const { data: session } = useSession();

    return (
        <header className="fixed top-0 w-full z-50 transition-all duration-300">
            <div className="glass mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8 py-4 rounded-2xl flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center text-white font-bold italic">
                        W
                    </div>
                    <span className="font-display text-xl font-bold tracking-tight text-brand">
                        WinWin<span className="text-brand-gold">Travel</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/search" className="text-sm font-medium text-brand hover:text-brand-gold transition-colors">
                        Discovery
                    </Link>
                    <Link href="/deals" className="text-sm font-medium text-brand hover:text-brand-gold transition-colors">
                        Deals
                    </Link>
                    <Link href="/experiences" className="text-sm font-medium text-brand hover:text-brand-gold transition-colors">
                        Experiences
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/wishlist" className="p-2 hover:bg-black/5 rounded-full transition-colors relative">
                        <Heart className="w-5 h-5 text-brand" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full" />
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gold leading-none mb-1">Traveler</p>
                                <p className="text-xs font-bold text-brand leading-none">
                                    {session.user?.name ? session.user.name.split(' ')[0] : 'Member'}
                                </p>
                            </div>
                            <Link href="/profile" className="flex items-center gap-2 group">
                                <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center border border-brand/5 overflow-hidden group-hover:border-brand-gold transition-colors">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-4 h-4 text-brand" />
                                    )}
                                </div>
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="text-xs font-semibold uppercase tracking-wider text-brand-muted hover:text-brand transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/auth/signin"
                            className="bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand/90 hover:shadow-premium transition-all active:scale-95"
                        >
                            Sign In
                        </Link>
                    )}

                    <button className="md:hidden p-2 hover:bg-black/5 rounded-full">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};
