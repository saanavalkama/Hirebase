import { Link } from "react-router-dom"

export default function ProfileCard() {
    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-white">Profile</h2>
                <p className="mt-1 text-sm text-stone-400">Manage your candidate profile</p>
            </div>
            <div className="flex-1 flex items-center justify-center py-6">
                <p className="text-sm text-stone-600">Complete your profile to improve matches</p>
            </div>
            <Link
                to="/profile/edit"
                className="flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors mt-auto"
            >
                Edit profile
                <span className="text-base leading-none">→</span>
            </Link>
        </div>
    )
}
