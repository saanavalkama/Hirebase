import { useState, useEffect, type Dispatch, type SetStateAction } from "react"
import { useParams, Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { Zap, Star, GitPullRequest, PackageOpen, ArrowRight, X } from "lucide-react"
import { useInbox, usePipeline, useUpdateApplicationStage } from "@/features/application/hooks/useApplicationHooks"
import type { ApplicationSatge, InboxFeedResponse, RecruiterApplicationResponse } from "@/types/types"
import {
    DndContext,
    type DragEndEvent,
    DragOverlay,
    type DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    useDraggable,
} from "@dnd-kit/core"

const PIPELINE_STAGES = ["Screening", "Interview", "Offer"] as const
type PipelineStage = (typeof PIPELINE_STAGES)[number]

export default function Pipeline() {
    const { jobPostingId } = useParams()
    const [inboxPage, setInboxPage] = useState(1)

    const { data: inbox, isPending: inboxPending, isError: inboxError } = useInbox({
        jobPostingId: jobPostingId ?? "",
        page: inboxPage,
        pageSize: 20,
    })
    const { data: pipeline, isPending, isError } = usePipeline({ jobPostingId: jobPostingId ?? "" })
    const { mutate: updateStage } = useUpdateApplicationStage({ jobPostingId: jobPostingId ?? "" })

    const [items, setItems] = useState<RecruiterApplicationResponse[]>([])
    const [activeApp, setActiveApp] = useState<RecruiterApplicationResponse | null>(null)

    useEffect(() => {
        if (pipeline) setItems(pipeline)
    }, [pipeline])

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveApp(items.find(a => a.id === active.id) ?? null)
    }

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        setActiveApp(null)
        if (!over) return
        const newStage = over.id as string
        if (!(PIPELINE_STAGES as readonly string[]).includes(newStage)) return
        if (items.find(a => a.id === active.id)?.stage === newStage) return

        setItems(prev => prev.map(a => a.id === active.id ? { ...a, stage: newStage } : a))
        updateStage({ applicationId: active.id as string, stage: newStage as ApplicationSatge })
    }

    if (!jobPostingId) return (
        <div className="min-h-screen bg-[#18181f] flex items-center justify-center">
            <p className="text-stone-500 text-sm">Something went wrong.</p>
        </div>
    )

    return (
        <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#18181f]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-semibold tracking-tight">
                        <span className="text-teal-400">Hire</span>base
                    </Link>
                    <Link to="/app/recruiter/jobPostings" className="text-sm text-stone-500 hover:text-teal-400 transition-colors">
                        ← Back to postings
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-white">Pipeline</h1>
                    <p className="mt-1 text-sm text-stone-500">Drag candidates between stages</p>
                </div>

                <div className="grid grid-cols-4 gap-4 items-start">
                    {/* Inbox — static, not part of DnD */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-sm font-semibold text-stone-300">Applied</h2>
                            <span className="text-xs text-stone-500 bg-white/[0.05] border border-white/[0.07] px-2 py-0.5 rounded-full">
                                {inbox?.totalCount ?? 0}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 min-h-32">
                            {inboxPending && <div className="text-xs text-stone-600 text-center py-6">Loading...</div>}
                            {inboxError && <div className="text-xs text-red-400 text-center py-6">Failed to load.</div>}
                            {!inboxPending && !inboxError && !inbox?.items.length && (
                                <div className="rounded-xl border border-dashed border-white/[0.07] h-32 flex items-center justify-center text-xs text-stone-700">
                                    No applicants
                                </div>
                            )}
                            {inbox?.items.map(app => (
                                <CandidateCard
                                    key={app.id}
                                    application={app}
                                    noDrag
                                    onMoveToScreening={(id) => updateStage({ applicationId: id, stage: "Screening" })}
                                    onReject={(id) => updateStage({ applicationId: id, stage: "Rejected" })}
                                />
                            ))}
                            {inbox && inbox.totalPages > 1 && (
                                <PaginationControls inbox={inbox} setPage={setInboxPage} />
                            )}
                        </div>
                    </div>

                    {/* Pipeline — drag and drop */}
                    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                            {PIPELINE_STAGES.map(stage => (
                                <KanbanColumn
                                    key={stage}
                                    stage={stage}
                                    apps={items.filter(a => a.stage === stage)}
                                    isPending={isPending}
                                    isError={isError}
                                    onReject={(id) => updateStage({ applicationId: id, stage: "Rejected" })}
                                />
                            ))}
                        </div>
                        <DragOverlay dropAnimation={null}>
                            {activeApp && <CandidateCard application={activeApp} isOverlay />}
                        </DragOverlay>
                    </DndContext>
                </div>
            </main>
        </div>
    )
}

