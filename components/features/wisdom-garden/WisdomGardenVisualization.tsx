import React from 'react';
import { motion } from 'framer-motion';

interface WisdomGardenVisualizationProps {
    score: number;
    maxScore: number;
}

// Placeholder SVGs for tree stages - using reliable emojis/simple shapes for mock
const TreeStage: React.FC<{ stage: number }> = ({ stage }) => {
    switch (stage) {
        case 0: return <span className="text-6xl">🌱</span>; // Seedling
        case 1: return <span className="text-7xl">🌿</span>; // Small plant
        case 2: return <span className="text-8xl">🪴</span>; // Potted plant
        case 3: return <span className="text-9xl">🌳</span>; // Young tree
        case 4: return <span className="text-9xl">🌸</span>; // Blooming tree
        default: return <span className="text-6xl">🌱</span>;
    }
};

export const WisdomGardenVisualization: React.FC<WisdomGardenVisualizationProps> = ({ score, maxScore }) => {
    const percentage = Math.min((score / maxScore) * 100, 100);

    // Determine tree stage based on percentage
    let stage = 0;
    if (percentage > 80) stage = 4;
    else if (percentage > 60) stage = 3;
    else if (percentage > 40) stage = 2;
    else if (percentage > 20) stage = 1;

    return (
        <div className="bg-surface/50 border border-border/30 backdrop-blur-sm rounded-card p-8 mb-8 flex flex-col items-center justify-center relative overflow-hidden h-64">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

            <motion.div
                key={stage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-4 z-10"
            >
                <TreeStage stage={stage} />
            </motion.div>

            <div className="z-10 text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-1">{score} / {maxScore}</h2>
                <p className="text-text-secondary text-sm">Mindfulness Score</p>
            </div>

            {/* Basic Progress Bar */}
            <div className="absolute bottom-0 left-0 h-2 bg-primary/20 w-full">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1 }}
                />
            </div>
        </div>
    );
};
