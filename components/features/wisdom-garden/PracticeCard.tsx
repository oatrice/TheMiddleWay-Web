import React from 'react';
import { motion } from 'framer-motion';
import { PracticeItem } from '@/lib/types/wisdom-garden';
import { Check } from 'lucide-react';

interface PracticeCardProps {
    item: PracticeItem;
    onCheck: (id: string) => void;
    readOnly?: boolean;
    onWarnReadOnly?: () => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({ item, onCheck, readOnly = false, onWarnReadOnly }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        flex items-center justify-between p-4 rounded-card border transition-all group
        ${item.isCompleted
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-surface border-border/30 hover:border-primary/30 hover:shadow-sm'
                }
        ${readOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
      `}
            onClick={() => readOnly ? onWarnReadOnly?.() : onCheck(item.id)}
        >
            <div className="flex-1">
                <h3 className={`font-medium transition-colors ${item.isCompleted ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                    {item.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">{item.points} points</p>
            </div>

            <div className={`
        w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300
        ${item.isCompleted
                    ? 'bg-primary border-primary scale-110'
                    : `border-border/50 ${!readOnly && 'group-hover:border-primary/50'}`
                }
      `}>
                {item.isCompleted && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
        </motion.div>
    );
};