function KanbanColumn({
    stage,
    apps,
    isPending,
    isError,
    onReject,
}: {
    stage: PipelineStage
    apps: RecruiterApplicationResponse[]
    isPending: boolean
    isError: boolean
    onReject: (id: string) => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id: stage })

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-stone-300">{stage}</h2>
                <span className="text-xs text-stone-500 bg-white/[0.05] border border-white/[0.07] px-2 py-0.5 rounded-full">
                    {apps.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className={`flex flex-col gap-2 min-h-[600px] rounded-xl p-1 transition-colors ${
                    isOver ? "bg-teal-500/[0.05] ring-1 ring-teal-500/20" : ""
                }`}
            >
                {isPending && (
                    <div className="text-xs text-stone-600 text-center py-6">Loading...</div>
                )}
                {isError && (
                    <div className="text-xs text-red-400 text-center py-6">Failed to load.</div>
                )}
                {!isPending && !isError && apps.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/[0.07] flex-1 flex items-center justify-center text-xs text-stone-700">
                        Drop here
                    </div>
                )}
                {apps.map(app => (
                    <CandidateCard key={app.id} application={app} onReject={onReject} />
                ))}
            </div>
        </div>
    )
}

function CandidateCard({
    application,
    isOverlay = false,
    noDrag = false,
    onMoveToScreening,
    onReject,
}: {
    application: RecruiterApplicationResponse
    isOverlay?: boolean
    noDrag?: boolean
    onMoveToScreening?: (id: string) => void
    onReject?: (id: string) => void
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: application.id,
        disabled: noDrag,
    })

    const meta = [application.seniorityLevel, application.location].filter(Boolean).join(" · ")

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined

    return (
        <div
            ref={isOverlay ? undefined : setNodeRef}
            style={isOverlay ? undefined : style}
            {...(isOverlay ? {} : { ...attributes, ...listeners })}
            className={`touch-none transition-opacity ${isDragging && !isOverlay ? "opacity-40" : "opacity-100"}`}
        >
            <div className="group flex flex-col gap-3 bg-white/[0.04] border border-white/[0.07] hover:border-teal-500/30 hover:bg-white/[0.06] rounded-xl p-4 transition-colors">
                <Link
                    to={`${application.candidateProfileId}`}
                    state={{ application }}
                    onClick={e => isDragging && e.preventDefault()}
                    className={`flex flex-col gap-3 ${!noDrag ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                    <div>
                        <p className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors leading-snug">
                            {application.candidateName ?? "Unknown"}
                        </p>
                        {meta && <p className="text-xs text-stone-500 mt-0.5">{meta}</p>}
                        <p className="text-xs text-stone-700 mt-1">
                            {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                        </p>
                    </div>

                    <div className="border-t border-white/[0.05] pt-3">
                        {application.hasConnected ? (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                <Signal icon={<Zap size={11} />} label="Activity" value={application.activityScore} />
                                <Signal icon={<Star size={11} />} label="Popularity" value={application.popularityScore} />
                                <Signal icon={<PackageOpen size={11} />} label="Maturity" value={application.repoMaturityScore} />
                                <Signal icon={<GitPullRequest size={11} />} label="Ext. PRs" value={application.externalPrCount} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-stone-700">
                                <GitPullRequest size={12} />
                                <span className="text-xs">No GitHub connected</span>
                            </div>
                        )}
                    </div>
                </Link>

                {(onMoveToScreening || onReject) && (
                    <div className={`grid gap-2 ${onMoveToScreening && onReject ? "grid-cols-2" : "grid-cols-1"}`}>
                        {onMoveToScreening && (
                            <button
                                onClick={() => onMoveToScreening(application.id)}
                                className="flex items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-teal-400 border border-white/[0.06] hover:border-teal-500/30 rounded-lg py-1.5 transition-colors"
                            >
                                <ArrowRight size={11} />
                                Screening
                            </button>
                        )}
                        {onReject && (
                            <button
                                onClick={() => onReject(application.id)}
                                className="flex items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 rounded-lg py-1.5 transition-colors"
                            >
                                <X size={11} />
                                Reject
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function Signal({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="flex items-center gap-1 text-stone-500">
            <span className="text-stone-600">{icon}</span>
            <span className="text-xs">{label}</span>
            <span className="text-xs text-stone-400 ml-auto">{value}</span>
        </div>
    )
}

function PaginationControls({
    inbox,
    setPage,
}: {
    inbox: InboxFeedResponse
    setPage: Dispatch<SetStateAction<number>>
}) {
    return (
        <div className="flex items-center justify-between gap-2 pt-1">
            <button
                onClick={() => setPage(p => p - 1)}
                disabled={!inbox.hasPreviousPage}
                className="text-xs text-stone-500 hover:text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                ← Prev
            </button>
            <span className="text-xs text-stone-600">{inbox.page} / {inbox.totalPages}</span>
            <button
                onClick={() => setPage(p => p + 1)}
                disabled={!inbox.hasNextPage}
                className="text-xs text-stone-500 hover:text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                Next →
            </button>
        </div>
    )
}
