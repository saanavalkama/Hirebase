import { Link, NavLink } from "react-router-dom"

const navLinks = [
    { label: "Dashboard", to: "/recruiter" },
    { label: "Postings", to: "/recruiter/postings" },
    { label: "Candidates", to: "/recruiter/candidates" },
    { label: "Kanban", to: "/recruiter/kanban" },
]

export default function RecruiterHeader({ name }: { name: string }) {
    return (
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#18181f]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-xl font-semibold tracking-tight">
                        <span className="text-teal-400">Hire</span>base
                    </Link>
                    <nav className="flex items-center gap-1">
                        {navLinks.map(({ label, to }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-white/[0.08] text-white"
                                            : "text-stone-400 hover:text-stone-100 hover:bg-white/[0.05]"
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400 text-sm font-semibold">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-stone-300 font-medium">{name}</span>
                </div>
            </div>
        </header>
    )
}
