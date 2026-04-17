import { useForm, type SubmitHandler } from "react-hook-form"
import { loginSchema, type LoginSchema } from "@/schemas/authValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "../hooks/authMutations"
import { FieldGroup } from "@/components/ui/field"
import FormField from "@/components/shared/FormField"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function Login(){

    const navigate = useNavigate()

    const {register, handleSubmit, formState:{errors}} = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    })

    const {mutate:login, isPending, isError} = useLogin()

    const onSubmit:SubmitHandler<LoginSchema> = (data) => {
        //Chore: redirect to app when  implemented
        login(data,{
            onSuccess:() => navigate("/")
        })
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
                        <span className="text-sm text-stone-400">Don't have an account?</span>
                        <Button asChild variant="ghost" className="text-stone-400 hover:text-stone-100 hover:bg-white/[0.06]">
                            <Link to="/register">Sign up</Link>
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
                        <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
                        <p className="mt-3 text-stone-400 text-sm leading-relaxed">
                            Fill in your credentials to unlock an enhanced hiring flow built around real code.
                        </p>
                    </div>

                    <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-8">
                        {isError && (
                            <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                Something went wrong. Please check your credentials and try again.
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <FormField
                                    name='email'
                                    label='Email'
                                    registration={register("email")}
                                    errorMsg={errors.email?.message}
                                />
                                <FormField
                                    name='password'
                                    label='Password'
                                    type="password"
                                    registration={register("password")}
                                    errorMsg={errors.password?.message}
                                />
                            </FieldGroup>

                            <div className="mt-6">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-full py-5 text-sm font-medium shadow-lg shadow-teal-500/20 transition-all"
                                >
                                    {isPending ? "Logging in…" : "Log in"}
                                </Button>
                            </div>
                        </form>
                    </div>
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