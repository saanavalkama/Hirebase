import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useDeleteJobPosting, useRecruitersPostings } from "../hooks/jobPostingHooks"
import type { JobPostingResponse, JobPostingStatus } from "@/types/types"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const statusStyles: Record<JobPostingStatus, string> = {
    Open: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    Draft: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Closed: "bg-stone-500/15 text-stone-400 border-stone-500/30",
}

function salaryRange(posting: JobPostingResponse) {
    const { salaryMin, salaryMax } = posting
    if (salaryMin && salaryMax) return `€${salaryMin.toLocaleString()} – €${salaryMax.toLocaleString()}`
    if (salaryMin) return `From €${salaryMin.toLocaleString()}`
    if (salaryMax) return `Up to €${salaryMax.toLocaleString()}`
    return null
}

export default function JobPostingsList() {
    const { data: postings, isPending, isError } = useRecruitersPostings()
    const { mutate: deletePosting, isPending: isDeleting } = useDeleteJobPosting()

    return (
        <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#18181f]/80 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="text-xl font-semibold tracking-tight">
                        <span className="text-teal-400">Hire</span>base
                    </a>
                    <Button asChild variant="ghost" className="text-stone-400 hover:text-stone-100 hover:bg-white/[0.06]">
                        <Link to="/app/recruiter">Back</Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 relative">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(20,184,166,0.08),transparent)]" />

                <div className="flex items-start justify-between mb-8">
                    <div>
                        <span className="inline-flex items-center gap-2 bg-teal-950/60 text-teal-400 text-xs font-medium px-4 py-1.5 rounded-full border border-teal-800/50 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            Postings
                        </span>
                        <h1 className="text-2xl font-semibold text-white">Job postings</h1>
                        <p className="mt-1 text-sm text-stone-500">
                            {postings ? `${postings.length} total` : "All your open, draft and closed positions"}
                        </p>
                    </div>
                    <Button asChild className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-5 text-sm font-medium shadow-md shadow-teal-500/20">
                        <Link to="/app/recruiter/jobPosting">+ New posting</Link>
                    </Button>
                </div>

                {isPending ? (
                    <div className="flex items-center justify-center py-20 text-sm text-stone-500">Loading…</div>
                ) : isError ? (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                        Failed to load postings.
                    </div>
                ) : postings?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-500">
                        <p className="text-sm">No postings yet.</p>
                        <Button asChild variant="outline" size="sm">
                            <Link to="/app/recruiter/jobPosting">Create your first posting</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {postings?.map((posting) => {
                            const salary = salaryRange(posting)
                            const pills = [
                                posting.seniorityLevel,
                                posting.remotePrefrence,
                                posting.location,
                                salary,
                            ].filter(Boolean)

                            return (
                                <div
                                    key={posting.id}
                                    className="bg-white/[0.04] rounded-2xl border border-white/[0.07] px-6 py-5 flex items-center justify-between gap-6"
                                >
                                    <div className="flex flex-col gap-2 min-w-0">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="text-base font-semibold text-white truncate">{posting.title}</span>
                                            <span
                                                className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusStyles[posting.status as JobPostingStatus] ?? ""}`}
                                            >
                                                {posting.status}
                                            </span>
                                        </div>
                                        <span className="text-sm text-stone-400">{posting.organizationName}</span>
                                        {pills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-0.5">
                                                {pills.map((pill) => (
                                                    <span
                                                        key={pill}
                                                        className="text-xs text-stone-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full"
                                                    >
                                                        {pill}
                                                    </span>
                                                ))}
                                                {posting.lastApplicationDay && (
                                                    <span className="text-xs text-stone-500 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                                                        Closes {new Date(posting.lastApplicationDay).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="border-white/[0.1] text-stone-300 hover:bg-white/[0.06] hover:text-white"
                                        >
                                            <Link to={`/app/recruiter/jobPosting?jobPostingId=${posting.id}`}>
                                                Edit
                                            </Link>
                                        </Button>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                                >
                                                    Delete
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent showCloseButton={false}>
                                                <DialogHeader>
                                                    <DialogTitle>Delete posting?</DialogTitle>
                                                    <DialogDescription>
                                                        <strong className="text-stone-200">{posting.title}</strong> will be permanently removed. This cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button
                                                            disabled={isDeleting}
                                                            className="bg-red-600 hover:bg-red-500 text-white"
                                                            onClick={() => deletePosting(posting.id)}
                                                        >
                                                            {isDeleting ? "Deleting…" : "Delete"}
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>

            <footer className="border-t border-white/[0.06] py-8 px-6">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
                    <span><span className="text-teal-400 font-medium">Hire</span>base</span>
                    <span>© {new Date().getFullYear()} Hirebase. All rights reserved.</span>
                </div>
            </footer>
        </div>
    )
}
