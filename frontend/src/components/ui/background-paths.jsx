"use client";

import { motion } from "framer-motion";

function FloatingPaths({ position = 1 }) {
    const paths = Array.from({ length: 56 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.65 + i * 0.028,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-white/40"
                viewBox="0 100 696 720"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
            >
                <title>Background Paths</title>
                {paths.map((path, index) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeOpacity={0.08 + index * 0.018}
                        initial={{ pathLength: 0.25, opacity: 0.35 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.35, 0.75, 0.35],
                            pathOffset: [0, 1],
                        }}
                        transition={{
                            duration: 24 + Math.random() * 18,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                            delay: index * 0.055 -8, // gentle stagger for ultra-smooth flow
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths() {
    return (
        <div className="absolute min-h-screen w-full overflow-hidden">
            {/* Animated Paths Layers */}
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* Subtle bottom fade (exactly as requested: "little fade in bottom") */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none" />
        </div>
    );
}