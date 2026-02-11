import React from 'react';
import { WeeklyData } from '@/lib/types/wisdom-garden';
import { PracticeCard } from './PracticeCard';

interface PracticeChecklistProps {
    data: WeeklyData;
    onCheckItem: (id: string) => void;
}

export const PracticeChecklist: React.FC<PracticeChecklistProps> = ({ data, onCheckItem }) => {
    return (
        <div className="space-y-6 pb-20">
            {data.categories.map((category) => (
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
