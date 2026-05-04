import { type JobPosting, jobPostingValidation } from "@/schemas/jobPostingValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import FormField from "../../../components/shared/FormField"
import MessageBox from "@/components/shared/MessageBox"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useOwnOrganizations } from "../hooks/organizationHooks"
import { Input } from "@/components/ui/input"
import DatePickerField from "@/features/candidates/components/DatePickerField"
import { Checkbox } from "@/components/ui/checkbox"
import type { PreferredRoleType, SoftSkillType } from "@/types/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { LANGUAGES } from "../data/languages"
import { useCreateJobPosting, useJobPostingById, useUpdateJobPosting } from "../hooks/jobPostingHooks"
import { ChevronsUpDownIcon, XIcon } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const SENIORITY = ["Junior", "Mid", "Senior", "Lead"] as const
const STATUS = ["Draft", "Open", "Closed"] as const
const SOFT_SKILLS: SoftSkillType[] = [
  "Communication",
  "Teamwork",
  "Leadership",
  "ProblemSolving",
  "Adaptability",
  "TimeManagement",
  "Mentoring",
  "Collaboration",
  "Ownership",
  "Creativity",
]
const PREFERRED_ROLES: PreferredRoleType[] = [
  "FrontendEngineer",
  "BackendEngineer",
  "FullstackEngineer",
  "MobileEngineer",
  "DevOps",
  "DataEngineer",
  "MachineLearningEngineer",
  "QAEngineer",
  "SecurityEngineer",
  "EmbeddedEngineer",
  "AIEngineer",
]

