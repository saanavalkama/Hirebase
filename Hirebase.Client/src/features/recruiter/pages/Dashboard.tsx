import RecruiterHeader from "../components/RecruiterHeader"
import StatsCard from "../components/StatsCard"
import JobPostingsCard from "../components/JobPostingsCard"
import ProfileOrganizationsCard from "../components/ProfileOrganizationsCard"
import QuickActionsCard from "../components/QuickActionsCard"

const DUMMY_RECRUITER = {
    name: "Jordan Smith",
}

export default function RecruiterDashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">
            <RecruiterHeader name={DUMMY_RECRUITER.name} />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 relative">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(20,184,166,0.08),transparent)]" />

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-white">
                        Welcome back, <span className="text-teal-400">{DUMMY_RECRUITER.name.split(" ")[0]}</span>
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">Here's an overview of your recruiting activity</p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <StatsCard />
                    <JobPostingsCard />
                    <ProfileOrganizationsCard />
                    <QuickActionsCard />
                </div>
            </main>
        </div>
    )
}
