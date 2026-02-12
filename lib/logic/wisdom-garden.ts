
import { WeeklyData } from '../types/wisdom-garden';

export const togglePracticeItem = (data: WeeklyData, itemId: string): WeeklyData => {
    let scoreChange = 0;
    let itemFound = false;

    // Create new categories array with the updated item and calculate score change
    const newCategories = data.categories.map((category) => ({
        ...category,
        items: category.items.map((item) => {
            if (item.id === itemId) {
                itemFound = true;
                const newIsCompleted = !item.isCompleted;
                // If becoming completed, add points. If becoming incomplete, subtract points.
                scoreChange = newIsCompleted ? item.points : -item.points;
                return { ...item, isCompleted: newIsCompleted };
            }
            return item;
        }),
    }));

    // If item wasn't found, return original data (no changes)
    if (!itemFound) {
        return data;
    }

    // Return new state object with updated score
    return {
        ...data,
        categories: newCategories,
        currentScore: data.currentScore + scoreChange,
    };
};
