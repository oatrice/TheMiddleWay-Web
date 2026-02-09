"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, BookOpen, GraduationCap, User } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/courses", label: "Courses", icon: GraduationCap },
    { href: "/profile", label: "Profile", icon: User },
];

export function MobileNavigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-xl border-t border-ivory/5">
            <div className="flex items-center justify-around h-16 px-4 pb-[env(safe-area-inset-bottom)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center w-16 h-full"
                        >
                            <motion.div
                                className="flex flex-col items-center gap-1"
                                whileTap={{ scale: 0.95 }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -top-1 w-8 h-1 rounded-full bg-amber shadow-[0_0_10px_var(--color-amber)]"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <Icon
                                    className={`w-6 h-6 transition-colors duration-200 ${isActive ? "text-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-slate-light/60 hover:text-ivory"
                                        }`}
                                />
                                <span
                                    className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? "text-amber" : "text-slate-light/60 group-hover:text-ivory"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
