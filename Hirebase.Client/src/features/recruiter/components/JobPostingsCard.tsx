import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { JobPostingStatus } from "@/types/types"
import { useRecruitersPostings } from "../hooks/jobPostingHooks"

const statusStyles: Record<JobPostingStatus, string> = {
    Open: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    Draft: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Closed: "bg-stone-500/15 text-stone-400 border-stone-500/30",
}

export default function JobPostingsCard() {
    const { data: postings, isPending, isError } = useRecruitersPostings()

    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-base font-semibold text-white">Job Postings</h2>
                    <p className="mt-1 text-sm text-stone-400">Your active and draft positions</p>
                </div>
                <Button
                    size="sm"
                    asChild
                    className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-4 text-xs font-medium shadow-md shadow-teal-500/20 transition-all"
                >
                    <Link to="/app/recruiter/jobPosting">+ New posting</Link>
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                {isPending ? (
                    <p className="text-sm text-stone-500 py-4 text-center">Loading…</p>
                ) : isError ? (
                    <p className="text-sm text-red-400 py-4 text-center">Failed to load postings.</p>
                ) : postings?.length === 0 ? (
                    <p className="text-sm text-stone-500 py-4 text-center">No postings yet.</p>
                ) : (
                    postings?.map((posting) => (
                        <Link
                            key={posting.id}
                            to={`/app/recruiter/jobPosting?jobPostingId=${posting.id}`}
                            className="flex items-center justify-between bg-white/[0.03] rounded-xl border border-white/[0.06] px-4 py-3 hover:bg-white/[0.06] transition-colors"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm text-white font-medium">{posting.title}</span>
                                <span className="text-xs text-stone-500">{posting.organizationName}</span>
                            </div>
                            <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[posting.status as JobPostingStatus] ?? ""}`}
                            >
                                {posting.status}
                            </span>
                        </Link>
                    ))
                )}
            </div>

            <Link
                to="/app/recruiter/jobPostings"
                className="flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors mt-auto"
            >
                View all postings
                <span className="text-base leading-none">→</span>
            </Link>
        </div>
    )
}
