"use client";

import { motion } from 'framer-motion';

export default function InkLoading() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.circle
                    cx="32" cy="32" r="28"
                    stroke="var(--ink-black)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, rotate: -90 }}
                    animate={{ pathLength: 1, rotate: 270 }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity
                    }}
                />
                <motion.circle
                    cx="32" cy="32" r="16"
                    fill="var(--ink-black)"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity
                    }}
                />
            </svg>
        </div>
    );
}
