import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { JobPostingStatus } from "@/types/types"

const DUMMY_POSTINGS = [
    { id: "1", title: "Senior Frontend Engineer", organizationName: "Acme Corp", status: "Open" as JobPostingStatus },
    { id: "2", title: "Backend Engineer", organizationName: "Acme Corp", status: "Open" as JobPostingStatus },
    { id: "3", title: "DevOps Engineer", organizationName: "Acme Corp", status: "Darft" as JobPostingStatus },
    { id: "4", title: "QA Engineer", organizationName: "Acme Corp", status: "Closed" as JobPostingStatus },
]

const statusStyles: Record<JobPostingStatus, string> = {
    Open: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    Darft: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Closed: "bg-stone-500/15 text-stone-400 border-stone-500/30",
}

const statusLabel: Record<JobPostingStatus, string> = {
    Open: "Open",
    Darft: "Draft",
    Closed: "Closed",
}

export default function JobPostingsCard() {
    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-base font-semibold text-white">Job Postings</h2>
                    <p className="mt-1 text-sm text-stone-400">Your active and draft positions</p>
                </div>
                <Button
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-4 text-xs font-medium shadow-md shadow-teal-500/20 transition-all"
                >
                    + New posting
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                {DUMMY_POSTINGS.map((posting) => (
                    <div
                        key={posting.id}
                        className="flex items-center justify-between bg-white/[0.03] rounded-xl border border-white/[0.06] px-4 py-3"
                    >
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-white font-medium">{posting.title}</span>
                            <span className="text-xs text-stone-500">{posting.organizationName}</span>
                        </div>
                        <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[posting.status]}`}
                        >
                            {statusLabel[posting.status]}
                        </span>
                    </div>
                ))}
            </div>
            <Link
                to="/recruiter/postings"
                className="flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors mt-auto"
            >
                View all postings
                <span className="text-base leading-none">→</span>
            </Link>
        </div>
    )
}
