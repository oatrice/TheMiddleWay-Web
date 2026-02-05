export default function CoursesPage() {
    return (
        <div className="container-mobile py-8">
            <header className="mb-8">
                <h1 className="text-3xl mb-2">Courses</h1>
                <p className="text-slate/70">
                    Continue your learning journey
                </p>
            </header>

            <section className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="bg-sand rounded-card p-5"
                    >
                        <div className="flex items-start gap-4 mb-3">
                            <div className="w-12 h-12 rounded-lg bg-sage/20 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">Course {item}</h3>
                                <p className="text-sm text-slate/60">8 lessons</p>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-ivory rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sage rounded-full"
                                style={{ width: `${(item * 25)}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate/50 mt-2">
                            {item * 25}% complete
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
}
