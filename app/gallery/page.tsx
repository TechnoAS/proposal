"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// All images from public/
const IMAGES = [
    "/as.jpeg",
    "/csbd.jpeg",
    "/dcdj.jpeg",
    "/e.jpeg",
    "/hdcb.jpeg",
    "/i1.jpeg",
    "/jd.jpeg",
    "/kds.jpeg",
    "/mdc.jpeg",
    "/ndcs.jpeg",
    "/sdc.jpeg",
    "/sxcs.jpeg",
    "/WhatsApp Image 2026-02-13 at 11.22.11 PM.jpeg",
    "/WhatsApp Image 2026-02-13 at 11.22.s.jpeg",
];

export default function GalleryPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Keyboard nav for lightbox
    useEffect(() => {
        if (selectedIndex === null) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedIndex(null);
            if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev !== null ? (prev + 1) % IMAGES.length : null));
            if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev !== null ? (prev - 1 + IMAGES.length) % IMAGES.length : null));
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [selectedIndex]);

    if (!mounted) return null;

    return (
        <main className="min-h-screen relative" style={{ background: "linear-gradient(170deg, #fff0f3 0%, #fce7f3 25%, #fdf2f8 50%, #fce7f3 75%, #fff0f5 100%)" }}>
            {/* Floating romantic decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Floating hearts */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={`heart-${i}`}
                        className="absolute text-pink-300/20 select-none"
                        style={{
                            left: `${5 + (i * 8) % 90}%`,
                            top: `${10 + (i * 17) % 80}%`,
                            fontSize: 16 + (i % 4) * 10,
                            animation: `float-gentle ${5 + (i % 4) * 2}s ease-in-out ${i * 0.5}s infinite`,
                        }}
                    >
                        ♥
                    </div>
                ))}

                {/* Sparkle stars */}
                {[...Array(10)].map((_, i) => (
                    <div
                        key={`star-${i}`}
                        className="star"
                        style={{
                            left: `${8 + (i * 11) % 85}%`,
                            top: `${5 + (i * 13) % 90}%`,
                            fontSize: 8 + (i % 3) * 5,
                            animationDuration: `${2 + (i % 3)}s`,
                            animationDelay: `${i * 0.3}s`,
                            position: "fixed",
                        }}
                    />
                ))}

                {/* Kiss marks */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={`kiss-${i}`}
                        className="absolute text-rose-200/15 select-none"
                        style={{
                            left: `${15 + (i * 20) % 75}%`,
                            top: `${20 + (i * 23) % 65}%`,
                            fontSize: 24 + (i % 3) * 8,
                            animation: `float-slow ${7 + i}s ease-in-out ${i * 1.2}s infinite`,
                            transform: `rotate(${-15 + i * 10}deg)`,
                        }}
                    >
                        💋
                    </div>
                ))}

                {/* Rose petals / flowers */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={`petal-${i}`}
                        className="absolute text-pink-200/20 select-none"
                        style={{
                            left: `${3 + (i * 18) % 90}%`,
                            top: `${8 + (i * 19) % 85}%`,
                            fontSize: 18 + (i % 3) * 6,
                            animation: `float-gentle ${6 + (i % 3) * 2}s ease-in-out ${i * 0.7}s infinite`,
                        }}
                    >
                        🌸
                    </div>
                ))}
            </div>

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-pink-200/40 shadow-sm"
            >
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/success"
                        className="text-pink-500 hover:text-pink-700 transition-colors font-nunito flex items-center gap-2 text-sm font-semibold"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-pink-600 font-pacifico">
                        Our Memories 💕
                    </h1>
                    <span className="text-pink-400 font-nunito text-sm">{IMAGES.length} photos</span>
                </div>
            </motion.header>

            {/* CSS Columns Masonry — reliable and shows ALL images */}
            <div className="max-w-5xl mx-auto px-3 py-6 pb-20 columns-2 md:columns-3 gap-3">
                {IMAGES.map((src, i) => (
                    <motion.div
                        key={src}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                        className="mb-3 break-inside-avoid group cursor-pointer relative overflow-hidden rounded-2xl"
                        style={{ breakInside: "avoid" }}
                        onClick={() => setSelectedIndex(i)}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={`Memory ${i + 1}`}
                            className="w-full h-auto block rounded-2xl transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                        {/* Heart on hover */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ec4899" style={{ filter: "drop-shadow(0 0 6px rgba(236,72,153,0.7))" }}>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>

                        {/* Border */}
                        <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-pink-300/40 transition-colors duration-300 pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <footer className="text-center pb-10 pt-4">
                <p className="text-pink-400/60 font-pacifico text-base sm:text-lg">
                    Made with love by your always, <span className="text-pink-500/80">Siddhant</span> ❤️
                </p>
            </footer>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedIndex(null)}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-4 right-4 z-60 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Prev */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex - 1 + IMAGES.length) % IMAGES.length); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-60 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        {/* Next */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex + 1) % IMAGES.length); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-60 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>

                        {/* Image */}
                        <motion.div
                            key={selectedIndex}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 250, damping: 22 }}
                            className="max-w-4xl max-h-[85vh] px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={IMAGES[selectedIndex]}
                                alt={`Memory ${selectedIndex + 1}`}
                                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                            />
                        </motion.div>

                        {/* Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white/70 px-4 py-1.5 rounded-full text-sm font-nunito backdrop-blur-sm">
                            {selectedIndex + 1} / {IMAGES.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
