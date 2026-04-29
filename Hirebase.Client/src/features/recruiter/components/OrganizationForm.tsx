import { useForm, type SubmitHandler } from "react-hook-form"
import { useCreateOrganization, useUpdateOrganization } from "../hooks/organizationHooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { organizationValidation, type Organization } from "@/schemas/organizationValidation"
import FormField from '../../../components/shared/FormField'
import { Button } from "@/components/ui/button"
import type { OrganizationResponse } from "@/types/types"
import { useEffect } from "react"

interface Props {
    org: OrganizationResponse | null
    onCancel: () => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-400">
                {children}
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
    )
}

export default function OrganizationForm({ org, onCancel }: Props) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Organization>({
        resolver: zodResolver(organizationValidation)
    })
    const { mutate: createOrganization, isPending, isError } = useCreateOrganization()
    const { mutate: updateOrganization, isPending: isUpdatePending, isError: isUpdateError } = useUpdateOrganization()

    const isEdit = org !== null

    const onSubmit: SubmitHandler<Organization> = (data) => {
        if (isEdit) {
            const changes = {
                name: org.name !== data.name ? data.name : undefined,
                websiteUrl: org.websiteUrl !== data.websiteUrl ? data.websiteUrl : undefined,
                location: org.location !== data.location ? data.location : undefined,
            }
            const payload = Object.fromEntries(Object.entries(changes).filter(([_, v]) => v !== undefined))
            updateOrganization({ ...payload, id: org.id })
        } else {
            createOrganization(data, {onSuccess:()=>reset()})
        }
    }

    useEffect(() => {
        if (org) {
            reset({ name: org.name, websiteUrl: org.websiteUrl ?? undefined, location: org.location ?? undefined })
        } else {
            reset({ name: "", websiteUrl: undefined, location: undefined })
        }
    }, [org, reset])

    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-5">
            <div>
                <h3 className="text-base font-semibold text-white">
                    {isEdit ? "Edit organization" : "New organization"}
                </h3>
                <p className="mt-1 text-sm text-stone-400">
                    {isEdit ? `Updating ${org.name}` : "Add a new organization to your profile"}
                </p>
            </div>

            {(isError || isUpdateError) && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {isEdit ? "Update failed. Please try again." : "Creation failed. Please try again."}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                    <SectionLabel>Details</SectionLabel>
                    <div className="flex flex-col gap-1">
                        <FormField
                            label="Organization name"
                            name="name"
                            registration={register("name")}
                            errorMsg={errors.name?.message}
                        />
                        <FormField
                            label="Website URL"
                            name="websiteUrl"
                            registration={register("websiteUrl")}
                            errorMsg={errors.websiteUrl?.message}
                        />
                        <FormField
                            label="Location"
                            name="location"
                            registration={register("location")}
                            errorMsg={errors.location?.message}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                    <Button
                        type="submit"
                        disabled={isPending || isUpdatePending}
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-full py-5 text-sm font-medium shadow-lg shadow-teal-500/20 transition-all"
                    >
                        {isEdit
                            ? isUpdatePending ? "Saving…" : "Save changes"
                            : isPending ? "Creating…" : "Create organization"}
                    </Button>
                    {isEdit && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full text-sm text-stone-500 hover:text-stone-300 transition-colors py-1"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
