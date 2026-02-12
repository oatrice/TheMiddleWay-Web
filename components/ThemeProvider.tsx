"use client";

import { createContext, useContext, useEffect, ReactNode, useCallback, useMemo } from "react";
import { useTheme, ThemeMode } from "@/hooks/useTheme";
import { useProgress } from "@/components/ProgressProvider";

interface ThemeContextType {
    theme: ThemeMode;
    isDark: boolean;
    isLight: boolean;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const themeState = useTheme();
    const { theme, setTheme: internalSetTheme } = themeState;
    const { progress, setThemeMode } = useProgress();

    // Sync: Progress -> Theme (Priority to Progress/Storage)
    // Only update local theme if it differs from persisted progress
    useEffect(() => {
        if (progress.themeMode && progress.themeMode !== theme) {
            internalSetTheme(progress.themeMode);
        }
    }, [progress.themeMode, theme, internalSetTheme]);

    // Wrap actions to update both local state and persistence
    const toggleTheme = useCallback(() => {
        const newTheme = theme === "dark" ? "light" : "dark";
        internalSetTheme(newTheme);
        setThemeMode(newTheme);
    }, [theme, internalSetTheme, setThemeMode]);

    const setTheme = useCallback((mode: ThemeMode) => {
        internalSetTheme(mode);
        setThemeMode(mode);
    }, [internalSetTheme, setThemeMode]);

    const value = useMemo(() => ({
        ...themeState,
        toggleTheme,
        setTheme
    }), [themeState, toggleTheme, setTheme]);

    return (
        <ThemeContext.Provider value={value}>
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
