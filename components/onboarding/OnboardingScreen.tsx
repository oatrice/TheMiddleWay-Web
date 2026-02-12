"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

interface Slide {
    id: string;
    title: string;
    body: string;
    image: string;
    isWelcome?: boolean;
    isFinal?: boolean;
}

interface OnboardingScreenProps {
    onComplete: () => void;
    slides?: Slide[];
}

const DEFAULT_SLIDES: Slide[] = [
    {
        id: "welcome",
        title: "Welcome to The Middle Way",
        body: "Find balance and harmony in your daily life.",
        image: "/assets/onboarding/welcome_logo.png",
        isWelcome: true,
    },
    {
        id: "authentic_wisdom",
        title: "Authentic Wisdom",
        body: "It's more than just quotes. It's timeless knowledge, verified and applied to modern life.",
        image: "/assets/onboarding/authentic_wisdom.png",
    },
    {
        id: "discover_path",
        title: "Discover Your Path",
        body: "Explore curated insights from philosophy, science, and art to find clarity.",
        image: "/assets/onboarding/discover_path.png",
    },
    {
        id: "daily_practice",
        title: "A Daily Practice",
        body: "Engage with one profound idea each day to build a more meaningful life.",
        image: "/assets/onboarding/daily_practice.png",
        isFinal: true,
    },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, slides = DEFAULT_SLIDES }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);

    const handleNext = () => {
        if (isCompleting) return;

        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsCompleting(true);
            onComplete();
        }
    };

    const handleSkip = () => {
        if (isCompleting) return;
        setIsCompleting(true);
        onComplete();
    };

    const currentSlide = slides[currentIndex];

    if (!currentSlide) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6 text-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center max-w-md w-full"
                >
                    {/* Image */}
                    <div className="relative w-64 h-64 mb-8 rounded-full overflow-hidden bg-surface-elevation-1 shadow-inner flex items-center justify-center">
                        <div className="relative w-full h-full p-6">
                            <Image
                                src={currentSlide.image}
                                alt={currentSlide.title}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        </div>
                    </div>

                    {/* Text */}
                    <h2 className="text-2xl font-bold text-text-primary mb-4 font-outfit">
                        {currentSlide.title}
                    </h2>
                    <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                        {currentSlide.body}
                    </p>

                    {/* Dots Indicator */}
                    <div className="flex space-x-2 mb-8">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${index === currentIndex ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="w-full space-y-4">
                        <button
                            onClick={handleNext}
                            className="w-full bg-primary text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center space-x-2"
                        >
                            <span>{currentSlide.isFinal ? "Begin Your Journey" : (currentSlide.isWelcome ? "Get Started" : "Next")}</span>
                            {currentSlide.isFinal ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                        </button>

                        {!currentSlide.isFinal && (
                            <button
                                onClick={handleSkip}
                                className="text-text-tertiary hover:text-text-primary transition-colors text-sm font-medium"
                            >
                                Skip
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
