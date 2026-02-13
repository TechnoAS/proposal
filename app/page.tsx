"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Cookie helpers
function setCookie(name: string, value: string, days: number = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

// ============================
// SVG COMPONENTS
// ============================

const HeartIcon = ({
  size = 40,
  className = "",
  style = {},
  onClick,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    onClick={onClick}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const EnvelopeSVG = ({
  size = 140,
  className = "",
  onClick,
}: {
  size?: number;
  className?: string;
  onClick?: () => void;
}) => (
  <svg
    width={size}
    height={size * 0.72}
    viewBox="0 0 140 100"
    className={className}
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    {/* Glow filter */}
    <defs>
      <filter id="envelope-glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="env-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fecdd3" />
        <stop offset="100%" stopColor="#fda4af" />
      </linearGradient>
      <linearGradient id="flap-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffe4e6" />
        <stop offset="100%" stopColor="#fecdd3" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="70" cy="95" rx="55" ry="4" fill="rgba(0,0,0,0.15)" />
    {/* Body */}
    <rect
      x="8"
      y="20"
      width="124"
      height="72"
      rx="8"
      fill="url(#env-grad)"
      stroke="#e11d48"
      strokeWidth="1.5"
      filter="url(#envelope-glow)"
    />
    {/* Flap */}
    <polygon
      points="8,20 70,60 132,20"
      fill="url(#flap-grad)"
      stroke="#e11d48"
      strokeWidth="1.5"
    />
    {/* Inner lines */}
    <line x1="8" y1="92" x2="50" y2="58" stroke="#e11d48" strokeWidth="1" opacity="0.3" />
    <line x1="132" y1="92" x2="90" y2="58" stroke="#e11d48" strokeWidth="1" opacity="0.3" />
    {/* Heart seal */}
    <circle cx="70" cy="72" r="12" fill="#e11d48" opacity="0.9" />
    <text
      x="70"
      y="77"
      textAnchor="middle"
      fill="white"
      fontSize="14"
      fontFamily="serif"
    >
      ♥
    </text>
  </svg>
);

// ============================
// PARTICLE SYSTEM
// ============================

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const PARTICLE_COLORS = [
  "rgba(236, 72, 153, 0.4)",
  "rgba(244, 114, 182, 0.3)",
  "rgba(168, 85, 247, 0.3)",
  "rgba(139, 92, 246, 0.25)",
  "rgba(251, 191, 36, 0.2)",
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 10,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  }));
}

// ============================
// STARS
// ============================

interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function generateStars(count: number): StarData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 8 + Math.random() * 14,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 3,
  }));
}

// ============================
// DECORATIVE SCENE ELEMENTS
// ============================

const SceneFlower = ({ x, y, scale = 1, delay = 0 }: { x: string; y: string; scale?: number; delay?: number }) => (
  <div
    className="float-gentle absolute pointer-events-none"
    style={{ left: x, top: y, animationDelay: `${delay}s`, transform: `scale(${scale})` }}
  >
    <svg width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="12" r="9" fill="rgba(244, 114, 182, 0.5)" />
      <circle cx="12" cy="25" r="9" fill="rgba(251, 146, 191, 0.5)" />
      <circle cx="38" cy="25" r="9" fill="rgba(244, 114, 182, 0.5)" />
      <circle cx="18" cy="38" r="9" fill="rgba(251, 146, 191, 0.5)" />
      <circle cx="32" cy="38" r="9" fill="rgba(244, 114, 182, 0.5)" />
      <circle cx="25" cy="25" r="6" fill="rgba(251, 191, 36, 0.7)" />
    </svg>
  </div>
);

const SceneCloud = ({ x, y, size = 90, delay = 0 }: { x: string; y: string; size?: number; delay?: number }) => (
  <div
    className="float-slow absolute pointer-events-none"
    style={{ left: x, top: y, animationDelay: `${delay}s` }}
  >
    <svg width={size} height={size * 0.5} viewBox="0 0 100 50" opacity="0.12">
      <ellipse cx="50" cy="35" rx="40" ry="14" fill="white" />
      <ellipse cx="30" cy="25" rx="25" ry="14" fill="white" />
      <ellipse cx="65" cy="22" rx="28" ry="12" fill="white" />
    </svg>
  </div>
);

// ============================
// GAME CONFIG
// ============================

interface HiddenHeart {
  id: number;
  x: number;
  y: number;
  found: boolean;
  animating: boolean;
}

const HEART_SPOTS = [
  { x: 15, y: 28 },
  { x: 78, y: 38 },
  { x: 42, y: 70 },
];

// ============================
// RIPPLE EFFECTS
// ============================

interface Ripple {
  id: number;
  x: number;
  y: number;
}

// ============================
// MAIN COMPONENT
// ============================

