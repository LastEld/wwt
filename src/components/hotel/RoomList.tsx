"use client";

import { motion } from "framer-motion";
import { CheckCircle2, BedDouble, Users, Coffee } from "lucide-react";

interface RoomListProps {
    rooms: any[];
}

export const RoomList = ({ rooms }: RoomListProps) => {
    return (
        <section className="mb-16">
            <h2 className="font-display text-3xl font-bold text-brand mb-8 px-4 md:px-0">Available Options</h2>
            <div className="space-y-4">
                {rooms.map((room, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-premium transition-all border border-black/5"
                    >
                        <div className="flex gap-6 items-center">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/5 flex-shrink-0">
                                <img src={room.images?.[0] || "/placeholders/room.jpg"} className="w-full h-full object-cover" alt={room.name} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-brand mb-1">{room.name}</h4>
                                <div className="flex items-center gap-4 text-brand-muted text-xs font-bold uppercase tracking-wider">
                                    <div className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> 1 King</div>
                                    <div className="flex items-center gap-1"><Users className="w-3 h-3" /> 2 Adults</div>
                                    <div className="flex items-center gap-1 text-green-600"><Coffee className="w-3 h-3" /> Breakfast Incl.</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                            <div className="text-right">
                                <span className="block text-2xl font-bold italic text-brand">€{room.price.amount}</span>
                                <span className="text-[10px] font-bold uppercase text-brand-muted tracking-tighter">Instant Confirmation</span>
                            </div>
                            <button className="btn-primary w-full md:w-auto">Select Room</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
