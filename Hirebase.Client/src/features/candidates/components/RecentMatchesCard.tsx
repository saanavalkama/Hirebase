import { Link } from "react-router-dom"

export default function RecentMatchesCard() {
    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-white">Recent Matches</h2>
                <p className="mt-1 text-sm text-stone-400">Companies interested in your profile</p>
            </div>
            <div className="flex-1 flex items-center justify-center py-6">
                <p className="text-sm text-stone-600">No matches yet</p>
            </div>
            <Link
                to="/matches"
                className="flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors mt-auto"
            >
                View all matches
                <span className="text-base leading-none">→</span>
            </Link>
        </div>
    )
}
