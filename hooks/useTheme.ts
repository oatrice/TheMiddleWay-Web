"use client";

import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark";

const DEFAULT_THEME: ThemeMode = "light";

export function useTheme() {
    const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
    const [mounted, setMounted] = useState(false);

    // Set mounted state
    useEffect(() => {
        setMounted(true);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme, mounted]);

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
        mounted,
    };
}
