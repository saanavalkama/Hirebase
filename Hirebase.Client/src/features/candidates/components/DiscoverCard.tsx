import { Button } from "@/components/ui/button"

export default function DiscoverCard() {
    return (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-white">Discover</h2>
                <p className="mt-1 text-sm text-stone-400">Find your next opportunity</p>
            </div>
            <div className="flex-1" />
            <div className="flex flex-col gap-2">
                <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-full py-4 text-sm font-medium shadow-lg shadow-teal-500/20 transition-all">
                    CTE Match
                </Button>
                <Button
                    variant="ghost"
                    className="w-full border border-white/[0.08] text-stone-300 hover:text-white hover:bg-white/[0.06] rounded-full py-4 text-sm font-medium"
                >
                    Browse Jobs
                </Button>
            </div>
        </div>
    )
}
