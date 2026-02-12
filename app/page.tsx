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
    // Try to load from localStorage first
    const storageKey = `wisdom_garden_week_${selectedWeek}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      try {
        setWeeklyData(JSON.parse(savedData));
        return;
      } catch (e) {
        console.error("Failed to parse saved wisdom garden data", e);
      }
    }

    // Fallback to Mock Data
    const data = WEEKLY_MOCK_DATA.find(d => d.weekNumber === selectedWeek);
    if (data) {
      // Deep copy to avoid mutating the original mock data
      setWeeklyData(JSON.parse(JSON.stringify(data)));
    }
  }, [selectedWeek]);

  // Helper to save data
  const persistData = (week: number, data: WeeklyData) => {
    localStorage.setItem(`wisdom_garden_week_${week}`, JSON.stringify(data));
  };

  const handleCheckItem = (itemId: string) => {
    if (!weeklyData) return;

    let scoreChange = 0;

    // Create a new categories array with the updated item (immutable update)
    const newCategories = weeklyData.categories.map(category => ({
      ...category,
      items: category.items.map(item => {
        if (item.id === itemId) {
          const newIsCompleted = !item.isCompleted;
          scoreChange = newIsCompleted ? item.points : -item.points;
          return { ...item, isCompleted: newIsCompleted };
        }
        return item;
      }),
    }));

    // Create the new state object
    const newData = {
      ...weeklyData,
      categories: newCategories,
      currentScore: weeklyData.currentScore + scoreChange,
    };

    persistData(selectedWeek, newData);
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
        categories={weeklyData.categories}
        onCheckItem={handleCheckItem}
      />
    </motion.div>
  );
}
