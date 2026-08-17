import { cx } from '../lib/cx'
import type { DetectionPhase } from '../lib/chordEngine'
import type { ChordMatch } from '../lib/chordDetector'

interface ChordCardProps {
  chord: ChordMatch | null
  phase: DetectionPhase
  detectedAt: number | null
}

export function ChordCard({ chord, phase, detectedAt }: ChordCardProps) {
  const isFresh = phase === 'detected'

  if (!chord) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.03] px-6 text-center">
        <p className="text-lg text-white/45">No chord yet</p>
        <p className="mt-1.5 max-w-xs text-sm text-white/25">
          Strum an open or barre chord clearly and let it ring for a second.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cx(
        'relative flex h-48 flex-col items-center justify-center overflow-hidden rounded-3xl border px-6 transition-colors duration-500',
        isFresh
          ? 'border-amber-glow/35 bg-gradient-to-b from-amber-glow/[0.08] to-transparent'
          : 'border-white/5 bg-white/[0.02] opacity-70',
      )}
    >
      <div key={detectedAt ?? chord.symbol} className="animate-rise-in text-center">
        <p className="text-6xl font-bold tracking-tight text-white sm:text-7xl">{chord.symbol}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-glow/80">
          {chord.quality.label}
        </p>
      </div>

      <div className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-glow to-ember transition-[width] duration-300"
          style={{ width: `${Math.round(chord.score * 100)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] uppercase tracking-widest text-white/30">
        {Math.round(chord.score * 100)}% match
      </p>
    </div>
  )
}
