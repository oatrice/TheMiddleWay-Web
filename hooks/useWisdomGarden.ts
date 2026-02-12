
import { useState, useEffect, useCallback } from "react";
import { WeeklyData } from "@/lib/types/wisdom-garden";
import { WEEKLY_MOCK_DATA } from "@/lib/data/wisdom-garden-data";
import { togglePracticeItem } from "@/lib/logic/wisdom-garden";

export function useWisdomGarden() {
    const [selectedWeek, setSelectedWeekState] = useState(1);
    const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setSelectedWeek = useCallback((week: number) => {
        if (week === selectedWeek) return;
        setSelectedWeekState(week);
        setIsLoading(true);
    }, [selectedWeek]);

    // Load data effect
    useEffect(() => {
        // We don't set isLoading(true) here to avoid "setState in effect" warning.
        // It is handled in setSelectedWeek or initial state.

        const load = () => {
            // Try to load from localStorage first
            const storageKey = `wisdom_garden_week_${selectedWeek}`;
            const savedData = localStorage.getItem(storageKey);

            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setWeeklyData(parsed);
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
        };

        // Run load immediatley
        load();
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
