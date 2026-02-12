# Luma Code Review Report

**Date:** 2026-02-12 10:03:33
**Files Reviewed:** ['app/page.tsx', 'components/features/wisdom-garden/PracticeChecklist.tsx', 'components/features/wisdom-garden/WisdomGardenVisualization.tsx', 'components/features/wisdom-garden/WeekSelector.tsx', 'lib/types/wisdom-garden.ts', 'components/features/wisdom-garden/AppHeader.tsx', 'app/page.backup.tsx', 'components/features/wisdom-garden/PracticeCard.tsx', 'lib/data/wisdom-garden-data.ts', 'components/ThemeProvider.tsx']

## 📝 Reviewer Feedback

There are two issues in the submitted code.

### 1. Critical Logic Error: Incorrect `maxScore` in Mock Data

In `lib/data/wisdom-garden-data.ts`, the `maxScore` is hardcoded to `70`. However, the sum of points for all available items is only `40`.

-   Giving: 5 + 5 = 10 points
-   Ethics: 5 + 5 = 10 points
-   Meditation: 10 + 10 = 20 points
-   **Total = 40 points**

This discrepancy will cause the progress visualization to never reach 100%, capping out at 40/70 (around 57%). The user will never be able to see the higher-level tree stages.

**Fix:**

Calculate the `maxScore` dynamically or set it to the correct value of `40`. Here is the corrected code for `lib/data/wisdom-garden-data.ts`:

```typescript
import { WeeklyData } from "@/lib/types/wisdom-garden";

const categoriesTemplate = [
    {
        id: "giving",
        title: "Giving (ทาน)",
        items: [
            { id: "g1", title: "Offering alms to monks", points: 5, isCompleted: false },
            { id: "g2", title: "Donating to charity", points: 5, isCompleted: false },
        ],
    },
    {
        id: "ethics",
        title: "Ethics (ศีล)",
        items: [
            { id: "e1", title: "Abstaining from killing", points: 5, isCompleted: false },
            { id: "e2", title: "Abstaining from stealing", points: 5, isCompleted: false },
        ],
    },
    {
        id: "meditation",
        title: "Meditation (ภาวนา)",
        items: [
            { id: "m1", title: "Morning Meditation (15 mins)", points: 10, isCompleted: false },
            { id: "m2", title: "Evening Meditation (15 mins)", points: 10, isCompleted: false },
        ],
    },
];

const maxScore = categoriesTemplate.reduce((total, category) => 
    total + category.items.reduce((catTotal, item) => catTotal + item.points, 0), 0
); // This will correctly calculate to 40

export const WEEKLY_MOCK_DATA: WeeklyData[] = Array.from({ length: 8 }, (_, i) => ({
    weekNumber: i + 1,
    currentScore: 0,
    maxScore: maxScore, // Use the calculated max score
    // Deep copy categories to ensure each week has a unique instance
    categories: JSON.parse(JSON.stringify(categoriesTemplate)), 
}));
```

### 2. Best Practice: State Mutation in `handleCheckItem`

In `app/page.tsx`, the `handleCheckItem` function directly mutates the nested state.

```typescript
// Problematic mutation
newData.categories.forEach(cat => {
  cat.items.forEach(item => {
    if (item.id === itemId) {
      item.isCompleted = !item.isCompleted; // This is a direct mutation
      // ...
    }
  });
});
```

While this might work in this simple case, directly mutating state is an anti-pattern in React. It can lead to unpredictable behavior and bugs, especially when using memoization (`React.memo`, `useMemo`) or in more complex components. State updates should be immutable.

**Fix:**

Refactor `handleCheckItem` to create new arrays and objects for the parts of the state that are changing.

```typescript
// in app/page.tsx

const handleCheckItem = (itemId: string) => {
  if (!weeklyData) return;

  let scoreChange = 0;

  // Create a new categories array with the updated item
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

  setWeeklyData(newData);
};
```

## 🧪 Test Suggestions

*   **State Reset on Week Change:** Modify the state for a given week (e.g., check an item in Week 1, which increases the score). Then, switch to a different week (e.g., Week 2) and immediately switch back to the first week (Week 1). The component should display the original, unmodified state for Week 1, with the item unchecked and the score reset to its initial value, verifying that the deep copy in `useEffect` prevents state from one interaction from persisting.

*   **Selecting a Week with No Data:** After viewing a valid week (e.g., Week 1), select a week number that does not exist in the `WEEKLY_MOCK_DATA`. The application should not continue to display the stale data from Week 1. Instead, it should revert to the "Loading..." state or show a "No data available" message.

*   **Rapidly Toggling a Checklist Item:** Check an item and verify the score increases correctly. Immediately uncheck the same item. The test must confirm that the score decreases by the exact same amount, returning to its original value, ensuring the score calculation logic (`item.isCompleted ? item.points : -item.points`) is sound.

