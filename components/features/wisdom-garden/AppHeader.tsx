import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WeekSelector } from './WeekSelector';

interface AppHeaderProps {
    selectedWeek: number;
    onSelectWeek: (week: number) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ selectedWeek, onSelectWeek }) => {
    return (
        <header className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                        Wisdom Garden
                    </h1>
                    <p className="text-sm text-text-secondary">Cultivate your mindfulness</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Language Switcher placeholder - deferred */}
                    <ThemeToggle />
                </div>
            </div>

            <WeekSelector selectedWeek={selectedWeek} onSelectWeek={onSelectWeek} />
        </header>
    );
};
