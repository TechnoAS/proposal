"use client";

import { useState, useRef, useEffect } from "react";

export default function MusicPlayer() {
    const [playing, setPlaying] = useState(true);
    const [mounted, setMounted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setMounted(true);
        const audio = new Audio("/music.mp3");
        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;

        // Try autoplay immediately
        audio.play().catch(() => { });

        // Browsers block autoplay — so also start on first user interaction
        const startOnInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(() => { });
            }
        };
        document.addEventListener("click", startOnInteraction, { once: true });
        document.addEventListener("touchstart", startOnInteraction, { once: true });

        return () => {
            audio.pause();
            audioRef.current = null;
            document.removeEventListener("click", startOnInteraction);
            document.removeEventListener("touchstart", startOnInteraction);
        };
    }, []);

    const toggle = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggle}
            className="fixed bottom-5 right-5 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
            style={{
                background: playing
                    ? "linear-gradient(135deg, #ec4899, #a855f7)"
                    : "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: playing
                    ? "0 0 20px rgba(236,72,153,0.4), 0 4px 15px rgba(0,0,0,0.2)"
                    : "0 4px 15px rgba(0,0,0,0.2)",
            }}
            aria-label={playing ? "Pause music" : "Play music"}
            title={playing ? "Pause music" : "Play music"}
        >
            {playing ? (
                /* Animated bars when playing */
                <div className="flex items-end gap-[3px] h-5">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-[3px] bg-white rounded-full"
                            style={{
                                animation: `musicBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                            }}
                        />
                    ))}
                </div>
            ) : (
                /* Music note icon when paused */
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="white"
                    opacity={0.8}
                >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
            )}
        </button>
    );
}
