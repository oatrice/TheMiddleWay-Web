
"use client";

import React, { useState } from "react";
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
  React.useEffect(() => {
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
