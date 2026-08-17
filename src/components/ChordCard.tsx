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
      <div className="flex h-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-center sm:h-24">
        <p className="text-sm text-white/45 sm:text-base">No chord yet</p>
        <p className="mt-0.5 max-w-xs text-xs text-white/25">Strum a chord and let it ring.</p>
      </div>
    )
  }

  return (
    <div
      className={cx(
        'flex h-20 shrink-0 items-center justify-center gap-5 overflow-hidden rounded-2xl border px-6 transition-colors duration-500 sm:h-24',
        isFresh
          ? 'border-amber-glow/35 bg-gradient-to-b from-amber-glow/[0.08] to-transparent'
          : 'border-white/5 bg-white/[0.02] opacity-70',
      )}
    >
      <div key={detectedAt ?? chord.symbol} className="animate-rise-in text-center leading-none">
        <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{chord.symbol}</p>
      </div>

      <div className="flex flex-col items-start gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-glow/80">
          {chord.quality.label}
        </p>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-glow to-ember transition-[width] duration-300"
            style={{ width: `${Math.round(chord.score * 100)}%` }}
          />
        </div>
        <p className="text-[10px] uppercase tracking-widest text-white/30">
          {Math.round(chord.score * 100)}% match
        </p>
      </div>
    </div>
  )
}
