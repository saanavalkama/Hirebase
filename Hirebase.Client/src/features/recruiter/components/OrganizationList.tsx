import { LucidePen, LucideTrash } from "lucide-react"
import type { OrganizationResponse } from "@/types/types"
import { useDeleteOrganization } from "../hooks/organizationHooks"

interface Props {
    orgs: OrganizationResponse[]
    onEdit: (org: OrganizationResponse) => void
    selectedId: string | null
}

export default function OrganizationList({ orgs, onEdit, selectedId }: Props) {
    const { mutate: deleteOrg, isPending: isDeleting } = useDeleteOrganization()

    if (orgs.length === 0) {
        return (
            <div className="flex items-center justify-center py-10">
                <p className="text-sm text-stone-600">No organizations yet — create your first one.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            {orgs.map((org) => (
                <div
                    key={org.id}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                        selectedId === org.id
                            ? "bg-teal-950/30 border-teal-600/40"
                            : "bg-white/[0.03] border-white/[0.06]"
                    }`}
                >
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm text-white font-medium truncate">{org.name}</span>
                        <span className="text-xs text-stone-500">
                            {[org.location, org.websiteUrl].filter(Boolean).join(" · ") || "No details"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 ml-4 shrink-0">
                        <button
                            onClick={() => onEdit(org)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-teal-400 hover:bg-teal-950/30 transition-colors"
                            title="Edit"
                        >
                            <LucidePen size={14} />
                        </button>
                        <button
                            onClick={() => deleteOrg(org.id)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-950/20 transition-colors disabled:opacity-40"
                            title="Delete"
                        >
                            <LucideTrash size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
