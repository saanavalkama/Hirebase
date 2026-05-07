import { formatDistanceToNow } from "date-fns"
import { Link } from "react-router-dom"
import { getMyApplications } from "@/features/application/hooks/useApplicationHooks"
import type { ApplyResponse } from "@/types/types"
import DashboardHeader from "../components/DashboardHeader"
import { useCandidateProfile } from "../hooks/useCandidateQuery"
import { Button } from "@/components/ui/button"

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired"] as const

function stageIndex(stage: string): number {
    const map: Record<string, number> = {
        Applied: 0,
        Screening: 1,
        Interview: 2,
        Offer: 3,
        Hired: 4,
    }
    return map[stage] ?? 0
}

function StageStepper({ stage }: { stage: string }) {
    const isRejected = stage === "Rejected"
    const active = isRejected ? -1 : stageIndex(stage)

    return (
        <div className="flex items-start">
            {STAGES.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                        <div
                            className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                                i <= active
                                    ? "bg-teal-400 border-teal-400"
                                    : "bg-transparent border-stone-700"
                            }`}
                        />
                        <span
                            className={`text-[10px] font-medium whitespace-nowrap ${
                                i <= active ? "text-teal-400" : "text-stone-600"
                            }`}
                        >
                            {s}
                        </span>
                    </div>
                    {i < STAGES.length - 1 && (
                        <div
                            className={`h-px flex-1 mx-1 mb-4 ${
                                i < active ? "bg-teal-400" : "bg-stone-700"
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

function ApplicationCard({ app }: { app: ApplyResponse }) {
    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-stone-500">{app.organizationName}</p>
                    <h2 className="text-base font-semibold text-white mt-0.5">{app.jobTitle}</h2>
                    <p className="text-xs text-stone-500 mt-1">
                        {[app.seniorityLevel, app.remotePreference].filter(Boolean).join(" · ")}
                    </p>
                    <p className="text-xs text-stone-600 mt-0.5">
                        Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                    </p>
                </div>
                {app.stage === "Rejected" && (
                    <span className="text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-3 py-1">
                        Rejected
                    </span>
                )}
            </div>

            <StageStepper stage={app.stage} />

            <div className="flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-stone-500 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.07] rounded-full text-xs"
                >
                    Withdraw
                </Button>
            </div>
        </div>
    )
}

export default function Applications() {
    const { data: profile } = useCandidateProfile()
    const { data: applications, isLoading } = getMyApplications()

    return (
        <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">
            <DashboardHeader name={profile?.name ?? ""} />

            <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
                <Link to="/app/candidate/dashboard" className="text-sm text-stone-500 hover:text-teal-400 transition-colors inline-block mb-6">
                    ← Back to dashboard
                </Link>

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-white">
                        My Applications
                        {applications && (
                            <span className="ml-2 text-lg font-normal text-stone-400">
                                ({applications.length})
                            </span>
                        )}
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">Track the status of your job applications</p>
                </div>

                {isLoading && (
                    <p className="text-sm text-stone-500">Loading...</p>
                )}

                {!isLoading && applications?.length === 0 && (
                    <p className="text-sm text-stone-500">You haven't applied to any jobs yet.</p>
                )}

                <div className="flex flex-col gap-4">
                    {applications?.map((app) => (
                        <ApplicationCard key={app.id} app={app} />
                    ))}
                </div>
            </main>
        </div>
    )
}
