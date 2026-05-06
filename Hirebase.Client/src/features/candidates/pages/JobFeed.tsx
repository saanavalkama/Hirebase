import { useGetFeed } from "@/features/jobPosting/hooks/jobPostingHooks"
import { useState } from "react"
import { Link } from "react-router-dom"
import type { JobPostingResponse } from "@/types/types"

function JobCard({ job }: { job: JobPostingResponse }) {
    return (
        <Link to={`/app/candidate/feed/${job.id}`} className="block h-full">
            <div className="bg-[#1e1e28] border border-stone-800 rounded-xl p-5 h-full flex flex-col gap-3 hover:border-teal-500/40 hover:bg-[#21212d] transition-colors">
                <div>
                    <h3 className="text-white font-semibold text-sm leading-snug">{job.title}</h3>
                    <p className="text-teal-400 text-xs mt-1">{job.organizationName}</p>
                    {job.preferredRole && (
                        <p className="text-stone-400 text-xs mt-0.5">{job.preferredRole.replace(/([A-Z])/g, ' $1').trim()}</p>
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
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-white">Job Feed</h1>
                    <p className="mt-1 text-sm text-stone-500">{feed?.totalCount} open positions</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {feed?.items.map(job => (
                        <JobCard key={job.id} job={job} />
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
