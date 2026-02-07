"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function SignInPage() {
    const [providers, setProviders] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/";
    const error = searchParams?.get("error");

    useEffect(() => {
        getProviders().then(setProviders);
    }, []);

    const handleSignIn = async (providerId: string) => {
        setIsLoading(providerId);
        await signIn(providerId, { callbackUrl });
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand via-brand-dark to-black py-20">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative w-full max-w-md mx-4"
            >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center text-white font-bold italic text-xl">
                                W
                            </div>
                        </Link>
                        <h1 className="font-display text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white/60">
                            Sign in to access your personalized travel experience
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                            {error === "OAuthAccountNotLinked"
                                ? "This email is already associated with another account."
                                : "An error occurred during sign in. Please try again."}
                        </div>
                    )}

                    {/* OAuth Buttons */}
                    <div className="space-y-4">
                        {providers ? (
                            Object.values(providers).map((provider: any) => (
                                <button
                                    key={provider.id}
                                    onClick={() => handleSignIn(provider.id)}
                                    disabled={isLoading !== null}
                                    className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all ${provider.id === "google"
                                        ? "bg-white text-gray-800 hover:bg-gray-100"
                                        : "bg-[#1877F2] text-white hover:bg-[#166FE5]"
                                        } ${isLoading === provider.id ? "opacity-70 cursor-wait" : ""}`}
                                >
                                    {provider.id === "google" && (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                    )}
                                    {provider.id === "facebook" && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    )}
                                    {isLoading === provider.id ? (
                                        <span>Signing in...</span>
                                    ) : (
                                        <span>Continue with {provider.name}</span>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="space-y-4">
                                <div className="h-14 bg-white/20 rounded-xl animate-pulse" />
                                <div className="h-14 bg-white/20 rounded-xl animate-pulse" />
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-white/40">Secure Login</span>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4 mb-8">
                        <button
                            onClick={() => signIn("credentials", { callbackUrl, redirect: true })}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 hover:bg-brand-gold hover:text-white transition-all group"
                        >
                            <Sparkles className="w-5 h-5 text-brand-gold group-hover:text-white transition-colors" />
                            <span className="text-sm font-bold uppercase tracking-widest font-display">Enter Demo Mode</span>
                        </button>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-white/60 text-sm">
                                <div className="w-8 h-8 bg-brand-gold/20 rounded-lg flex items-center justify-center text-brand-gold">
                                    ✨
                                </div>
                                <span>Personalized AI recommendations</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-sm">
                                <div className="w-8 h-8 bg-brand-gold/20 rounded-lg flex items-center justify-center text-brand-gold">
                                    💰
                                </div>
                                <span>Exclusive member-only deals</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-sm">
                                <div className="w-8 h-8 bg-brand-gold/20 rounded-lg flex items-center justify-center text-brand-gold">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <span>Neural Price Lock technology</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <p className="mt-8 text-center text-xs text-white/40">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="text-brand-gold hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-brand-gold hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-white/60 hover:text-brand-gold transition-colors text-sm">
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
