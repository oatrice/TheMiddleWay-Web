"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useThemeContext } from "@/components/ThemeProvider";

export function ThemeToggle() {
    const { isDark, toggleTheme, mounted } = useThemeContext();

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-surface/50" />
        );
    }

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-full bg-surface/50 border border-border/30 flex items-center justify-center hover:bg-surface transition-colors"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <motion.div
                key={isDark ? "moon" : "sun"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {isDark ? (
                    <Sun className="w-5 h-5 text-primary" />
                ) : (
                    <Moon className="w-5 h-5 text-primary" />
                )}
            </motion.div>
        </motion.button>
    );
}
