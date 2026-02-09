"use client";

import { motion } from "framer-motion";

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
      <motion.header variants={item} className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-ivory to-slate-light bg-clip-text text-transparent">
          The Middle Way
        </h1>
        <p className="text-slate-light text-lg">
          Find balance in your journey
        </p>
      </motion.header>

      {/* Welcome Card */}
      <motion.section variants={item} className="bg-slate-dark/50 border border-ivory/5 backdrop-blur-sm rounded-card p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber/10 rounded-full blur-3xl -mr-16 -mt-16" />

        <h2 className="text-2xl font-semibold mb-3 text-ivory relative z-10">Welcome Back</h2>
        <p className="text-slate-light leading-relaxed relative z-10">
          Continue your path to mindfulness and inner peace.
          Your journey awaits.
        </p>
      </motion.section>

      {/* Quick Actions */}
      <motion.section variants={item} className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-slate-dark/50 border border-ivory/5 hover:border-amber/30 transition-colors rounded-card p-5 text-center group cursor-pointer">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-navy border border-ivory/10 flex items-center justify-center group-hover:bg-amber/10 group-hover:border-amber/50 transition-all duration-300">
            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">📚</span>
          </div>
          <h3 className="font-medium mb-1 text-ivory">Library</h3>
          <p className="text-xs text-slate-light">12 resources</p>
        </div>

        <div className="bg-slate-dark/50 border border-ivory/5 hover:border-amber/30 transition-colors rounded-card p-5 text-center group cursor-pointer">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-navy border border-ivory/10 flex items-center justify-center group-hover:bg-amber/10 group-hover:border-amber/50 transition-all duration-300">
            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🎓</span>
          </div>
          <h3 className="font-medium mb-1 text-ivory">Courses</h3>
          <p className="text-xs text-slate-light">3 in progress</p>
        </div>
      </motion.section>

      {/* Recent Activity */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-ivory">Recent Activity</h2>
          <button className="text-sm text-amber hover:text-amber/80 transition-colors">View all</button>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-dark/30 border border-ivory/5 rounded-card p-4 flex items-center gap-4 hover:bg-slate-dark/50 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0 text-amber">
                ✨
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-ivory">Daily Meditation {i}</p>
                <p className="text-sm text-slate-light">Just now</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-amber" />
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
