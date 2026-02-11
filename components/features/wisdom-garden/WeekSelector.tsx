import React from 'react';

interface WeekSelectorProps {
    selectedWeek: number;
    onSelectWeek: (week: number) => void;
    currentWeek?: number; // Optional: to highlight actual current week
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({ selectedWeek, onSelectWeek, currentWeek = 1 }) => {
    const weeks = Array.from({ length: 8 }, (_, i) => i + 1);

    return (
        <div className="flex justify-center space-x-2 my-4 overflow-x-auto p-2">
            {weeks.map((week) => (
                <button
                    key={week}
                    onClick={() => onSelectWeek(week)}
                    className={`
            w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all
            ${selectedWeek === week
                            ? 'bg-primary text-primary-foreground shadow-md scale-110'
                            : 'bg-surface border border-border/30 text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        }
          `}
                >
                    {week}
                </button>
            ))}
        </div>
    );
};
