import {useForm, type SubmitHandler, Controller} from 'react-hook-form'
import FormField from '../../../components/shared/FormField'
import {FieldGroup} from '@/components/ui/field'
import { RadioGroup,RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { useRegister } from '../hooks/authMutations'
import {zodResolver} from '@hookform/resolvers/zod'
import { registerSchema, type RegisterSchema} from '@/schemas/authValidation'



export default function Register(){

    const {register, handleSubmit,control, formState:{errors}} = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {role:'CANDIDATE'}
    })
    const {mutate: registerMutation, isPending, isError} = useRegister()

    const onSubmit:SubmitHandler<RegisterSchema> = (data) => {
        const payload = {
            email: data.email,
            password: data.password,
            role: data.role
        }
        registerMutation(payload)
    }

    return(
        <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#18181f]/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="text-xl font-semibold tracking-tight">
                        <span className="text-teal-400">Hire</span>base
                    </a>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-stone-400">Already have an account?</span>
                        <Button variant="ghost" className="text-stone-400 hover:text-stone-100 hover:bg-white/[0.06]">
                            Log in
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.12),transparent)]" />

                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <span className="inline-flex items-center gap-2 bg-teal-950/60 text-teal-400 text-xs font-medium px-4 py-1.5 rounded-full border border-teal-800/50 mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            GitHub-driven hiring
                        </span>
                        <h1 className="text-3xl font-semibold tracking-tight text-white">Create your account</h1>
                        <p className="mt-3 text-stone-400 text-sm leading-relaxed">
                            Fill in your credentials to unlock an enhanced hiring flow built around real code.
                        </p>
                    </div>

                    <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-8">
                        {isError && (
                            <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                Something went wrong while registering. Please try again.
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <FormField
                                    label='Email'
                                    name='email'
                                    registration={register("email")}
                                    errorMsg={errors.email?.message}
                                />

                                <div className="p-2">
                                    <p className="text-sm font-medium text-stone-300 mb-3">I am a…</p>
                                    <Controller
                                        name='role'
                                        control={control}
                                        render={({field, fieldState}) => (
                                            <div>
                                                <RadioGroup
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    className="grid grid-cols-2 gap-3"
                                                >
                                                    <label
                                                        htmlFor='r1'
                                                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all text-sm
                                                            ${field.value === 'RECRUITER'
                                                                ? 'border-teal-500/60 bg-teal-950/40 text-teal-300'
                                                                : 'border-white/[0.08] bg-white/[0.03] text-stone-400 hover:border-white/[0.15] hover:bg-white/[0.06]'
                                                            }`}
                                                    >
                                                        <RadioGroupItem value='RECRUITER' id='r1' className="hidden" />
                                                        <span>Recruiter</span>
                                                    </label>
                                                    <label
                                                        htmlFor='r2'
                                                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all text-sm
                                                            ${field.value === 'CANDIDATE'
                                                                ? 'border-teal-500/60 bg-teal-950/40 text-teal-300'
                                                                : 'border-white/[0.08] bg-white/[0.03] text-stone-400 hover:border-white/[0.15] hover:bg-white/[0.06]'
                                                            }`}
                                                    >
                                                        <RadioGroupItem value='CANDIDATE' id='r2' className="hidden" />
                                                        <span>Candidate</span>
                                                    </label>
                                                </RadioGroup>
                                                {fieldState.error && (
                                                    <p className="mt-1.5 text-sm text-red-400">{fieldState.error.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <FormField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    registration={register("password")}
                                    errorMsg={errors.password?.message}
                                />
                                <FormField
                                    label='Confirm password'
                                    name='confirmPassword'
                                    type="password"
                                    registration={register("confirmPassword")}
                                    errorMsg={errors.confirmPassword?.message}
                                />
                            </FieldGroup>

                            <div className="mt-6">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-full py-5 text-sm font-medium shadow-lg shadow-teal-500/20 transition-all"
                                >
                                    {isPending ? "Creating account…" : "Create account"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-xs text-stone-500">
                        Free to get started · No credit card required
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
                    <span>
                        <span className="text-teal-400 font-medium">Hire</span>base
                    </span>
                    <span>© {new Date().getFullYear()} Hirebase. All rights reserved.</span>
                </div>
            </footer>
        </div>
    )
}