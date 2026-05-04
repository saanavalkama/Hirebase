import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import OrganizationForm from "../components/OrganizationForm"
import OrganizationList from "../components/OrganizationList"
import { useOwnOrganizations } from "../hooks/organizationHooks"
import type { OrganizationResponse } from "@/types/types"

export default function OrganizationPage() {

    const [searchParams] = useSearchParams()

    const { data: orgs, isPending, isError } = useOwnOrganizations()
    const [selectedOrg, setSelectedOrg] = useState<OrganizationResponse | null>(null)

    useEffect(()=>{
        const editId = searchParams.get("edit")
        if(editId && orgs){
            const org = orgs.find(o => o.id === editId) ?? null
            setSelectedOrg(org)
        }
    },[orgs,searchParams])

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

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 relative">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(20,184,166,0.08),transparent)]" />

                <div className="mb-8">
                    <span className="inline-flex items-center gap-2 bg-teal-950/60 text-teal-400 text-xs font-medium px-4 py-1.5 rounded-full border border-teal-800/50 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Organizations
                    </span>
                    <h1 className="text-2xl font-semibold text-white">Manage organizations</h1>
                    <p className="mt-1 text-sm text-stone-500">Add and edit the organizations you recruit for</p>
                </div>

                <div className="grid grid-cols-2 gap-6 items-start">
                    <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-white">Your organizations</h2>
                            <span className="text-xs text-stone-500">
                                {orgs?.length ?? 0} total
                            </span>
                        </div>

                        {isPending ? (
                            <div className="flex items-center justify-center py-10">
                                <span className="text-sm text-stone-500">Loading…</span>
                            </div>
                        ) : isError ? (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                Failed to load organizations.
                            </div>
                        ) : (
                            <OrganizationList
                                orgs={orgs ?? []}
                                onEdit={(org) => setSelectedOrg(org)}
                                selectedId={selectedOrg?.id ?? null}
                            />
                        )}
                    </div>

                    <OrganizationForm
                        org={selectedOrg}
                        onCancel={() => setSelectedOrg(null)}
                    />
                </div>
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
