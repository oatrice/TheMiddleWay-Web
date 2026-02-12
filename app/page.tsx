
"use client";

import React from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/features/wisdom-garden/AppHeader";
import { WisdomGardenVisualization } from "@/components/features/wisdom-garden/WisdomGardenVisualization";
import { PracticeChecklist } from "@/components/features/wisdom-garden/PracticeChecklist";
import { useWisdomGarden } from "@/hooks/useWisdomGarden";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WisdomGardenScreen() {
  const { selectedWeek, setSelectedWeek, weeklyData, isLoading } = useWisdomGarden();

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
      className="container-mobile py-6 min-h-screen relative pb-24"
    >
      <AppHeader
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
      />

      <WisdomGardenVisualization
        score={weeklyData.currentScore}
        maxScore={weeklyData.maxScore}
      />

      {/* Navigation to Practice Room */}
      <div className="px-4 mt-8 mb-6">
        <Link href="/weekly-practices">
          <button className="w-full bg-primary text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center space-x-2">
            <span>Go to Practice Room</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-text-primary px-4 mb-2 opacity-80">
          Weekly Check-in Summary
        </h3>
        <div className="opacity-80 pointer-events-none">
          <PracticeChecklist
            categories={weeklyData.categories}
            onCheckItem={() => { }} // No-op for read-only
            readOnly={true}
          />
        </div>
      </div>
    </motion.div>
  );
}
