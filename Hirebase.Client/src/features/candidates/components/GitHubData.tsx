import type { GitHub } from '../../../types/types'
import { Button } from '@/components/ui/button'

interface Props {
  data?: GitHub
  onConnect?: () => void
  onRefresh?: () => void
}

function ScoreRing({ value, label }: { value: number; label: string }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(value / 100, 1))



  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke="rgb(45,212,191)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
          {Math.round(value)}
        </span>
      </div>
      <span className="text-[10px] text-stone-400 text-center leading-tight">{label}</span>
    </div>
  )
}

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

export default function GitHubData({ data, onConnect, onRefresh }: Props) {

  if (!data?.hasConnected) {
    return (
      <div className="mb-6 rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-6 flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
          <GitHubIcon className="w-5 h-5 text-stone-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-stone-200">Connect your GitHub</p>
          <p className="text-xs text-stone-500 mt-0.5">
            We'll analyze your activity to surface signals for recruiters
          </p>
        </div>
        <Button
          type="button"
          onClick={onConnect}
          size="sm"
          className="bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-full px-5"
        >
          Connect GitHub
        </Button>
      </div>
    )
  }

  if (data.fetchStatus === 'Pending' || data.fetchStatus === 'Processing') {
    return (
      <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 flex items-center gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
        <div>
          <p className="text-sm font-medium text-stone-200">Analyzing your GitHub…</p>
          <p className="text-xs text-stone-500 mt-0.5">
            {data.fetchStatus === 'Pending'
              ? 'Queued — this usually takes a minute'
              : 'Crunching your repos and commit history'}
          </p>
        </div>
      </div>
    )
  }

  if (data.fetchStatus === 'Failed') {
    return (
      <div className="mb-6 rounded-2xl border border-red-900/40 bg-red-950/20 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-200">GitHub analysis failed</p>
          <p className="text-xs text-stone-500 mt-0.5">Something went wrong — you can try again</p>
        </div>
        <Button
          type="button"
          onClick={onConnect}
          size="sm"
          variant="outline"
          className="text-xs border-red-800/50 text-red-400 hover:bg-red-950/40"
        >
          Retry
        </Button>
      </div>
    )
  }

  const { signals, nextRefreshAvailable } = data
  const canRefresh = new Date(nextRefreshAvailable) <= new Date()

  return (
    <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitHubIcon className="w-4 h-4 text-teal-400" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-400">
            GitHub signals
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-stone-500">
            Analysed {new Date(signals.calculatedAt).toLocaleDateString()}
          </span>
          {canRefresh && (
            <Button
              type="button"
              onClick={onRefresh}
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[10px] text-teal-400 hover:bg-teal-950/40"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-end justify-around">
        <ScoreRing value={signals.activityScore} label="Activity" />
        <ScoreRing value={signals.popularityScore} label="Popularity" />
        <ScoreRing value={signals.repoMaturityScore} label="Repo maturity" />
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 flex items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03]">
            <span className="text-xl font-bold text-white">{signals.externalPrCount}</span>
          </div>
          <span className="text-[10px] text-stone-400 text-center leading-tight">External PRs</span>
        </div>
      </div>

      {signals.topLanguages.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-2">
            Top languages
          </p>
          <div className="flex flex-wrap gap-1.5">
            {signals.topLanguages.map((lang) => (
              <span
                key={lang}
                className="text-xs px-2.5 py-0.5 rounded-full bg-teal-950/50 border border-teal-800/40 text-teal-300"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
