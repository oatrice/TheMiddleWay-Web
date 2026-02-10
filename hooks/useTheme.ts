"use client";

import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "theme-mode";
const DEFAULT_THEME: ThemeMode = "dark";

export function useTheme() {
    const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
    const [mounted, setMounted] = useState(false);

    // Read from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
        if (stored === "light" || stored === "dark") {
            setThemeState(stored);
        }
        setMounted(true);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY, theme);
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
