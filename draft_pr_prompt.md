# PR Draft Prompt

You are an AI assistant helping to create a Pull Request description.
    
TASK: [Feature] Onboarding: Welcome Screen & "Authentic Wisdom" Introduction
ISSUE: {
  "title": "[Feature] Onboarding: Welcome Screen & \"Authentic Wisdom\" Introduction",
  "number": 11,
  "body": ""
}

GIT CONTEXT:
COMMITS:
340ad74 feat: add multi-step onboarding and fix toast notification timer
ac288d9 refactor(test): remove unused waitFor import and add eslint disable comment
263c92f 🐛 fix(ui): Manage toast timer with useEffect
84b3074 feat(onboarding): add multi-step onboarding flow for new users

STATS:
CHANGELOG.md                                       |  10 ++
 README.md                                          |   3 +-
 app/page.tsx                                       |  28 +++-
 code_review.md                                     | 144 ++++++++++++++++++++-
 components/onboarding/OnboardingScreen.tsx         | 144 +++++++++++++++++++++
 .../onboarding/__tests__/OnboardingScreen.test.tsx | 101 +++++++++++++++
 hooks/useOnboarding.ts                             |  58 +++++++++
 package.json                                       |   2 +-
 public/assets/onboarding/authentic_wisdom.png      | Bin 0 -> 36364 bytes
 public/assets/onboarding/daily_practice.png        | Bin 0 -> 82036 bytes
 public/assets/onboarding/discover_path.png         | Bin 0 -> 31889 bytes
 public/assets/onboarding/welcome_logo.png          | Bin 0 -> 20545 bytes
 12 files changed, 481 insertions(+), 9 deletions(-)

KEY FILE DIFFS:
diff --git a/app/page.tsx b/app/page.tsx
index 5481704..a910862 100644
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -7,18 +7,44 @@ import { AppHeader } from "@/components/features/wisdom-garden/AppHeader";
 import { WisdomGardenVisualization } from "@/components/features/wisdom-garden/WisdomGardenVisualization";
 import { PracticeChecklist } from "@/components/features/wisdom-garden/PracticeChecklist";
 import { useWisdomGarden } from "@/hooks/useWisdomGarden";
