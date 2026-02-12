
import { describe, it, expect } from 'vitest';
import { WeeklyData } from '../types/wisdom-garden';
// This file doesn't exist yet, so we are strictly in Red phase of TDD
import { togglePracticeItem } from './wisdom-garden';

describe('wisdom-garden logic', () => {
    const mockData: WeeklyData = {
        weekNumber: 1,
        currentScore: 0,
        maxScore: 20,
        categories: [
            {
                id: 'cat1',
                title: 'Category 1',
                items: [
                    { id: 'item1', title: 'Item 1', points: 10, isCompleted: false },
                    { id: 'item2', title: 'Item 2', points: 5, isCompleted: true },
                ],
            },
        ],
    };

    it('should toggle an unchecked item to checked and increase score', () => {
        const newData = togglePracticeItem(mockData, 'item1');

        expect(newData.currentScore).toBe(10);
        expect(newData.categories[0].items[0].isCompleted).toBe(true);
        // Ensure immutability
        expect(newData).not.toBe(mockData);
        expect(mockData.categories[0].items[0].isCompleted).toBe(false);
    });

    it('should toggle a checked item to unchecked and decrease score', () => {
        // Start with item2 completed and score 5 (technically mockData says 0 score, but logic should calculate delta based on existing state?)
        // Wait, mockData.currentScore is 0 but item2 isCompleted=true. That's inconsistent mock data.
        // Let's create consistent mock data first.
        const consistentMockData: WeeklyData = {
            ...mockData,
            currentScore: 5 // item2 is completed (5 points)
        };

        const newData = togglePracticeItem(consistentMockData, 'item2');

        expect(newData.currentScore).toBe(0);
        expect(newData.categories[0].items[1].isCompleted).toBe(false);
    });

    it('should do nothing if item id is not found', () => {
        const newData = togglePracticeItem(mockData, 'non-existent');
        expect(newData).toBe(mockData); // Strict equality if no changes
    });
});
