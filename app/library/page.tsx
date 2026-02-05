export default function LibraryPage() {
    return (
        <div className="container-mobile py-8">
            <header className="mb-8">
                <h1 className="text-3xl mb-2">Library</h1>
                <p className="text-slate/70">
                    Your collection of resources
                </p>
            </header>

            <section className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="bg-sand rounded-card p-4 flex items-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-lg bg-sage/20 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">Resource {item}</h3>
                            <p className="text-sm text-slate/60">Category</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
