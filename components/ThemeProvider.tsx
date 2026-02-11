"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useTheme, ThemeMode } from "@/hooks/useTheme";
import { useProgress } from "@/components/ProgressProvider";

interface ThemeContextType {
    theme: ThemeMode;
    isDark: boolean;
    isLight: boolean;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const themeState = useTheme();
    const { progress, setThemeMode } = useProgress();

    // Sync: เมื่อ progress โหลดค่า theme จาก persistence → set ให้ useTheme
    useEffect(() => {
        if (progress.themeMode !== themeState.theme) {
            themeState.setTheme(progress.themeMode);
        }
    }, [progress.themeMode, themeState.theme, themeState.setTheme]);

    // Sync: เมื่อ useTheme toggle → บันทึกกลับไป progress
    useEffect(() => {
        if (themeState.theme !== progress.themeMode) {
            setThemeMode(themeState.theme);
        }
    }, [themeState.theme, progress.themeMode, setThemeMode]);

    return (
        <ThemeContext.Provider value={themeState}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
}
