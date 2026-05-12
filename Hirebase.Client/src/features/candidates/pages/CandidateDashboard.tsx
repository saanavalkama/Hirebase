import { Link } from "react-router-dom"
import DashboardHeader from "../components/DashboardHeader"
import DiscoverCard from "../components/DiscoverCard"
import OverviewCard from "../components/OverviewCard"
import ProfileCard from "../components/ProfileCard"

const DUMMY_CANDIDATE = {
    name: "Alex Johnson",
}

export default function CandidateDashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">
            <DashboardHeader name={DUMMY_CANDIDATE.name} />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 relative">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(20,184,166,0.08),transparent)]" />

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-white">
                        Welcome back, <span className="text-teal-400">{DUMMY_CANDIDATE.name.split(" ")[0]}</span>
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">Here's what's happening with your job search</p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <DiscoverCard />
                    <OverviewCard />
                    <Link
                        to="/app/candidate/applications"
                        className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900/60 p-6 hover:border-teal-500/50 hover:bg-stone-900 transition-colors"
                    >
                        <div>
                            <h2 className="text-base font-semibold text-white">Overview of Applications</h2>
                            <p className="mt-1 text-sm text-stone-500">Track the status of all your job applications</p>
                        </div>
                        <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-teal-400">
                            View applications <span aria-hidden>→</span>
                        </span>
                    </Link>
                    <ProfileCard />
                </div>
            </main>
        </div>
    )
}
