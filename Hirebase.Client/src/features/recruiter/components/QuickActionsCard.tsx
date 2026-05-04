import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const shortcuts = [
    { label: "View all candidates", to: "/recruiter/candidates", description: "Browse and filter applicants" },
    { label: "Open Kanban board", to: "/recruiter/kanban", description: "Manage pipeline stages" },
    { label: "View all postings", to: "/recruiter/postings", description: "All job listings" },
]

export default function QuickActionsCard() {
    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-white">Quick Actions</h2>
                <p className="mt-1 text-sm text-stone-400">Jump straight to where you need to be</p>
            </div>
            <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-full py-4 text-sm font-medium shadow-lg shadow-teal-500/20 transition-all">
                + Create job posting
            </Button>
            <div className="flex flex-col gap-2">
                {shortcuts.map(({ label, to, description }) => (
                    <Link
                        key={to}
                        to={to}
                        className="flex items-center justify-between bg-white/[0.03] rounded-xl border border-white/[0.06] px-4 py-3 group hover:bg-white/[0.06] transition-colors"
                    >
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-white font-medium">{label}</span>
                            <span className="text-xs text-stone-500">{description}</span>
                        </div>
                        <span className="text-stone-500 group-hover:text-teal-400 transition-colors text-base leading-none">→</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
