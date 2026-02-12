import React from 'react';
import { PracticeCategory } from '@/lib/types/wisdom-garden';
import { PracticeCard } from './PracticeCard';

interface PracticeChecklistProps {
    categories: PracticeCategory[];
    onCheckItem: (id: string) => void;
}

export const PracticeChecklist: React.FC<PracticeChecklistProps> = ({ categories, onCheckItem }) => {
    return (
        <div className="space-y-6 pb-20">
            {categories.map((category) => (
                <div key={category.id}>
                    <h3 className="text-lg font-semibold text-text-primary mb-3 pl-1 border-l-4 border-primary/50">
                        {category.title}
                    </h3>
                    <div className="space-y-3">
                        {category.items.map((item) => (
                            <PracticeCard
                                key={item.id}
                                item={item}
                                onCheck={onCheckItem}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
