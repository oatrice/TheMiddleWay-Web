import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="container-mobile py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl mb-2">
          The Middle Way
        </h1>
        <p className="text-slate/70">
          Find balance in your journey
        </p>
      </header>

      {/* Welcome Card */}
      <section className="bg-sand rounded-card p-6 mb-6">
        <h2 className="text-xl mb-3">Welcome Back</h2>
        <p className="text-slate/80 leading-relaxed">
          Continue your path to mindfulness and inner peace.
          Your journey awaits.
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-sand rounded-card p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage/20 flex items-center justify-center">
            <span className="text-sage text-xl">📚</span>
          </div>
          <h3 className="font-medium mb-1">Library</h3>
          <p className="text-sm text-slate/60">12 resources</p>
        </div>

        <div className="bg-sand rounded-card p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage/20 flex items-center justify-center">
            <span className="text-sage text-xl">🎓</span>
          </div>
          <h3 className="font-medium mb-1">Courses</h3>
          <p className="text-sm text-slate/60">3 in progress</p>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-8">
        <h2 className="text-xl mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-sand rounded-card p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-sage/20 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Activity Item {item}</p>
                <p className="text-sm text-slate/60">Just now</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
