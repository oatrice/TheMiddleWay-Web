"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/features/wisdom-garden/AppHeader";
import { WisdomGardenVisualization } from "@/components/features/wisdom-garden/WisdomGardenVisualization";
import { PracticeChecklist } from "@/components/features/wisdom-garden/PracticeChecklist";
import { WEEKLY_MOCK_DATA } from "@/lib/data/wisdom-garden-data";
import { WeeklyData } from "@/lib/types/wisdom-garden";

export default function WisdomGardenScreen() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const data = WEEKLY_MOCK_DATA.find(d => d.weekNumber === selectedWeek);
    if (data) {
      // Deep copy to avoid mutating the original mock data directly in a way that React might not detect
      setWeeklyData(JSON.parse(JSON.stringify(data)));
    }
  }, [selectedWeek]);

  const handleCheckItem = (itemId: string) => {
    if (!weeklyData) return;

    const newData = { ...weeklyData };
    let scoreChange = 0;

    newData.categories.forEach(cat => {
      cat.items.forEach(item => {
        if (item.id === itemId) {
          item.isCompleted = !item.isCompleted;
          scoreChange = item.isCompleted ? item.points : -item.points;
        }
      });
    });

    newData.currentScore += scoreChange;
    setWeeklyData(newData);
  };

  if (!weeklyData) return <div className="p-8 text-center text-text-secondary">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container-mobile py-6 min-h-screen"
    >
      <AppHeader
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
      />

      <WisdomGardenVisualization
        score={weeklyData.currentScore}
        maxScore={weeklyData.maxScore}
      />

      <PracticeChecklist
        data={weeklyData.categories} // Pass categories directly
        onCheckItem={handleCheckItem}
      />
    </motion.div>
  );
}
