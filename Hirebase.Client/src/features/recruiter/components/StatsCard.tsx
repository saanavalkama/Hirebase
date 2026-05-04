const stats = [
    { label: "Active postings", value: "4" },
    { label: "Total applications", value: "31" },
    { label: "New this week", value: "8" },
]

export default function StatsCard() {
    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-white">Stats</h2>
                <p className="mt-1 text-sm text-stone-400">Your recruiting activity at a glance</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2">
                {stats.map(({ label, value }) => (
                    <div key={label} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 flex flex-col gap-1">
                        <span className="text-2xl font-semibold text-white">{value}</span>
                        <span className="text-xs text-stone-500">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
