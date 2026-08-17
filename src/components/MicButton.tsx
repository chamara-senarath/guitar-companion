import { cx } from '../lib/cx'
import type { DetectionPhase } from '../lib/chordEngine'
import { MicIcon, StopIcon } from './icons'

interface MicButtonProps {
  phase: DetectionPhase
  level: number
  onStart: () => void
  onStop: () => void
}

export function MicButton({ phase, level, onStart, onStop }: MicButtonProps) {
  const isActive = phase !== 'idle'
  const boost = 1 + Math.min(level, 1) * 0.08

  return (
    <button
      type="button"
      onClick={isActive ? onStop : onStart}
      aria-pressed={isActive}
      className={cx(
        'group relative flex h-24 w-24 items-center justify-center rounded-full outline-none transition-[background,box-shadow] duration-300 sm:h-28 sm:w-28',
        'focus-visible:ring-2 focus-visible:ring-amber-glow focus-visible:ring-offset-4 focus-visible:ring-offset-ink-950',
        isActive
          ? 'bg-gradient-to-br from-amber-glow to-ember shadow-[0_0_70px_-8px_rgba(245,185,66,0.55)]'
          : 'bg-ink-700 shadow-[0_0_40px_-18px_rgba(245,185,66,0.5)] hover:bg-ink-600',
      )}
      style={isActive ? { transform: `scale(${boost})` } : undefined}
    >
      {isActive && (
        <>
          <span className="absolute inset-0 rounded-full border-2 border-amber-glow/40 animate-pulse-ring" />
          <span
            className="absolute inset-0 rounded-full border-2 border-amber-glow/25 animate-pulse-ring"
            style={{ animationDelay: '0.6s' }}
          />
        </>
      )}
      <span
        className={cx(
          'relative z-10 flex flex-col items-center gap-1.5',
          isActive ? 'text-ink-950' : 'text-white/70 group-hover:text-white',
        )}
      >
        {isActive ? <StopIcon className="h-6 w-6" /> : <MicIcon className="h-7 w-7" />}
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
          {isActive ? 'Stop' : 'Start'}
        </span>
      </span>
    </button>
  )
}
