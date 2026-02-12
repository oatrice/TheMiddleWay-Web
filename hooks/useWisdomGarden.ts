
import { useState, useEffect, useCallback } from "react";
import { WeeklyData } from "@/lib/types/wisdom-garden";
import { WEEKLY_MOCK_DATA } from "@/lib/data/wisdom-garden-data";
import { togglePracticeItem } from "@/lib/logic/wisdom-garden";

export function useWisdomGarden() {
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load data
    useEffect(() => {
        setIsLoading(true);
        // Try to load from localStorage first
        const storageKey = `wisdom_garden_week_${selectedWeek}`;
        const savedData = localStorage.getItem(storageKey);

        if (savedData) {
            try {
                setWeeklyData(JSON.parse(savedData));
                setIsLoading(false);
                return;
            } catch (e) {
                console.error("Failed to parse saved wisdom garden data", e);
            }
        }

        // Fallback to Mock Data
        const data = WEEKLY_MOCK_DATA.find((d) => d.weekNumber === selectedWeek);
        if (data) {
            // Deep copy to avoid mutating the original mock data
            setWeeklyData(JSON.parse(JSON.stringify(data)));
        }
        setIsLoading(false);
    }, [selectedWeek]);

    // Persist data helper
    const persistData = useCallback((week: number, data: WeeklyData) => {
        localStorage.setItem(`wisdom_garden_week_${week}`, JSON.stringify(data));
    }, []);

    // Toggle Item Action
    const handleToggleItem = useCallback((itemId: string) => {
        if (!weeklyData) return;

        const newData = togglePracticeItem(weeklyData, itemId);

        // Optimistic update
        setWeeklyData(newData);
        persistData(selectedWeek, newData);
    }, [weeklyData, selectedWeek, persistData]);

    // Handle storage events to sync across tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === `wisdom_garden_week_${selectedWeek}` && e.newValue) {
                try {
                    setWeeklyData(JSON.parse(e.newValue));
                } catch (error) {
                    console.error("Failed to sync storage change", error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [selectedWeek]);

    return {
        selectedWeek,
        setSelectedWeek,
        weeklyData,
        isLoading,
        toggleItem: handleToggleItem,
    };
}
