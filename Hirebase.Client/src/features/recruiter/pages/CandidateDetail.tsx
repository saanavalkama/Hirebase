import { useLocation, useParams, Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import {
    Zap,
    Star,
    GitPullRequest,
    PackageOpen,
    MapPin,
    Briefcase,
    Calendar,
    ExternalLink,
    FileText,
    Link2,
    Globe,
} from "lucide-react"
import type { RecruiterApplicationResponse } from "@/types/types"

const STAGE_STYLES: Record<string, string> = {
    Applied:    "bg-stone-500/15 text-stone-400 border-stone-500/30",
    Screening:  "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Interview:  "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Offer:      "bg-teal-500/15 text-teal-400 border-teal-500/30",
}

function formatRole(role: string) {
    return role.replace(/([A-Z])/g, " $1").trim()
}

export default function CandidateDetail() {
    const { jobPostingId } = useParams()
    const { state } = useLocation()
    const application = state?.application as RecruiterApplicationResponse | undefined

    if (!application) return (
        <div className="min-h-screen bg-[#18181f] flex flex-col items-center justify-center gap-3">
            <p className="text-stone-500 text-sm">Candidate data unavailable.</p>
            <Link
                to={`/app/recruiter/${jobPostingId}/pipeline`}
                className="text-sm text-teal-400 hover:underline"
            >
                ← Back to pipeline
            </Link>
        </div>
    )

    return (
        <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#18181f]/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-semibold tracking-tight">
                        <span className="text-teal-400">Hire</span>base
                    </Link>
                    <Link
                        to={`/app/recruiter/${jobPostingId}/pipeline`}
                        className="text-sm text-stone-500 hover:text-teal-400 transition-colors"
                    >
                        ← Back to pipeline
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-6">

                {/* Hero */}
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-8">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                {application.candidateName || "Unknown candidate"}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-stone-400">
                                {application.location && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={13} className="text-stone-600" />
                                        {application.location}
                                    </span>
                                )}
                                {application.seniorityLevel && (
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase size={13} className="text-stone-600" />
                                        {application.seniorityLevel}
                                    </span>
                                )}
                                {application.yearsOfExperience != null && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={13} className="text-stone-600" />
                                        {application.yearsOfExperience} yr{application.yearsOfExperience !== 1 ? "s" : ""} exp.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${STAGE_STYLES[application.stage] ?? STAGE_STYLES["Applied"]}`}>
                                {application.stage}
                            </span>
                            <p className="text-xs text-stone-600">
                                Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    {(application.cvUrl || application.linkedInUrl || application.personalSiteUrl) && (
                        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/[0.05]">
                            {application.cvUrl && (
                                <ExternalLinkPill href={application.cvUrl} icon={<FileText size={13} />} label="CV" />
                            )}
                            {application.linkedInUrl && (
                                <ExternalLinkPill href={application.linkedInUrl} icon={<Link2 size={13} />} label="LinkedIn" />
                            )}
                            {application.personalSiteUrl && (
                                <ExternalLinkPill href={application.personalSiteUrl} icon={<Globe size={13} />} label="Website" />
                            )}
                        </div>
                    )}
                </div>

                {/* Bio */}
                {application.bio && (
                    <Section title="About">
                        <p className="text-sm text-stone-300 leading-relaxed">{application.bio}</p>
                    </Section>
                )}

                {/* GitHub signals */}
                <Section title="GitHub Signals">
                    {application.hasConnected ? (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <ScoreCard icon={<Zap size={16} />} label="Activity" value={application.activityScore} />
                                <ScoreCard icon={<Star size={16} />} label="Popularity" value={application.popularityScore} />
                                <ScoreCard icon={<PackageOpen size={16} />} label="Repo Maturity" value={application.repoMaturityScore} />
                                <ScoreCard icon={<GitPullRequest size={16} />} label="Ext. PRs" value={application.externalPrCount} />
                            </div>

                            {application.topLanguages.length > 0 && (
                                <div>
                                    <p className="text-xs text-stone-500 mb-2">Top languages</p>
                                    <div className="flex flex-wrap gap-2">
                                        {application.topLanguages.map(lang => (
                                            <span key={lang} className="text-xs px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-stone-600">No GitHub account connected.</p>
                    )}
                </Section>

                {/* Skills & roles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {application.softSkills.length > 0 && (
                        <Section title="Soft Skills">
                            <div className="flex flex-wrap gap-2">
                                {application.softSkills.map(skill => (
                                    <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-stone-300">
                                        {skill.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    )}

                    {application.preferredRoles.length > 0 && (
                        <Section title="Preferred Roles">
                            <div className="flex flex-wrap gap-2">
                                {application.preferredRoles.map(role => (
                                    <span key={role} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-stone-300">
                                        {formatRole(role)}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>
            </main>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500">{title}</h2>
            {children}
        </div>
    )
}

function ScoreCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-2">
            <div className="text-teal-400">{icon}</div>
            <p className="text-xl font-semibold text-white">{value}</p>
            <p className="text-xs text-stone-500">{label}</p>
        </div>
    )
}

function ExternalLinkPill({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-stone-300 hover:text-teal-400 hover:border-teal-500/40 bg-white/[0.03] transition-colors"
        >
            {icon}
            {label}
            <ExternalLink size={10} className="ml-0.5 opacity-50" />
        </a>
    )
}