export default function Home() {
  const [hearts, setHearts] = useState<HiddenHeart[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [particles] = useState(() => generateParticles(25));
  const [stars] = useState(() => generateStars(15));
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const startGame = useCallback(() => {
    setHearts(
      HEART_SPOTS.map((spot, i) => ({
        id: i,
        x: spot.x,
        y: spot.y,
        found: false,
        animating: false,
      }))
    );
    setFoundCount(0);
    setShowEnvelope(false);
    setGameStarted(true);
    setCookie("heartsFound", "0");
    setCookie("gameCompleted", "false");
  }, []);

  const addRipple = (x: number, y: number) => {
    const id = rippleId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  const handleHeartClick = (id: number, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    addRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);

    setHearts((prev) =>
      prev.map((h) =>
        h.id === id && !h.found ? { ...h, found: true, animating: true } : h
      )
    );

    const newCount = foundCount + 1;
    setFoundCount(newCount);
    setCookie("heartsFound", String(newCount));

    if (newCount >= 3) {
      setCookie("gameCompleted", "true");
      setTimeout(() => setShowEnvelope(true), 1000);
    }
  };

  const handleEnvelopeClick = () => {
    router.push("/success");
  };

  if (!mounted) return null;

  // ==================
  // START SCREEN
  // ==================
  if (!gameStarted) {
    return (
      <main className="relative flex h-[100dvh] flex-col items-center justify-center p-4 text-center overflow-hidden game-bg">
        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              background: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Stars */}
        {stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              fontSize: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass-panel z-10 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 max-w-lg w-full rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 mx-3"
        >
          {/* Animated heart with glow rings */}
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 3, -3, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <HeartIcon size={60} className="text-pink-500 sm:w-[90px] sm:h-[90px]" style={{ filter: "drop-shadow(0 0 20px rgba(236,72,153,0.6))" }} />
            </motion.div>
            {/* Glow rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  border: "1px solid rgba(236,72,153,0.2)",
                  borderRadius: "50%",
                  top: "50%",
                  left: "50%",
                  width: 90 + i * 30,
                  height: 90 + i * 30,
                  marginTop: -(90 + i * 30) / 2,
                  marginLeft: -(90 + i * 30) / 2,
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
              />
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent font-pacifico tracking-wide">
            Find My Heart
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-pink-200/70 font-nunito leading-relaxed">
            I&apos;ve hidden <span className="text-pink-400 font-bold">3 hearts</span> for you to find.
            <br />
            Can you find them all? 💕
          </p>

          <motion.button
            className="px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full shadow-lg btn-glow font-pacifico tracking-wider mt-2"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
          >
            ✨ Start Finding!
          </motion.button>
        </motion.div>
      </main>
    );
  }

  // ==================
  // GAME SCREEN
  // ==================
  return (
    <main className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden game-bg select-none">
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Scene decorations */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <SceneFlower x="6%" y="15%" delay={0} />
        <SceneFlower x="85%" y="22%" scale={0.7} delay={1.5} />
        <SceneFlower x="12%" y="65%" scale={0.8} delay={0.8} />
        <SceneFlower x="80%" y="70%" scale={0.6} delay={2.2} />
        <SceneCloud x="20%" y="8%" size={110} delay={0} />
        <SceneCloud x="65%" y="12%" size={80} delay={2} />
        <SceneCloud x="5%" y="45%" size={70} delay={1} />
        <SceneCloud x="75%" y="55%" size={90} delay={3} />
      </div>

      {/* Ripple effects */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="ripple-ring"
          style={{ left: r.x - 20, top: r.y - 20, position: "fixed", zIndex: 60 }}
        />
      ))}

      {/* ===== HEART COUNTER (top HUD) ===== */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 z-30 glass-panel px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-4"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`counter-${i}-${foundCount > i}`}
            animate={foundCount > i ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <HeartIcon
              size={30}
              className={`transition-all duration-500 ${foundCount > i
                ? "text-pink-500"
                : "text-white/15"
                }`}
              style={
                foundCount > i
                  ? { filter: "drop-shadow(0 0 8px rgba(236,72,153,0.7))" }
                  : {}
              }
            />
          </motion.div>
        ))}
        <div className="w-px h-6 bg-white/10 mx-1" />
        <span className="text-pink-300 font-bold font-nunito text-lg tabular-nums">
          {foundCount}<span className="text-white/30">/3</span>
        </span>
      </motion.div>

      {/* ===== HINT TEXT (bottom) ===== */}
      <AnimatePresence>
        {!showEnvelope && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 glass-panel-light px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl max-w-[90vw]"
          >
            <p className="text-pink-300/80 font-nunito text-sm md:text-base">
              {foundCount === 0
                ? "🔍 Look carefully... the hearts are hiding!"
                : foundCount < 3
                  ? `💫 ${3 - foundCount} more heart${3 - foundCount > 1 ? "s" : ""} to go!`
                  : "✨ Amazing! You found them all!"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HIDDEN HEARTS ===== */}
      {hearts.map((heart) => (
        <AnimatePresence key={heart.id}>
          {!heart.found ? (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + heart.id * 0.2, type: "spring" }}
              className="absolute z-20"
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <HeartIcon
                size={46}
                className="heart-hidden text-pink-400/40"
                onClick={(e: React.MouseEvent) => handleHeartClick(heart.id, e)}
              />
            </motion.div>
          ) : heart.animating ? (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: [1, 1.8, 2.5],
                opacity: [1, 0.8, 0],
                y: [0, -30, -60],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onAnimationComplete={() => {
                setHearts((prev) =>
                  prev.map((h) =>
                    h.id === heart.id ? { ...h, animating: false } : h
                  )
                );
              }}
              className="absolute z-20"
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <HeartIcon
                size={46}
                className="text-pink-500"
                style={{ filter: "drop-shadow(0 0 20px rgba(236,72,153,0.9))" }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      ))}

      {/* ===== ENVELOPE REVEAL ===== */}
      <AnimatePresence>
        {showEnvelope && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-40"
            style={{ background: "rgba(15, 10, 26, 0.6)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
              className="text-center flex flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-4xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-pacifico mb-8"
              >
                You found all my hearts! 💕
              </motion.p>

              <div className="envelope-float" onClick={handleEnvelopeClick}>
                <EnvelopeSVG size={180} />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="mt-6 text-lg text-pink-300/80 font-nunito"
              >
                ✨ Tap the envelope to read your letter ✨
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
