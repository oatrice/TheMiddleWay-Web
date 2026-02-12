
"use client";

import React from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/features/wisdom-garden/AppHeader";
import { PracticeChecklist } from "@/components/features/wisdom-garden/PracticeChecklist";
import { useWisdomGarden } from "@/hooks/useWisdomGarden";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WeeklyPracticesScreen() {
    const { selectedWeek, setSelectedWeek, weeklyData, toggleItem, isLoading } = useWisdomGarden();

    if (isLoading || !weeklyData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-text-secondary">
                Loading...
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container-mobile py-6 min-h-screen relative"
        >
            {/* Back Button */}
            <div className="mb-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-text-secondary hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Back to Dashboard
                </Link>
            </div>

            <AppHeader
                selectedWeek={selectedWeek}
                onSelectWeek={setSelectedWeek}
            />

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4 text-text-primary">
                    Weekly Practices
                </h2>
                <PracticeChecklist
                    categories={weeklyData.categories}
                    onCheckItem={toggleItem}
                />
            </div>
        </motion.div>
    );
}
