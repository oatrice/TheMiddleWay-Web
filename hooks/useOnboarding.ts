"use client";

import { useState, useEffect } from "react";

const ONBOARDING_KEY = "onboarding_completed";

export const useOnboarding = () => {
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true); // Default to true to avoid flash on load
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkOnboarding = () => {
            try {
                const stored = localStorage.getItem(ONBOARDING_KEY);
                // If stored is 'true', user has completed it.
                // If null or 'false', user has not completed it.
                if (stored === "true") {
                    setHasCompletedOnboarding(true);
                } else {
                    setHasCompletedOnboarding(false);
                }
            } catch (error) {
                console.error("Failed to read onboarding status", error);
                // Fallback to true in case of error to not block user
                setHasCompletedOnboarding(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkOnboarding();
    }, []);

    const completeOnboarding = () => {
        try {
            localStorage.setItem(ONBOARDING_KEY, "true");
            setHasCompletedOnboarding(true);
        } catch (error) {
            console.error("Failed to save onboarding status", error);
        }
    };

    const resetOnboarding = () => {
        try {
            localStorage.removeItem(ONBOARDING_KEY);
            setHasCompletedOnboarding(false);
        } catch (error) {
            console.error("Failed to reset onboarding status", error);
        }
    }

    return {
        hasCompletedOnboarding,
        isLoading,
        completeOnboarding,
        resetOnboarding
    };
};