export default function JobPosting() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [langOpen, setLangOpen] = useState(false)

  const jobPostingId = searchParams.get("jobPostingId") ?? ""
  const isEditMode = !!jobPostingId

  const { data: orgs, isPending: isOrgsPending, isError: isOrgsError } = useOwnOrganizations()
  const { data: existingPosting, isPending: isPostingPending } = useJobPostingById(jobPostingId)
  const { mutate: createJobPosting, isPending: isCreating } = useCreateJobPosting()
  const { mutate: updateJobPosting, isPending: isUpdating } = useUpdateJobPosting()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    getValues,
    setValue,
    reset,
  } = useForm<JobPosting>({
    resolver: zodResolver(jobPostingValidation),
    defaultValues: {
      status: "Draft",
      softSkills: [],
      preferredRole: [],
      requiredLanguages: [],
    },
  })

  useEffect(() => {
    if (!existingPosting) return
    reset({
      organizationId: existingPosting.organizationId,
      title: existingPosting.title,
      description: existingPosting.description,
      status: existingPosting.status as "Draft" | "Open" | "Closed",
      seniorityLevel: existingPosting.seniorityLevel,
      salaryMin: existingPosting.salaryMin,
      salaryMax: existingPosting.salaryMax,
      location: existingPosting.location,
      remotePreference: existingPosting.remotePrefrence,
      lastApplicationDay: existingPosting.lastApplicationDay,
      softSkills: existingPosting.jobPostingSoftSkills ?? [],
      preferredRole: existingPosting.preferredRole ? [existingPosting.preferredRole as PreferredRoleType] : [],
      requiredLanguages: (existingPosting.requiredLanguages ?? []) as JobPosting["requiredLanguages"],
    })
  }, [existingPosting, reset])

  const softSkills = watch("softSkills")
  const preferredRole = watch("preferredRole")

  const onSubmit = ({ softSkills, preferredRole, status, jobPostingSoftSkills: _, ...rest }: JobPosting) => {
    const payload = {
      ...rest,
      status: status ?? "Draft",
      jobPostingSoftSkills: softSkills,
      preferredRole: preferredRole?.[0],
    }
    if (isEditMode) {
      updateJobPosting(
        { id: jobPostingId, ...payload },
        { onSuccess: () => navigate("/app/recruiter") }
      )
    } else {
      createJobPosting(payload, { onSuccess: () => navigate("/app/recruiter") })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#18181f]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight">
            <span className="text-teal-400">Hire</span>base
          </a>
          <Button asChild variant="ghost" className="text-stone-400 hover:text-stone-100 hover:bg-white/[0.06]">
            <Link to="/app/recruiter">Back</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(20,184,166,0.08),transparent)]" />

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 bg-teal-950/60 text-teal-400 text-xs font-medium px-4 py-1.5 rounded-full border border-teal-800/50 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            {isEditMode ? "Edit Posting" : "New Posting"}
          </span>
          <h1 className="text-2xl font-semibold text-white">
            {isEditMode ? "Edit job posting" : "Create a job posting"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">Fill in the details to post a new opening</p>
        </div>

        {isEditMode && isPostingPending && (
          <div className="flex items-center justify-center py-20 text-sm text-stone-500">
            Loading posting…
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

          {/* ── Posting Details ── */}
          <section className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Posting details</h2>

            {isOrgsPending ? (
              <p className="text-sm text-stone-500">Loading organizations…</p>
            ) : isOrgsError ? (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                Failed to load organizations.
              </div>
            ) : orgs?.length === 0 ? (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-400">
                You need to create an organization first.{" "}
                <Link to="/app/recruiter/organizations" className="underline hover:text-amber-300">
                  Create one
                </Link>
              </div>
            ) : (
              <Controller
                name="organizationId"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Organization</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgs?.map((org) => (
                          <SelectItem value={org.id} key={org.id}>{org.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.organizationId?.message && (
                      <FieldDescription className="text-red-400">{errors.organizationId.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS.map((s) => (
                          <SelectItem value={s} key={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status?.message && (
                      <FieldDescription className="text-red-400">{errors.status.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="lastApplicationDay"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Last application day"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.lastApplicationDay?.message}
                  />
                )}
              />
            </div>

            <FormField
              label="Title"
              name="title"
              registration={register("title")}
              errorMsg={errors.title?.message}
            />

            <MessageBox
              label="Description"
              name="description"
              errorMsg={errors.description?.message}
              placeholder="Describe the role, responsibilities, and what you're looking for…"
              registration={register("description")}
            />
          </section>

          {/* ── Role & Requirements ── */}
          <section className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-5">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Role & requirements</h2>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="seniorityLevel"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Seniority</FieldLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v === "" ? undefined : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {SENIORITY.map((l) => (
                          <SelectItem value={l} key={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.seniorityLevel && (
                      <FieldDescription className="text-red-400">{errors.seniorityLevel.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="remotePreference"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Remote</FieldLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v === "" ? undefined : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Remote", "Hybrid", "Onsite"].map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.remotePreference && (
                      <FieldDescription className="text-red-400">{errors.remotePreference.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Preferred Role — pick 1 */}
            <Field>
              <FieldLabel>Preferred Role <span className="text-stone-500 font-normal">(pick 1)</span></FieldLabel>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-1">
                {PREFERRED_ROLES.map((role) => {
                  const checked = preferredRole?.includes(role) ?? false
                  const disabled = !checked && (preferredRole?.length ?? 0) >= 1
                  return (
                    <div key={role} className={cn("flex items-center gap-2", disabled && "opacity-40")}>
                      <Checkbox
                        id={`role-${role}`}
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={(c) => {
                          const current = getValues("preferredRole") ?? []
                          setValue("preferredRole", c ? [...current, role] : current.filter((r) => r !== role))
                        }}
                      />
                      <label htmlFor={`role-${role}`} className="text-sm cursor-pointer select-none">{role}</label>
                    </div>
                  )
                })}
              </div>
            </Field>

            {/* Soft Skills — pick up to 3 */}
            <Field>
              <FieldLabel>Soft Skills <span className="text-stone-500 font-normal">(pick up to 3)</span></FieldLabel>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-1">
                {SOFT_SKILLS.map((skill) => {
                  const checked = softSkills?.includes(skill) ?? false
                  const disabled = !checked && (softSkills?.length ?? 0) >= 3
                  return (
                    <div key={skill} className={cn("flex items-center gap-2", disabled && "opacity-40")}>
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={(c) => {
                          const current = getValues("softSkills") ?? []
                          setValue("softSkills", c ? [...current, skill] : current.filter((s) => s !== skill))
                        }}
                      />
                      <label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer select-none">{skill}</label>
                    </div>
                  )
                })}
              </div>
              {errors.softSkills && (
                <FieldDescription className="text-red-400">{errors.softSkills.message as string}</FieldDescription>
              )}
            </Field>

            {/* Required Languages */}
            <Controller
              name="requiredLanguages"
              control={control}
              render={({ field }) => {
                const selected = (field.value ?? []) as string[]
                return (
                  <Field>
                    <FieldLabel>Required Languages</FieldLabel>
                    <Popover open={langOpen} onOpenChange={setLangOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-8 w-full justify-between rounded-lg border border-input bg-transparent px-2.5 text-sm font-normal text-stone-200 hover:bg-white/[0.04] hover:text-stone-200"
                        >
                          {selected.length > 0 ? `${selected.length} selected` : "Select languages"}
                          <ChevronsUpDownIcon className="size-3.5 text-stone-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search languages…" />
                          <CommandList>
                            <CommandEmpty>No language found</CommandEmpty>
                            <CommandGroup>
                              {LANGUAGES.map((lang) => {
                                const isSelected = selected.includes(lang)
                                return (
                                  <CommandItem
                                    key={lang}
                                    value={lang}
                                    data-checked={isSelected}
                                    onSelect={() => {
                                      field.onChange(
                                        isSelected
                                          ? selected.filter((l) => l !== lang)
                                          : [...selected, lang]
                                      )
                                    }}
                                  >
                                    {lang}
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {selected.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selected.map((lang) => (
                          <span
                            key={lang}
                            className="inline-flex items-center gap-1 bg-teal-950/60 text-teal-400 text-xs font-medium px-2.5 py-0.5 rounded-full border border-teal-800/50"
                          >
                            {lang}
                            <button
                              type="button"
                              onClick={() => field.onChange(selected.filter((l) => l !== lang))}
                              className="hover:text-white transition-colors"
                            >
                              <XIcon className="size-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {errors.requiredLanguages && (
                      <FieldDescription className="text-red-400">
                        {errors.requiredLanguages.message as string}
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            />
          </section>

          {/* ── Location & Compensation ── */}
          <section className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Location & compensation</h2>

            <FormField
              label="Location"
              name="location"
              registration={register("location")}
              errorMsg={errors.location?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="salaryMin"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Min Salary (€)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value !== "" ? Number(e.target.value) : undefined)
                      }
                    />
                    {errors.salaryMin && (
                      <FieldDescription className="text-red-400">{errors.salaryMin.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="salaryMax"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Max Salary (€)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value !== "" ? Number(e.target.value) : undefined)
                      }
                    />
                    {errors.salaryMax && (
                      <FieldDescription className="text-red-400">{errors.salaryMax.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pb-10">
            <Button type="button" variant="ghost" asChild className="text-stone-400 hover:text-stone-100">
              <Link to="/app/recruiter">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-teal-500 hover:bg-teal-400 text-white font-medium"
            >
              {isEditMode
                ? isUpdating ? "Saving…" : "Save changes"
                : isCreating ? "Publishing…" : "Publish posting"}
            </Button>
          </div>
        </form>
      </main>

      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <span><span className="text-teal-400 font-medium">Hire</span>base</span>
          <span>© {new Date().getFullYear()} Hirebase. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
