"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { config } from "../../config";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getCookie(name: string): string | null {
    const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
}

export default function SuccessPage() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const completed = getCookie("gameCompleted");
        if (completed !== "true") {
            router.push("/");
        } else {
            setAuthorized(true);
        }
    }, [router]);

    useEffect(() => {
        if (!authorized) return;

        const duration = 12 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 25,
            spread: 360,
            ticks: 80,
            zIndex: 0,
        };

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 30 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ["#ec4899", "#f43f5e", "#fb7185", "#a855f7", "#fbbf24"],
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ["#ec4899", "#f43f5e", "#fb7185", "#a855f7", "#fbbf24"],
            });
        }, 350);

        return () => clearInterval(interval);
    }, [authorized]);

    if (!authorized) return null;

    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-start sm:justify-center py-8 sm:py-12 px-3 sm:px-4 md:px-8 text-center success-bg overflow-auto relative">
            {/* Subtle sparkle stars */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="star"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        fontSize: 10 + Math.random() * 10,
                        animationDuration: `${2 + Math.random() * 3}s`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                />
            ))}

            {/* Love Letter */}
            <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="letter-paper z-10 max-w-xl w-full rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-12 relative"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Corner flourishes */}
                <div className="absolute top-4 left-4 text-pink-300/60 text-2xl select-none">
                    ❦
                </div>
                <div
                    className="absolute top-4 right-4 text-pink-300/60 text-2xl select-none"
                    style={{ transform: "scaleX(-1)" }}
                >
                    ❦
                </div>
                <div
                    className="absolute bottom-4 left-4 text-pink-300/60 text-2xl select-none"
                    style={{ transform: "scaleY(-1)" }}
                >
                    ❦
                </div>
                <div
                    className="absolute bottom-4 right-4 text-pink-300/60 text-2xl select-none"
                    style={{ transform: "scale(-1)" }}
                >
                    ❦
                </div>

                {/* Top decorative line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-full h-px bg-gradient-to-r from-transparent via-pink-300/50 to-transparent mb-8"
                />

                {/* Greeting */}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600 font-pacifico mb-4 sm:mb-6"
                >
                    {config.letter.greeting}
                </motion.h2>

                {/* Body */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-sm sm:text-base md:text-lg text-rose-900/70 font-nunito leading-relaxed text-left space-y-3 sm:space-y-4 mb-6 sm:mb-8"
                >
                    {config.letter.body.split("\n\n").map((paragraph, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.3 }}
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </motion.div>

                {/* Closing */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="text-right mt-8"
                >
                    <p className="text-xl text-pink-600 font-pacifico mb-2">
                        {config.letter.closing}
                    </p>
                    <p className="text-2xl text-pink-500 font-pacifico">
                        {config.letter.signature}
                    </p>
                </motion.div>

                {/* Bottom decorative line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 2.5, duration: 0.8 }}
                    className="w-full h-px bg-gradient-to-r from-transparent via-pink-300/50 to-transparent mt-8"
                />
            </motion.div>

            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-8"
            >
                <Link
                    href="/gallery"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-nunito text-lg"
                >
                    📸 Our Memories
                </Link>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-white/80 text-pink-600 border border-pink-200 rounded-full font-bold hover:bg-white hover:scale-105 transition-all shadow-lg font-nunito text-lg"
                >
                    Play Again 💕
                </Link>
            </motion.div>
        </main>
    );
}
