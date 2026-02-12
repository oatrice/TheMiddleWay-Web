# Luma Code Review Report

**Date:** 2026-02-12 20:55:23
**Files Reviewed:** ['components/onboarding/OnboardingScreen.tsx', 'hooks/useOnboarding.ts', 'app/page.tsx']

## 📝 Reviewer Feedback

There is a potential memory leak in `app/page.tsx`.

**File:** `app/page.tsx`

**Issue:** The `setTimeout` in the `handleReadOnlyClick` function is not cleared if the component unmounts before the timeout completes. This can lead to React trying to update the state of an unmounted component, causing a warning and a memory leak.

**Fix:** The timer should be managed by a `useEffect` hook, which provides a cleanup function to clear the timeout when the component unmounts or the relevant state changes.

**Explanation:**

1.  Import `useEffect` from React.
2.  Create a `useEffect` that runs whenever the `showToast` state changes.
3.  Inside the effect, if `showToast` is `true`, set the timeout.
4.  Return a cleanup function from the effect that calls `clearTimeout` on the timer ID. This ensures the timer is cancelled if the component unmounts.
5.  Update `handleReadOnlyClick` to only set `showToast` to `true`, as the `useEffect` will now handle the timer.

Here is the corrected code for `app/page.tsx`:

```typescript
"use client";

import React, { useState, useEffect } from "react"; // Import useEffect
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/features/wisdom-garden/AppHeader";
import { WisdomGardenVisualization } from "@/components/features/wisdom-garden/WisdomGardenVisualization";
import { PracticeChecklist } from "@/components/features/wisdom-garden/PracticeChecklist";
import { useWisdomGarden } from "@/hooks/useWisdomGarden";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

export default function WisdomGardenScreen() {
  const { hasCompletedOnboarding, isLoading: isOnboardingLoading, completeOnboarding } = useOnboarding();
  const { selectedWeek, setSelectedWeek, weeklyData, isLoading } = useWisdomGarden();
  const [showToast, setShowToast] = useState(false);

  // Manage the toast timer with useEffect for proper cleanup
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      // Cleanup function to clear the timeout on unmount
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleReadOnlyClick = () => {
    setShowToast(true);
  };

  if (isOnboardingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-text-secondary">
        {/* Minimal loading state to prevent flash */}
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

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
        <div className="opacity-80">
          <PracticeChecklist
            categories={weeklyData.categories}
            onCheckItem={() => { }} // No-op for read-only
            readOnly={true}
            onWarnReadOnly={handleReadOnlyClick}
          />
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-3 z-50"
          >
            <Info className="w-5 h-5 text-blue-400" />
            <p className="text-sm font-medium">Please go to &quot;Practice Room&quot; to check-in.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

## 🧪 Test Suggestions

*   **Empty `SLIDES` array:** The component's logic assumes the `SLIDES` array is not empty, as it immediately tries to access `SLIDES[currentIndex]` (where `currentIndex` is 0). A test case should be added where the `SLIDES` constant is mocked as an empty array (`[]`). The expected behavior is that the component does not crash and either calls `onComplete` immediately or renders a null/empty state.

*   **Rapid clicks on the final slide:** On the last slide, the `handleNext` function calls `onComplete`. If a user clicks the "Next" button multiple times quickly before the component unmounts or a loading state appears, the `onComplete` function could be triggered multiple times. A test should simulate rapid clicks on the final slide's action button and assert that `onComplete` is only called once.

*   **Skipping on the first slide:** The "Skip" functionality provides an immediate exit from the onboarding flow. A critical test is to trigger the `handleSkip` function on the very first slide (index 0). The test should verify that the `onComplete` callback is called immediately and that the component does not attempt to transition to the next slide.

