# PR Draft Prompt

You are an AI assistant helping to create a Pull Request description.
    
TASK: [Design] Design System Implementation: Colors (#0A192F, #F59E0B) and Typography
ISSUE: {
  "title": "[Design] Design System Implementation: Colors (#0A192F, #F59E0B) and Typography",
  "number": 4
}

GIT CONTEXT:
COMMITS:
7d4c87f feat: implement dual-theme system with light and dark modes
e440588 docs: add Luma code review report with theme test suggestions
8eb3b62 feat(theme): set light mode as default theme
3d84f2b feat(theme): redesign light theme to Bright Sky blue palette
1305da8 feat(theme): implement dual theme system with light and dark modes
fbae0d2 ✨ feat(theme): Apply "Deep Cosmos" theme

STATS:
CHANGELOG.md                           |  13 +++
 README.md                              |  13 +--
 app/globals.css                        | 164 +++++++++++++++++++++++----------
 app/layout.tsx                         |  21 +++--
 app/page.tsx                           | 105 ++++++++++++++-------
 code_review.md                         |  15 +++
 components/ThemeProvider.tsx           |  33 +++++++
 components/ThemeToggle.tsx             |  40 ++++++++
 components/layout/MobileNavigation.tsx |   9 +-
 hooks/useTheme.ts                      |  46 +++++++++
 package.json                           |   2 +-
 11 files changed, 353 insertions(+), 108 deletions(-)

KEY FILE DIFFS:
diff --git a/app/layout.tsx b/app/layout.tsx
index a0bb821..89d7f5a 100644
--- a/app/layout.tsx
+++ b/app/layout.tsx
@@ -1,10 +1,11 @@
 import type { Metadata, Viewport } from "next";
-import { Playfair_Display, Inter } from "next/font/google";
+import { Outfit, Inter } from "next/font/google";
 import "./globals.css";
 import { MobileNavigation } from "@/components/layout/MobileNavigation";
+import { ThemeProvider } from "@/components/ThemeProvider";
 
-const playfair = Playfair_Display({
-  variable: "--font-playfair",
+const outfit = Outfit({
+  variable: "--font-outfit",
   subsets: ["latin"],
   display: "swap",
 });
@@ -33,14 +34,16 @@ export default function RootLayout({
   children: React.ReactNode;
 }>) {
   return (
-    <html lang="en">
+    <html lang="en" data-theme="light" suppressHydrationWarning>
       <body
-        className={`${playfair.variable} ${inter.variable} antialiased bg-ivory text-slate`}
+        className={`${outfit.variable} ${inter.variable} antialiased`}
       >
-        <main className="pb-safe min-h-screen">
-          {children}
-        </main>
-        <MobileNavigation />
+        <ThemeProvider>
+          <main className="pb-safe min-h-screen">
+            {children}
+          </main>
+          <MobileNavigation />
+        </ThemeProvider>
       </body>
     </html>
   );
diff --git a/app/page.tsx b/app/page.tsx
index 9c6987c..91162c1 100644
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -1,64 +1,99 @@
+"use client";
+
 import { motion } from "framer-motion";
+import { ThemeToggle } from "@/components/ThemeToggle";
+
+const container = {
+  hidden: { opacity: 0 },
+  show: {
+    opacity: 1,
+    transition: {
+      staggerChildren: 0.1
+    }
+  }
+};
+
+const item = {
+  hidden: { opacity: 0, y: 20 },
+  show: { opacity: 1, y: 0 }
+};
 
 export default function Home() {
   return (
-    <div className="container-mobile py-8">
+    <motion.div
+      variants={container}
+      initial="hidden"
+      animate="show"
+      className="container-mobile py-8 pb-32"
+    >
       {/* Header */}
-      <header className="mb-8">
-        <h1 className="text-3xl mb-2">
-          The Middle Way
-        </h1>
-        <p className="text-slate/70">
-          Find balance in your journey
-        </p>
-      </header>
+      <motion.header variants={item} className="mb-8 flex items-start justify-between">
+        <div>
+          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
+            The Middle Way
+          </h1>
+          <p className="text-text-secondary text-lg">
+            Find balance in your journey
+          </p>
+        </div>
+        <ThemeToggle />
+      </motion.header>
 
       {/* Welcome Card */}
-      <section className="bg-sand rounded-card p-6 mb-6">
-        <h2 className="text-xl mb-3">Welcome Back</h2>
-        <p className="text-slate/80 leading-relaxed">
+      <motion.section variants={item} className="bg-surface/50 border border-border/30 backdrop-blur-sm rounded-card p-6 mb-8 relative overflow-hidden">
+        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
+
+        <h2 className="text-2xl font-semibold mb-3 text-text-primary relative z-10">Welcome Back</h2>
+        <p className="text-text-secondary leading-relaxed relative z-10">
           Continue your path to mindfulness and inner peace.
           Your journey awaits.
         </p>
-      </section>
+      </motion.section>
 
       {/* Quick Actions */}
-      <section className="grid grid-cols-2 gap-4">
-        <div className="bg-sand rounded-card p-4 text-center">
-          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage/20 flex items-center justify-center">
-            <span className="text-sage text-xl">📚</span>
+      <motion.section variants={item} className="grid grid-cols-2 gap-4 mb-10">
+        <div className="bg-surface/50 border border-border/30 hover:border-primary/30 transition-colors rounded-card p-5 text-center group cursor-pointer">
+          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-background border border-border/30 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-300">
+            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">📚</span>
           </div>
-          <h3 className="font-medium mb-1">Library</h3>
-          <p className="text-sm text-slate/60">12 resources</p>
+          <h3 className="font-medium mb-1 text-text-primary">Library</h3>
+          <p className="text-xs text-text-secondary">12 resources</p>
         </div>
 
-        <div className="bg-sand rounded-card p-4 text-center">
-          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage/20 flex items-center justify-center">
-            <span className="text-sage text-xl">🎓</span>
+        <div className="bg-surface/50 border border-border/30 hover:border-primary/30 transition-colors rounded-card p-5 text-center group cursor-pointer">
+          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-background border border-border/30 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-300">
+            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🎓</span>
           </div>
-          <h3 className="font-medium mb-1">Courses</h3>
-          <p className="text-sm text-slate/60">3 in progress</p>
+          <h3 className="font-medium mb-1 text-text-primary">Courses</h3>
+          <p className="text-xs text-text-secondary">3 in progress</p>
         </div>
-      </section>
+      </motion.section>
 
       {/* Recent Activity */}
-      <section className="mt-8">
-        <h2 className="text-xl mb-4">Recent Activity</h2>
+      <motion.section variants={item}>
+        <div className="flex items-center justify-between mb-4">
+          <h2 className="text-xl font-semibold text-text-primary">Recent Activity</h2>
+          <button className="text-sm text-primary hover:text-primary/80 transition-colors">View all</button>
+        </div>
+
         <div className="space-y-3">
-          {[1, 2, 3].map((item) => (
+          {[1, 2, 3].map((i) => (
             <div
-              key={item}
-              className="bg-sand rounded-card p-4 flex items-center gap-4"
+              key={i}
+              className="bg-surface/30 border border-border/30 rounded-card p-4 flex items-center gap-4 hover:bg-surface/50 transition-colors cursor-pointer"
             >
-              <div className="w-10 h-10 rounded-full bg-sage/20 flex-shrink-0" />
+              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
+                ✨
+              </div>
               <div className="flex-1 min-w-0">
-                <p className="font-medium truncate">Activity Item {item}</p>
-                <p className="text-sm text-slate/60">Just now</p>
+                <p className="font-medium truncate text-text-primary">Daily Meditation {i}</p>
+                <p className="text-sm text-text-secondary">Just now</p>
               </div>
+              <div className="w-2 h-2 rounded-full bg-primary" />
             </div>
           ))}
         </div>
-      </section>
-    </div>
+      </motion.section>
+    </motion.div>
   );
 }
diff --git a/components/ThemeProvider.tsx b/components/ThemeProvider.tsx
new file mode 100644
index 0000000..626fd87
--- /dev/null
+++ b/components/ThemeProvider.tsx
@@ -0,0 +1,33 @@
+"use client";
+
+import { createContext, useContext, ReactNode } from "react";
+import { useTheme, ThemeMode } from "@/hooks/useTheme";
+
+interface ThemeContextType {
+    theme: ThemeMode;
+    isDark: boolean;
+    isLight: boolean;
+    toggleTheme: () => void;
+    setTheme: (mode: ThemeMode) => void;
+    mounted: boolean;
+}
+
+const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
+
+export function ThemeProvider({ children }: { children: ReactNode }) {
+    const themeState = useTheme();
+
+    return (
+        <ThemeContext.Provider value={themeState}>
+            {children}
+        </ThemeContext.Provider>
+    );
+}
+
+export function useThemeContext() {
+    const context = useContext(ThemeContext);
+    if (context === undefined) {
+        throw new Error("useThemeContext must be used within a ThemeProvider");
+    }
+    return context;
+}
diff --git a/components/ThemeToggle.tsx b/components/ThemeToggle.tsx
new file mode 100644
index 0000000..d6f6065
--- /dev/null
+++ b/components/ThemeToggle.tsx
@@ -0,0 +1,40 @@
+"use client";
+
+import { motion } from "framer-motion";
+import { Sun, Moon } from "lucide-react";
+import { useThemeContext } from "@/components/ThemeProvider";
+
+export function ThemeToggle() {
+    const { isDark, toggleTheme, mounted } = useThemeContext();
+
+    // Prevent hydration mismatch
+    if (!mounted) {
+        return (
+            <div className="w-10 h-10 rounded-full bg-surface/50" />
+        );
+    }
+
+    return (
+        <motion.button
+            onClick={toggleTheme}
+            className="relative w-10 h-10 rounded-full bg-surface/50 border border-border/30 flex items-center justify-center hover:bg-surface transition-colors"
+            whileTap={{ scale: 0.9 }}
+            whileHover={{ scale: 1.05 }}
+            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
+        >
+            <motion.div
+                key={isDark ? "moon" : "sun"}
+                initial={{ rotate: -90, opacity: 0 }}
+                animate={{ rotate: 0, opacity: 1 }}
+                exit={{ rotate: 90, opacity: 0 }}
+                transition={{ duration: 0.3, ease: "easeInOut" }}
+            >
+                {isDark ? (
+                    <Sun className="w-5 h-5 text-primary" />
+                ) : (
+                    <Moon className="w-5 h-5 text-primary" />
+                )}
+            </motion.div>
+        </motion.button>
+    );
+}
diff --git a/components/layout/MobileNavigation.tsx b/components/layout/MobileNavigation.tsx
index 4a47c2f..e939828 100644
--- a/components/layout/MobileNavigation.tsx
+++ b/components/layout/MobileNavigation.tsx
@@ -22,7 +22,8 @@ export function MobileNavigation() {
     const pathname = usePathname();
 
     return (
-        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sand/95 backdrop-blur-md border-t border-slate/10">
+        <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t border-border/30"
+            style={{ backgroundColor: "var(--nav-bg)" }}>
             <div className="flex items-center justify-around h-16 px-4 pb-[env(safe-area-inset-bottom)]">
                 {navItems.map((item) => {
                     const isActive = pathname === item.href ||
@@ -42,16 +43,16 @@ export function MobileNavigation() {
                                 {isActive && (
                                     <motion.div
                                         layoutId="activeTab"
-                                        className="absolute -top-1 w-8 h-1 rounded-full bg-sage"
+                                        className="absolute -top-1 w-8 h-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"
                                         transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                     />
                                 )}
                                 <Icon
-                                    className={`w-6 h-6 transition-colors duration-200 ${isActive ? "text-sage" : "text-slate/50"
+                                    className={`w-6 h-6 transition-colors duration-200 ${isActive ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "text-text-secondary/60 hover:text-text-primary"
                                         }`}
                                 />
                                 <span
-                                    className={`text-xs font-medium transition-colors duration-200 ${isActive ? "text-sage" : "text-slate/50"
+                                    className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-text-secondary/60"
                                         }`}
                                 >
                                     {item.label}
diff --git a/hooks/useTheme.ts b/hooks/useTheme.ts
new file mode 100644
index 0000000..892c7ea
--- /dev/null
+++ b/hooks/useTheme.ts
@@ -0,0 +1,46 @@
+"use client";
+
+import { useState, useEffect, useCallback } from "react";
+
+export type ThemeMode = "light" | "dark";
+
+const STORAGE_KEY = "theme-mode";
+const DEFAULT_THEME: ThemeMode = "light";
+
+export function useTheme() {
+    const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
+    const [mounted, setMounted] = useState(false);
+
+    // Read from localStorage on mount
+    useEffect(() => {
+        const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
+        if (stored === "light" || stored === "dark") {
+            setThemeState(stored);
+        }
+        setMounted(true);
+    }, []);
+
+    // Apply theme to document
+    useEffect(() => {
+        if (!mounted) return;
+        document.documentElement.setAttribute("data-theme", theme);
+        localStorage.setItem(STORAGE_KEY, theme);
+    }, [theme, mounted]);
+
+    const toggleTheme = useCallback(() => {
+        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
+    }, []);
+
+    const setTheme = useCallback((mode: ThemeMode) => {
+        setThemeState(mode);
+    }, []);
+
+    return {
+        theme,
+        isDark: theme === "dark",
+        isLight: theme === "light",
+        toggleTheme,
+        setTheme,
+        mounted,
+    };
+}

PR TEMPLATE:


INSTRUCTIONS:
1. Generate a comprehensive PR description in Markdown format.
2. If a template is provided, fill it out intelligently.
3. If no template, use a standard structure: Summary, Changes, Impact.
4. Focus on 'Why' and 'What'.
5. Do not include 'Here is the PR description' preamble. Just the body.
6. IMPORTANT: Always use FULL URLs for links to issues and other PRs (e.g., https://github.com/owner/repo/issues/123), do NOT use short syntax (e.g., #123) to ensuring proper linking across platforms.
