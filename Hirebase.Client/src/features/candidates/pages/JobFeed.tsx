import { useGetFeed } from "@/features/jobPosting/hooks/jobPostingHooks"
import { useGetAllJobIds } from "@/features/application/hooks/useApplicationHooks"
import { useState } from "react"
import { Link } from "react-router-dom"
import type { JobPostingResponse, PotentialMatchResponse } from "@/types/types"
import { useMyMatches } from "@/features/matching/hooks/usePotentialMatchHooks"

const TIER_CONFIG: Record<PotentialMatchResponse["tier"], { label: string; className: string }> = {
    Partial:   { label: "Partial Match", className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
    GoodFit:   { label: "Good Match",    className: "bg-teal-500/10 text-teal-400 border border-teal-500/20" },
    StrongFit: { label: "Great Match",   className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
}

function MatchBadge({ tier }: { tier: PotentialMatchResponse["tier"] }) {
    const { label, className } = TIER_CONFIG[tier]
    return (
        <span className={`self-start text-[10px] font-medium px-2 py-0.5 rounded-full ${className}`}>
            {label}
        </span>
    )
}

function JobCard({ job, applied, tier }: { job: JobPostingResponse; applied: boolean; tier?: PotentialMatchResponse["tier"] }) {
    return (
        <Link to={`/app/candidate/feed/${job.id}`} className="block h-full">
            <div className={`rounded-xl p-5 h-full flex flex-col gap-3 transition-colors ${
                applied
                    ? "bg-emerald-950/40 border border-emerald-700/50 hover:border-emerald-500/70 hover:bg-emerald-950/60"
                    : tier
                    ? "bg-[#1e1e28] border border-teal-700/40 hover:border-teal-600/60 hover:bg-[#21212d]"
                    : "bg-[#1e1e28] border border-stone-700/60 hover:border-stone-600 hover:bg-[#21212d]"
            }`}>
                <div className="flex flex-col gap-1.5">
                    {tier && <MatchBadge tier={tier} />}
                    <h3 className="text-white font-semibold text-sm leading-snug">{job.title}</h3>
                    <p className="text-teal-400 text-xs">{job.organizationName}</p>
                    {job.preferredRole && (
                        <p className="text-stone-400 text-xs">{job.preferredRole.replace(/([A-Z])/g, ' $1').trim()}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {job.seniorityLevel && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">{job.seniorityLevel}</span>
                    )}
                    {job.remotePrefrence && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">{job.remotePrefrence}</span>
                    )}
                    {job.location && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">{job.location}</span>
                    )}
                </div>

                {(job.salaryMin || job.salaryMax) && (
                    <p className="text-stone-400 text-xs">
                        {job.salaryMin && job.salaryMax
                            ? `€${job.salaryMin.toLocaleString()} – €${job.salaryMax.toLocaleString()}`
                            : job.salaryMin
                            ? `From €${job.salaryMin.toLocaleString()}`
                            : `Up to €${job.salaryMax!.toLocaleString()}`}
                    </p>
                )}

                {job.requiredLanguages.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto pt-1">
                        {job.requiredLanguages.slice(0, 4).map(lang => (
                            <span key={lang} className="text-xs px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">{lang}</span>
                        ))}
                        {job.requiredLanguages.length > 4 && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-stone-800 text-stone-500">+{job.requiredLanguages.length - 4}</span>
                        )}
                    </div>
                )}

                {job.lastApplicationDay && (
                    <p className="text-stone-500 text-xs">
                        Apply by {new Date(job.lastApplicationDay).toLocaleDateString()}
                    </p>
                )}
            </div>
        </Link>
    )
}

export default function JobFeed() {
    const [page, setPage] = useState(1)
    const { data: feed, isPending, isError } = useGetFeed({ page, pageSize: 12 })
    const { data: matches } = useMyMatches()
    const { data: appliedIds } = useGetAllJobIds()

    const matchMap = new Map(matches?.map(m => [m.jobPostingId, m.tier]))


    if (isPending) return (
        <div className="min-h-screen bg-[#18181f] flex items-center justify-center">
            <p className="text-stone-500">Loading...</p>
        </div>
    )

    if (isError) return (
        <div className="min-h-screen bg-[#18181f] flex items-center justify-center">
            <p className="text-stone-500">Failed to load jobs.</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#18181f] text-stone-200">
            <main className="max-w-7xl mx-auto px-6 py-10">
                <Link to="/app/candidate/dashboard" className="text-sm text-stone-500 hover:text-teal-400 transition-colors inline-block mb-6">
                    ← Back to dashboard
                </Link>

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-white">Job Feed</h1>
                    <p className="mt-1 text-sm text-stone-500">{feed?.totalCount} open positions</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {feed?.items.map(job => (
                        <JobCard key={job.id} job={job} applied={appliedIds?.includes(job.id) ?? false} tier={matchMap.get(job.id)} />
                    ))}
                </div>

                {feed && feed.totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-3">
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={!feed.hasPreviousPage}
                            className="px-4 py-1.5 text-sm rounded-lg border border-stone-700 text-stone-300 hover:border-teal-500/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-stone-500">
                            {feed.page} / {feed.totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!feed.hasNextPage}
                            className="px-4 py-1.5 text-sm rounded-lg border border-stone-700 text-stone-300 hover:border-teal-500/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
