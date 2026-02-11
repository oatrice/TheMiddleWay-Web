"use client";

import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark";

const DEFAULT_THEME: ThemeMode = "light";

export function useTheme() {
    const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeState(mode);
    }, []);

    return {
        theme,
        isDark: theme === "dark",
        isLight: theme === "light",
        toggleTheme,
        setTheme,
    };
}
