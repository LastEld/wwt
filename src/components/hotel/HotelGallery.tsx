"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface HotelGalleryProps {
    images: string[];
}

export const HotelGallery = ({ images }: HotelGalleryProps) => {
    const [index, setIndex] = useState<number | null>(null);

    return (
        <section className="relative px-4 max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px] rounded-[32px] overflow-hidden">
                {/* Main Image */}
                <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setIndex(0)}>
                    <img src={images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Hotel main" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>

                {/* Side Images */}
                <div className="col-span-1 row-span-1 relative group cursor-pointer" onClick={() => setIndex(1)}>
                    <img src={images[1] || images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery 1" />
                </div>
                <div className="col-span-1 row-span-1 relative group cursor-pointer" onClick={() => setIndex(2)}>
                    <img src={images[2] || images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery 2" />
                </div>
                <div className="col-span-1 row-span-1 relative group cursor-pointer" onClick={() => setIndex(3)}>
                    <img src={images[3] || images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery 3" />
                </div>
                <div className="col-span-1 row-span-1 relative group cursor-all-scroll bg-brand flex items-center justify-center" onClick={() => setIndex(4)}>
                    <div className="text-center text-white">
                        <Maximize2 className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-xs font-bold uppercase tracking-widest">View All</span>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {index !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-brand/95 flex items-center justify-center p-8 backdrop-blur-xl"
                        onClick={() => setIndex(null)}
                    >
                        <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                            <X className="w-8 h-8" />
                        </button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={images[index % images.length]}
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
