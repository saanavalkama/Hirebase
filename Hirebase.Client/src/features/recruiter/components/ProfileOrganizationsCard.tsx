import { Link } from "react-router-dom"
import { useRecruiterProfileQuery } from "../hooks/recruiterProfileHooks"
import { useOwnOrganizations } from "../hooks/organizationHooks"

export default function ProfileOrganizationsCard() {

    const { data } = useRecruiterProfileQuery()
    const { data: orgs, isPending } = useOwnOrganizations()

    if (isPending) return null

   

    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-white">Profile & Organizations</h2>
                <p className="mt-1 text-sm text-stone-400">Manage your recruiter identity</p>
            </div>

            {data?.name ? (
                <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400 text-sm font-semibold">
                            {data.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-white font-medium">{data.name}</span>
                            <span className="text-xs text-stone-500">Recruiter profile</span>
                        </div>
                    </div>
                    <Link
                        to="/app/recruiter/profile/edit"
                        className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
                    >
                        Edit
                    </Link>
                </div>
            ) : (
                <Link
                    to="/app/recruiter/profile/edit"
                    className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl px-4 py-3 text-sm font-medium shadow-md shadow-teal-500/20 transition-all"
                >
                    Set up your recruiter profile →
                </Link>
            )}

            <div className="flex flex-col gap-2">
                <span className="text-xs text-stone-500 uppercase tracking-wide font-medium">Organizations</span>
                {orgs && orgs.map((org) => (
                    <div
                        key={org.id}
                        className="flex items-center justify-between bg-white/[0.03] rounded-xl border border-white/[0.06] px-4 py-3"
                    >
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-white font-medium">{org.name}</span>
                            <span className="text-xs text-stone-500">{org.location}</span>
                        </div>
                        <Link
                            to={`/app/recruiter/organizations?edit=${org.id}`}
                            className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
                        >
                            Edit
                        </Link>
                    </div>
                ))}
                <Link
                    to="/app/recruiter/organizations"
                    className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-300 transition-colors mt-1"
                >
                    <span className="text-base leading-none">+</span> Add organization
                </Link>
            </div>
        </div>
    )
}
