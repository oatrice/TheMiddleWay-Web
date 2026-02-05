export default function ProfilePage() {
    return (
        <div className="container-mobile py-8">
            <header className="mb-8 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-sage/20" />
                <h1 className="text-2xl mb-1">Your Profile</h1>
                <p className="text-slate/70">
                    Manage your account
                </p>
            </header>

            <section className="space-y-3">
                {[
                    { label: "Settings", icon: "⚙️" },
                    { label: "Notifications", icon: "🔔" },
                    { label: "Privacy", icon: "🔒" },
                    { label: "Help & Support", icon: "❓" },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="bg-sand rounded-card p-4 flex items-center gap-4"
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium flex-1">{item.label}</span>
                        <span className="text-slate/40">→</span>
                    </div>
                ))}
            </section>
        </div>
    );
}
