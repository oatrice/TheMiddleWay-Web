"use client";

import { createContext, useContext, ReactNode } from "react";
import { useTheme, ThemeMode } from "@/hooks/useTheme";

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
