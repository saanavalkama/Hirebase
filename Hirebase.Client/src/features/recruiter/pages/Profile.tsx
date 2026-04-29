import { recruiterValidationSchema, type RecruiterValidationSchema } from "@/schemas/recruiterValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import FormField from "../../../components/shared/FormField"
import { useCreateRecruiterProfile, useRecruiterProfileQuery, useUpdateRecruiterProfile } from "../hooks/recruiterProfileHooks"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { Link } from "react-router-dom"

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

export default function Profile() {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<RecruiterValidationSchema>({
        resolver: zodResolver(recruiterValidationSchema)
    })

    const { mutate: createRecruiter, isPending, isError } = useCreateRecruiterProfile()
    const { mutate: updateProfile, isPending: isUpdatePending, isError: isUpdateError } = useUpdateRecruiterProfile()
    const { data, isLoading: isProfileLoading } = useRecruiterProfileQuery()

    const onCreateSubmit: SubmitHandler<RecruiterValidationSchema> = (data) => {
        createRecruiter(data)
    }

    const onUpdateSubmit: SubmitHandler<RecruiterValidationSchema> = (data) => {
        updateProfile(data)
    }

    const currName = watch("name")

    useEffect(() => {
        if (data?.name) {
            reset({ name: data.name ?? undefined })
        }
    }, [data, reset])

    const isCreate = !data?.name

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

            <main className="flex-1 flex items-start justify-center px-6 py-10 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.12),transparent)]" />

                {isProfileLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <span className="text-sm text-stone-500">Loading profile…</span>
                    </div>
                ) : (
                    <div className="w-full max-w-lg">
                        <div className="mb-6 text-center">
                            <span className="inline-flex items-center gap-2 bg-teal-950/60 text-teal-400 text-xs font-medium px-4 py-1.5 rounded-full border border-teal-800/50 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                Recruiter profile
                            </span>
                            <h1 className="text-2xl font-semibold tracking-tight text-white">
                                {isCreate ? "Create your profile" : "Edit your profile"}
                            </h1>
                            <p className="mt-2 text-stone-400 text-sm">
                                {isCreate
                                    ? "Set up your recruiter identity to start posting jobs."
                                    : "Update your recruiter display name."}
                            </p>
                        </div>

                        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6">
                            {(isError || isUpdateError) && (
                                <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                    {isCreate ? "Profile creation failed. Please try again." : "Update failed. Please try again."}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(isCreate ? onCreateSubmit : onUpdateSubmit)} className="space-y-5">
                                <div>
                                    <SectionLabel>Personal info</SectionLabel>
                                    <FormField
                                        label="Name"
                                        name="name"
                                        registration={register("name")}
                                        errorMsg={errors.name?.message}
                                    />
                                </div>

                                <div className="pt-1">
                                    <Button
                                        type="submit"
                                        disabled={isCreate ? isPending : isUpdatePending || data?.name === currName}
                                        className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-full py-5 text-sm font-medium shadow-lg shadow-teal-500/20 transition-all"
                                    >
                                        {isCreate
                                            ? isPending ? "Creating…" : "Create Profile"
                                            : isUpdatePending ? "Saving…" : "Save changes"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-white/[0.06] py-8 px-6">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
                    <span>
                        <span className="text-teal-400 font-medium">Hire</span>base
                    </span>
                    <span>© {new Date().getFullYear()} Hirebase. All rights reserved.</span>
                </div>
            </footer>
        </div>
    )
}
