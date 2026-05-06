import { useParams, Link } from "react-router-dom"
import { useJobPostingById } from "@/features/jobPosting/hooks/jobPostingHooks"

function Badge({ label }: { label: string }) {
    return (
        <span className="text-xs px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
            {label}
        </span>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">{title}</h2>
            {children}
        </div>
    )
}

export default function JobPostingDetail() {
    const { id } = useParams<{ id: string }>()
    const { data: job, isPending } = useJobPostingById(id ?? "")

    if (isPending) return (
        <div className="min-h-screen bg-[#18181f] flex items-center justify-center">
            <p className="text-stone-500">Loading...</p>
        </div>
    )

    if (!job) return (
        <div className="min-h-screen bg-[#18181f] flex items-center justify-center">
            <p className="text-stone-500">Job not found.</p>
        </div>
    )

    const salary = job.salaryMin && job.salaryMax
        ? `€${job.salaryMin.toLocaleString()} – €${job.salaryMax.toLocaleString()}`
        : job.salaryMin
        ? `From €${job.salaryMin.toLocaleString()}`
        : job.salaryMax
        ? `Up to €${job.salaryMax.toLocaleString()}`
        : null

    return (
        <div className="min-h-screen bg-[#18181f] text-stone-200">
            <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">

                <Link to="/app/candidate/feed" className="text-sm text-stone-500 hover:text-teal-400 transition-colors w-fit">
                    ← Back to feed
                </Link>

                {/* Header */}
                <div className="border-b border-stone-800 pb-6">
                    <p className="text-teal-400 text-sm mb-1">{job.organizationName}</p>
                    <h1 className="text-2xl font-semibold text-white">{job.title}</h1>
                    {job.preferredRole && (
                        <p className="text-stone-400 text-sm mt-1">
                            {job.preferredRole.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                        {job.seniorityLevel && <Badge label={job.seniorityLevel} />}
                        {job.remotePrefrence && <Badge label={job.remotePrefrence} />}
                        {job.location && <Badge label={job.location} />}
                        {salary && <Badge label={salary} />}
                    </div>
                </div>

                {/* Description */}
                <Section title="About the role">
                    <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
                </Section>

                {/* Required languages */}
                {job.requiredLanguages.length > 0 && (
                    <Section title="Tech stack">
                        <div className="flex flex-wrap gap-2">
                            {job.requiredLanguages.map(lang => (
                                <span key={lang} className="text-xs px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Soft skills */}
                {job.jobPostingSoftSkills.length > 0 && (
                    <Section title="Soft skills">
                        <div className="flex flex-wrap gap-2">
                            {job.jobPostingSoftSkills.map(skill => (
                                <Badge key={skill} label={skill.replace(/([A-Z])/g, ' $1').trim()} />
                            ))}
                        </div>
                    </Section>
                )}

                {/* Footer meta */}
                <div className="flex flex-col gap-1 text-xs text-stone-500 border-t border-stone-800 pt-4">
                    {job.lastApplicationDay && (
                        <p>Apply by <span className="text-stone-400">{new Date(job.lastApplicationDay).toLocaleDateString()}</span></p>
                    )}
                    <p>Posted <span className="text-stone-400">{new Date(job.createdAt).toLocaleDateString()}</span></p>
                </div>

                {/* Apply button */}
                <button
                    onClick={() => {}}
                    className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#18181f] font-semibold text-sm transition-colors"
                >
                    Apply
                </button>

            </main>
        </div>
    )
}
