import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import {
  Controller,
  useForm,
  type SubmitHandler,
} from 'react-hook-form'
import FormField from '@/components/shared/FormField'
import {
  candidateProfileSchema,
  type CandidateSchema,
} from '@/schemas/candidateValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import DatePickerField from '../components/DatePickerField'
import { useConnectGitHub, useRefreshGitHub, useUpdateProfile } from '../hooks/useCandidateMutations'
import { useMe } from '@/features/auth/hooks/useAuthQueries'
import { useCandidateProfile } from '../hooks/useCandidateQuery'
import { useEffect } from 'react'
import GitHubData from '../components/GitHubData'

const SOFT_SKILLS = [
  'Communication',
  'Teamwork',
  'Leadership',
  'ProblemSolving',
  'Adaptability',
  'TimeManagement',
  'Mentoring',
  'Collaboration',
  'Ownership',
  'Creativity',
] as const

const PREFERRED_ROLES = [
  'FrontendEngineer',
  'BackendEngineer',
  'FullstackEngineer',
  'MobileEngineer',
  'DevOps',
  'DataEngineer',
  'MachineLearningEngineer',
  'QAEngineer',
  'SecurityEngineer',
  'EmbeddedEngineer',
  'AIEngineer',
] as const

const ROLE_LABELS: Record<string, string> = {
  FrontendEngineer: 'Frontend Engineer',
  BackendEngineer: 'Backend Engineer',
  FullstackEngineer: 'Fullstack Engineer',
  MobileEngineer: 'Mobile Engineer',
  DevOps: 'DevOps',
  DataEngineer: 'Data Engineer',
  MachineLearningEngineer: 'ML Engineer',
  QAEngineer: 'QA Engineer',
  SecurityEngineer: 'Security Engineer',
  EmbeddedEngineer: 'Embedded Engineer',
  AIEngineer: 'AI Engineer',
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

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
    getValues, 
    setValue
  } = useForm<CandidateSchema>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: { softSkills: [], preferredRoles: [] },
  })

  const { mutate: updateProfile, isPending, isError } = useUpdateProfile()
  const { mutate: connectGitHub } = useConnectGitHub()
  const { mutate: refreshGitHub } = useRefreshGitHub()
  const { data: me } = useMe()
  const { data: profile } = useCandidateProfile()

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? undefined,
        location: profile.location ?? undefined,
        bio: profile.bio ?? undefined,
        linkedInUrl: profile.linkedInUrl ?? undefined,
        personalSiteUrl: profile.personalSiteUrl ?? undefined,
        cvUrl: profile.cvUrl ?? undefined,
        yearsOfExperience: profile.yearsOfExperience ?? undefined,
        seniorityLevel: profile.seniorityLevel ?? undefined,
        remotePreference: profile.remotePreference ?? undefined,
        availableFrom: profile.availableFrom ?? undefined,
        salaryMin: profile.salaryMin ?? undefined,
        salaryMax: profile.salaryMax ?? undefined,
        softSkills: profile.softSkills ?? undefined,
        preferredRoles: profile.preferredRoles ?? undefined,
      })
    }
  }, [profile, reset])

  const bioLength = watch('bio')?.length ?? 0
  const rawSkills = watch('softSkills')
  const selectedSkills: string[] = Array.isArray(rawSkills)
    ? rawSkills
    : rawSkills
      ? [rawSkills as string]
      : []
  const rawRoles = watch("preferredRoles")
  const selectedRoles:string[] = Array.isArray(rawRoles)
    ? rawRoles 
    : rawRoles ? [rawRoles as string] : []


  if (!me) return <div>Loading...</div>

  const onSubmit: SubmitHandler<CandidateSchema> = (data) => {
    const arrChanged = (a?: string[], b?: string[]) =>
      JSON.stringify([...(a ?? [])].sort()) !== JSON.stringify([...(b ?? [])].sort())

    const changes = {
      name:             profile?.name             !== data.name             ? data.name             : undefined,
      location:         profile?.location         !== data.location         ? data.location         : undefined,
      bio:              profile?.bio              !== data.bio              ? data.bio              : undefined,
      linkedInUrl:      profile?.linkedInUrl      !== data.linkedInUrl      ? data.linkedInUrl      : undefined,
      personalSiteUrl:  profile?.personalSiteUrl  !== data.personalSiteUrl  ? data.personalSiteUrl  : undefined,
      cvUrl:            profile?.cvUrl            !== data.cvUrl            ? data.cvUrl            : undefined,
      yearsOfExperience:profile?.yearsOfExperience!== data.yearsOfExperience? data.yearsOfExperience: undefined,
      seniorityLevel:   profile?.seniorityLevel   !== data.seniorityLevel   ? data.seniorityLevel   : undefined,
      remotePreference: profile?.remotePreference !== data.remotePreference ? data.remotePreference : undefined,
      availableFrom:    profile?.availableFrom    !== data.availableFrom    ? data.availableFrom    : undefined,
      salaryMin:        profile?.salaryMin        !== data.salaryMin        ? data.salaryMin        : undefined,
      salaryMax:        profile?.salaryMax        !== data.salaryMax        ? data.salaryMax        : undefined,
      softSkills:       arrChanged(profile?.softSkills,    data.softSkills)    ? data.softSkills    : undefined,
      preferredRoles:   arrChanged(profile?.preferredRoles, data.preferredRoles) ? data.preferredRoles : undefined,
    }

    const payload = Object.fromEntries(Object.entries(changes).filter(([_, v]) => v !== undefined))
    updateProfile(payload)
  }

  console.log(profile)

  return (
    <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#18181f]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight">
            <span className="text-teal-400">Hire</span>base
          </a>
          <Button
            asChild
            variant="ghost"
            className="text-stone-400 hover:text-stone-100 hover:bg-white/[0.06]"
          >
            <Link to="/">Back</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-10 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.12),transparent)]" />

        <div className="w-full max-w-5xl">
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 bg-teal-950/60 text-teal-400 text-xs font-medium px-4 py-1.5 rounded-full border border-teal-800/50 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Candidate profile
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Complete your profile
            </h1>
            <p className="mt-2 text-stone-400 text-sm">
              Help recruiters find you by filling in your details.
            </p>
          </div>
            <GitHubData data={profile?.gitHub} onConnect={() => connectGitHub()} onRefresh={() => refreshGitHub()} />
            <div>
                {isError && <p>something went wrong while creating profile</p>}
            </div>
          <p className="text-[11px] text-stone-500 text-center mb-4">
            GitHub signals are fetched automatically once a week. You can trigger a manual refresh every two days.
          </p>
          <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Personal + Links */}
              <div className="grid grid-cols-3 gap-x-6 gap-y-0">
                <div className="col-span-3">
                  <SectionLabel>Personal info</SectionLabel>
                </div>
                <div className="col-span-1">
                  <FormField
                    label="Name"
                    name="name"
                    registration={register('name')}
                    errorMsg={errors.name?.message}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    label="Location"
                    name="location"
                    registration={register('location')}
                    errorMsg={errors.location?.message}
                  />
                </div>
                <div className="col-span-1 row-span-2 p-2 flex flex-col gap-1">
                  <div className="flex items-baseline justify-between">
                    <label
                      htmlFor="bio"
                      className="text-sm font-medium text-stone-200"
                    >
                      Bio
                    </label>
                    <span
                      className={`text-xs ${bioLength > 300 ? 'text-red-400' : 'text-stone-500'}`}
                    >
                      {bioLength}/300
                    </span>
                  </div>
                  <Textarea
                    id="bio"
                    className="min-h-20 resize-none flex-1"
                    {...register('bio')}
                  />
                  {errors.bio && (
                    <p className="text-red-400 text-xs">{errors.bio.message}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <FormField
                    label="LinkedIn URL"
                    name="linkedInUrl"
                    registration={register('linkedInUrl')}
                    errorMsg={errors.linkedInUrl?.message}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    label="Personal site URL"
                    name="personalSiteUrl"
                    registration={register('personalSiteUrl')}
                    errorMsg={errors.personalSiteUrl?.message}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    label="CV URL"
                    name="cvUrl"
                    registration={register('cvUrl')}
                    errorMsg={errors.cvUrl?.message}
                  />
                </div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Career + Salary */}
              <div>
                <SectionLabel>Career & salary</SectionLabel>
                <div className="grid grid-cols-4 gap-x-4">
                  <Controller
                    name="yearsOfExperience"
                    control={control}
                    render={({ field }) => (
                      <Field className="p-2">
                        <FieldLabel>Experience</FieldLabel>
                        <Select
                          value={
                            field.value !== undefined ? String(field.value) : ''
                          }
                          onValueChange={(v) => field.onChange(Number(v))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Years" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Array.from({ length: 30 }, (_, i) => i + 1).map(
                                (n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {n} yr{n > 1 ? 's' : ''}
                                  </SelectItem>
                                )
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {errors.yearsOfExperience && (
                          <FieldDescription className="text-red-400">
                            {errors.yearsOfExperience.message}
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="seniorityLevel"
                    control={control}
                    render={({ field }) => (
                      <Field className="p-2">
                        <FieldLabel>Seniority</FieldLabel>
                        <Select
                          value={field.value ?? ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent>
                            {['Junior', 'Mid', 'Senior', 'Lead'].map((l) => (
                              <SelectItem key={l} value={l}>
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.seniorityLevel && (
                          <FieldDescription className="text-red-400">
                            {errors.seniorityLevel.message}
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="remotePreference"
                    control={control}
                    render={({ field }) => (
                      <Field className="p-2">
                        <FieldLabel>Remote</FieldLabel>
                        <Select
                          value={field.value ?? ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Preference" />
                          </SelectTrigger>
                          <SelectContent>
                            {['Remote', 'Hybrid', 'Onsite'].map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.remotePreference && (
                          <FieldDescription className="text-red-400">
                            {errors.remotePreference.message}
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="availableFrom"
                    control={control}
                    render={({ field }) => (
                      <DatePickerField
                        label="Available from"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.availableFrom?.message}
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <Controller
                    name="salaryMin"
                    control={control}
                    render={({ field }) => (
                      <Field className="p-2">
                        <FieldLabel>Min salary (€)</FieldLabel>
                        <Input
                          type="number"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value !== ''
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                        {errors.salaryMin && (
                          <FieldDescription className="text-red-400">
                            {errors.salaryMin.message}
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="salaryMax"
                    control={control}
                    render={({ field }) => (
                      <Field className="p-2">
                        <FieldLabel>Max salary (€)</FieldLabel>
                        <Input
                          type="number"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value !== ''
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                        {errors.salaryMax && (
                          <FieldDescription className="text-red-400">
                            {errors.salaryMax.message}
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Skills + Roles */}
              <div className="grid grid-cols-2 gap-x-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SectionLabel>Soft skills</SectionLabel>
                    <span
                      className={`text-xs mb-2 shrink-0 ${selectedSkills.length >= 3 ? 'text-teal-400' : 'text-stone-500'}`}
                    >
                      {selectedSkills.length}/3
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SOFT_SKILLS.map((skill) => {
                      const checked = selectedSkills.includes(skill)
                      const disabled = !checked && selectedSkills.length >= 3
                      return (
                        <label
                          key={skill}
                          className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
                            disabled
                              ? 'border-white/[0.04] text-stone-600 cursor-not-allowed opacity-40'
                              : 'border-white/[0.07] text-stone-300 cursor-pointer hover:border-teal-700/50 hover:bg-teal-950/20 has-[:checked]:border-teal-600/50 has-[:checked]:bg-teal-950/40 has-[:checked]:text-teal-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={skill}
                            checked={checked}
                            disabled={disabled}
                            className='accent-teal-500 shrink-0'
                            onChange={(e)=> {
                                const current = getValues("softSkills") ?? []
                                if(e.target.checked){
                                    setValue("softSkills", [...current, skill])
                                } else {
                                    setValue("softSkills", current.filter(s => s!== skill))
                                }
                            }}
                          />
                          {skill.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                      )
                    })}
                  </div>
                  {errors.softSkills && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.softSkills.message}
                    </p>
                  )}
                </div>
                <div>
                  <SectionLabel>Preferred roles</SectionLabel>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PREFERRED_ROLES.map((role) => (
                      <label
                        key={role}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-2 py-1.5 text-xs text-stone-300 cursor-pointer hover:border-teal-700/50 hover:bg-teal-950/20 has-[:checked]:border-teal-600/50 has-[:checked]:bg-teal-950/40 has-[:checked]:text-teal-300 transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={role}
                          checked={selectedRoles.includes(role)}
                          className="accent-teal-500 shrink-0"
                          onChange={(e)=>{
                            const current = getValues("preferredRoles") ?? []
                            if(e.target.checked){
                                setValue("preferredRoles",[...current,role])
                            } else {
                                setValue("preferredRoles", current.filter(s => s !== role))
                            }
                          }}
                        />
                        {ROLE_LABELS[role]}
                      </label>
                    ))}
                  </div>
                  {errors.preferredRoles && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.preferredRoles.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-full py-5 text-sm font-medium shadow-lg shadow-teal-500/20 transition-all"
                  disabled ={isPending}
                >
                  {isPending ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <span>
            <span className="text-teal-400 font-medium">Hire</span>base
          </span>
          <span>
            © {new Date().getFullYear()} Hirebase. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}
