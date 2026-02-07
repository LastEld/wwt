"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HomeSearchForm() {
    const router = useRouter();
    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.set("destination", destination);
        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="mt-10 rounded-2xl bg-white/10 p-6 backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                    <label className="mb-2 block text-left text-sm font-medium text-white/80">
                        Destination
                    </label>
                    <input
                        type="text"
                        placeholder="Where are you going?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-left text-sm font-medium text-white/80">
                        Check-in
                    </label>
                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-left text-sm font-medium text-white/80">
                        Check-out
                    </label>
                    <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>
            </div>

            <button
                onClick={handleSearch}
                className="mt-6 w-full rounded-xl bg-accent-400 px-8 py-4 font-semibold text-primary-900 shadow-lg transition-all duration-300 hover:bg-accent-300 hover:shadow-xl active:scale-[0.98] md:w-auto"
            >
                Search Hotels
            </button>
        </div>
    );
}