+import { useOnboarding } from "@/hooks/useOnboarding";
+import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
 import Link from "next/link";
 import { ArrowRight, Info } from "lucide-react";
 
 export default function WisdomGardenScreen() {
+  const { hasCompletedOnboarding, isLoading: isOnboardingLoading, completeOnboarding } = useOnboarding();
   const { selectedWeek, setSelectedWeek, weeklyData, isLoading } = useWisdomGarden();
   const [showToast, setShowToast] = useState(false);
 
+  // Manage the toast timer with useEffect for proper cleanup
+  React.useEffect(() => {
+    if (showToast) {
+      const timer = setTimeout(() => {
+        setShowToast(false);
+      }, 3000);
+
+      // Cleanup function to clear the timeout on unmount
+      return () => clearTimeout(timer);
+    }
+  }, [showToast]);
+
   const handleReadOnlyClick = () => {
     setShowToast(true);
-    setTimeout(() => setShowToast(false), 3000);
   };
 
+  if (isOnboardingLoading) {
+    return (
+      <div className="flex items-center justify-center min-h-screen bg-background text-text-secondary">
+        {/* Minimal loading state to prevent flash */}
+      </div>
+    );
+  }
+
+  if (!hasCompletedOnboarding) {
+    return <OnboardingScreen onComplete={completeOnboarding} />;
+  }
+
   if (isLoading || !weeklyData) {
     return (
       <div className="flex items-center justify-center min-h-screen text-text-secondary">
diff --git a/components/onboarding/OnboardingScreen.tsx b/components/onboarding/OnboardingScreen.tsx
new file mode 100644
index 0000000..01891c2
--- /dev/null
+++ b/components/onboarding/OnboardingScreen.tsx
@@ -0,0 +1,144 @@
+"use client";
+
+import React, { useState } from "react";
+import { motion, AnimatePresence } from "framer-motion";
+import Image from "next/image";
+import { ArrowRight, Check } from "lucide-react";
+
+interface Slide {
+    id: string;
+    title: string;
+    body: string;
+    image: string;
+    isWelcome?: boolean;
+    isFinal?: boolean;
+}
+
+interface OnboardingScreenProps {
+    onComplete: () => void;
+    slides?: Slide[];
+}
+
+const DEFAULT_SLIDES: Slide[] = [
+    {
+        id: "welcome",
+        title: "Welcome to The Middle Way",
+        body: "Find balance and harmony in your daily life.",
+        image: "/assets/onboarding/welcome_logo.png",
+        isWelcome: true,
+    },
+    {
+        id: "authentic_wisdom",
+        title: "Authentic Wisdom",
+        body: "It's more than just quotes. It's timeless knowledge, verified and applied to modern life.",
+        image: "/assets/onboarding/authentic_wisdom.png",
+    },
+    {
+        id: "discover_path",
+        title: "Discover Your Path",
+        body: "Explore curated insights from philosophy, science, and art to find clarity.",
+        image: "/assets/onboarding/discover_path.png",
+    },
+    {
+        id: "daily_practice",
+        title: "A Daily Practice",
+        body: "Engage with one profound idea each day to build a more meaningful life.",
+        image: "/assets/onboarding/daily_practice.png",
+        isFinal: true,
+    },
+];
+
+export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, slides = DEFAULT_SLIDES }) => {
+    const [currentIndex, setCurrentIndex] = useState(0);
+    const [isCompleting, setIsCompleting] = useState(false);
+
+    const handleNext = () => {
+        if (isCompleting) return;
+
+        if (currentIndex < slides.length - 1) {
+            setCurrentIndex(currentIndex + 1);
+        } else {
+            setIsCompleting(true);
+            onComplete();
+        }
+    };
+
+    const handleSkip = () => {
+        if (isCompleting) return;
+        setIsCompleting(true);
+        onComplete();
+    };
+
+    const currentSlide = slides[currentIndex];
+
+    if (!currentSlide) {
+        return null;
+    }
+
+    return (
+        <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6 text-center">
+            <AnimatePresence mode="wait">
+                <motion.div
+                    key={currentSlide.id}
+                    initial={{ opacity: 0, x: 20 }}
+                    animate={{ opacity: 1, x: 0 }}
+                    exit={{ opacity: 0, x: -20 }}
+                    transition={{ duration: 0.3 }}
+                    className="flex flex-col items-center max-w-md w-full"
+                >
+                    {/* Image */}
+                    <div className="relative w-64 h-64 mb-8 rounded-full overflow-hidden bg-surface-elevation-1 shadow-inner flex items-center justify-center">
+                        <div className="relative w-full h-full p-6">
+                            <Image
+                                src={currentSlide.image}
+                                alt={currentSlide.title}
+                                fill
+                                className="object-contain p-4"
+                                priority
+                            />
+                        </div>
+                    </div>
+
+                    {/* Text */}
+                    <h2 className="text-2xl font-bold text-text-primary mb-4 font-outfit">
+                        {currentSlide.title}
+                    </h2>
+                    <p className="text-text-secondary text-lg mb-8 leading-relaxed">
+                        {currentSlide.body}
+                    </p>
+
+                    {/* Dots Indicator */}
+                    <div className="flex space-x-2 mb-8">
+                        {slides.map((_, index) => (
+                            <div
+                                key={index}
+                                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${index === currentIndex ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
+                                    }`}
+                            />
+                        ))}
+                    </div>
+
+                    {/* Buttons */}
+                    <div className="w-full space-y-4">
+                        <button
+                            onClick={handleNext}
+                            className="w-full bg-primary text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center space-x-2"
+                        >
+                            <span>{currentSlide.isFinal ? "Begin Your Journey" : (currentSlide.isWelcome ? "Get Started" : "Next")}</span>
+                            {currentSlide.isFinal ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
+                        </button>
+
+                        {!currentSlide.isFinal && (
+                            <button
+                                onClick={handleSkip}
+                                className="text-text-tertiary hover:text-text-primary transition-colors text-sm font-medium"
+                            >
+                                Skip
+                            </button>
+                        )}
+                    </div>
+                </motion.div>
+            </AnimatePresence>
+        </div>
+    );
+};
diff --git a/components/onboarding/__tests__/OnboardingScreen.test.tsx b/components/onboarding/__tests__/OnboardingScreen.test.tsx
new file mode 100644
index 0000000..24c8e86
--- /dev/null
+++ b/components/onboarding/__tests__/OnboardingScreen.test.tsx
@@ -0,0 +1,101 @@
+import React from 'react';
+import { render, screen, fireEvent } from '@testing-library/react';
+import { OnboardingScreen } from '../OnboardingScreen';
+import '@testing-library/jest-dom';
+import { vi, describe, it, expect, beforeEach } from 'vitest';
+
+// Mock next/image
+vi.mock('next/image', () => ({
+    __esModule: true,
+    // eslint-disable-next-line @typescript-eslint/no-explicit-any
+    default: (props: any) => {
+        // eslint-disable-next-line @next/next/no-img-element
+        return <img {...props} alt={props.alt} />;
+    },
+}));
+
+// Mock Lucide icons
+vi.mock('lucide-react', () => ({
+    ArrowRight: () => <div data-testid="arrow-right" />,
+    Check: () => <div data-testid="check" />,
+}));
+
+describe('OnboardingScreen', () => {
+    const mockOnComplete = vi.fn();
+    const mockSlides = [
+        {
+            id: "1",
+            title: "Slide 1",
+            body: "Body 1",
+            image: "/img1.png",
+        },
+        {
+            id: "2",
+            title: "Slide 2",
+            body: "Body 2",
+            image: "/img2.png",
+            isFinal: true,
+        }
+    ];
+
+    beforeEach(() => {
+        vi.clearAllMocks();
+    });
+
+    it('renders the first slide correctly', () => {
+        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);
+        expect(screen.getByText('Slide 1')).toBeInTheDocument();
+        expect(screen.getByText('Body 1')).toBeInTheDocument();
+    });
+
+    it('navigates to next slide on click', async () => {
+        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);
+
+        fireEvent.click(screen.getByText('Next'));
+
+        expect(await screen.findByText('Slide 2')).toBeInTheDocument();
+    });
+
+    it('calls onComplete when clicking finish on last slide', async () => {
+        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);
+
+        // Go to last slide
+        fireEvent.click(screen.getByText('Next'));
+
+        // Wait for transition
+        const finishButton = await screen.findByText('Begin Your Journey');
+        fireEvent.click(finishButton);
+
+        expect(mockOnComplete).toHaveBeenCalledTimes(1);
+    });
+
+    it('calls onComplete when clicking Skip on first slide', () => {
+        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);
+
+        fireEvent.click(screen.getByText('Skip'));
+
+        expect(mockOnComplete).toHaveBeenCalledTimes(1);
+    });
+
+    it('handles empty slides array safely', () => {
+        const { container } = render(<OnboardingScreen onComplete={mockOnComplete} slides={[]} />);
+        expect(container).toBeEmptyDOMElement();
+        expect(mockOnComplete).not.toHaveBeenCalled();
+    });
+
+    it('calls onComplete only once on rapid clicks on final slide', async () => {
+        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);
+
+        // Go to last slide
+        fireEvent.click(screen.getByText('Next'));
+
+        const finishButton = await screen.findByText('Begin Your Journey');
+
+        // Click multiple times rapidly
+        fireEvent.click(finishButton);
+        fireEvent.click(finishButton);
+        fireEvent.click(finishButton);
+
+        expect(mockOnComplete).toHaveBeenCalledTimes(1);
+    });
+});
diff --git a/hooks/useOnboarding.ts b/hooks/useOnboarding.ts
new file mode 100644
index 0000000..26b1c04
--- /dev/null
+++ b/hooks/useOnboarding.ts
@@ -0,0 +1,58 @@
+"use client";
+
+import { useState, useEffect } from "react";
+
+const ONBOARDING_KEY = "onboarding_completed";
+
+export const useOnboarding = () => {
+    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true); // Default to true to avoid flash on load
+    const [isLoading, setIsLoading] = useState(true);
+
+    useEffect(() => {
+        const checkOnboarding = () => {
+            try {
+                const stored = localStorage.getItem(ONBOARDING_KEY);
+                // If stored is 'true', user has completed it.
+                // If null or 'false', user has not completed it.
+                if (stored === "true") {
+                    setHasCompletedOnboarding(true);
+                } else {
+                    setHasCompletedOnboarding(false);
+                }
+            } catch (error) {
+                console.error("Failed to read onboarding status", error);
+                // Fallback to true in case of error to not block user
+                setHasCompletedOnboarding(true);
+            } finally {
+                setIsLoading(false);
+            }
+        };
+
+        checkOnboarding();
+    }, []);
+
+    const completeOnboarding = () => {
+        try {
+            localStorage.setItem(ONBOARDING_KEY, "true");
+            setHasCompletedOnboarding(true);
+        } catch (error) {
+            console.error("Failed to save onboarding status", error);
+        }
+    };
+
+    const resetOnboarding = () => {
+        try {
+            localStorage.removeItem(ONBOARDING_KEY);
+            setHasCompletedOnboarding(false);
+        } catch (error) {
+            console.error("Failed to reset onboarding status", error);
+        }
+    }
+
+    return {
+        hasCompletedOnboarding,
+        isLoading,
+        completeOnboarding,
+        resetOnboarding
+    };
+};


PR TEMPLATE:


INSTRUCTIONS:
1. Generate a comprehensive PR description in Markdown format.
2. If a template is provided, fill it out intelligently.
3. If no template, use a standard structure: Summary, Changes, Impact.
4. Focus on 'Why' and 'What'.
5. Do not include 'Here is the PR description' preamble. Just the body.
6. IMPORTANT: Always use FULL URLs for links to issues and other PRs (e.g., https://github.com/owner/repo/issues/123), do NOT use short syntax (e.g., #123) to ensuring proper linking across platforms.
