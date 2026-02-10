"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container-mobile py-8 pb-32"
    >
      {/* Header */}
      <motion.header variants={item} className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
            The Middle Way
          </h1>
          <p className="text-text-secondary text-lg">
            Find balance in your journey
          </p>
        </div>
        <ThemeToggle />
      </motion.header>

      {/* Welcome Card */}
      <motion.section variants={item} className="bg-surface/50 border border-border/30 backdrop-blur-sm rounded-card p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />

        <h2 className="text-2xl font-semibold mb-3 text-text-primary relative z-10">Welcome Back</h2>
        <p className="text-text-secondary leading-relaxed relative z-10">
          Continue your path to mindfulness and inner peace.
          Your journey awaits.
        </p>
      </motion.section>

      {/* Quick Actions */}
      <motion.section variants={item} className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-surface/50 border border-border/30 hover:border-primary/30 transition-colors rounded-card p-5 text-center group cursor-pointer">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-background border border-border/30 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-300">
            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">📚</span>
          </div>
          <h3 className="font-medium mb-1 text-text-primary">Library</h3>
          <p className="text-xs text-text-secondary">12 resources</p>
        </div>

        <div className="bg-surface/50 border border-border/30 hover:border-primary/30 transition-colors rounded-card p-5 text-center group cursor-pointer">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-background border border-border/30 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-300">
            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🎓</span>
          </div>
          <h3 className="font-medium mb-1 text-text-primary">Courses</h3>
          <p className="text-xs text-text-secondary">3 in progress</p>
        </div>
      </motion.section>

      {/* Recent Activity */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Recent Activity</h2>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">View all</button>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface/30 border border-border/30 rounded-card p-4 flex items-center gap-4 hover:bg-surface/50 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                ✨
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-text-primary">Daily Meditation {i}</p>
                <p className="text-sm text-text-secondary">Just now</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
