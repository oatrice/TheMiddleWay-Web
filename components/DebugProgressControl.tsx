"use client";

import { useProgress } from "@/components/ProgressProvider";
import { motion } from "framer-motion";

export function DebugProgressControl() {
    const {
        progress,
        completeLesson,
        toggleBookmark,
        setLanguage,
        resetProgress,
    } = useProgress();

    return (
        <div className="p-4 rounded-lg border border-border/50 bg-surface/50 text-sm space-y-4">
            <h3 className="font-semibold text-primary">🛠️ Debug: Persistence Control</h3>

            {/* 1. View Data */}
            <div className="bg-black/5 p-3 rounded font-mono text-xs overflow-x-auto whitespace-pre-wrap dark:bg-black/30">
                {JSON.stringify(progress, null, 2)}
            </div>

            {/* 2. Controls */}
            <div className="grid grid-cols-2 gap-2">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => completeLesson(`lesson-${Date.now()}`)}
                    className="bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20"
                >
                    ✅ Complete Lesson (Random)
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBookmark("bookmark-demo")}
                    className="bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20"
                >
                    🔖 Toggle Bookmark
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLanguage(progress.language === "th" ? "en" : "th")}
                    className="bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20"
                >
                    🌐 Toggle Lang ({progress.language})
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={resetProgress}
                    className="bg-red-500/10 text-red-500 px-3 py-2 rounded hover:bg-red-500/20 col-span-2 border border-red-500/20"
                >
                    ⚠️ Reset All Data
                </motion.button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
                * กดปุ่มแล้วลอง Refresh หน้าเว็บ (data ต้องยังอยู่)
            </p>
        </div>
    );
}
