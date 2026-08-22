import type { DetectionPhase } from '../lib/chordEngine'

const COPY: Record<DetectionPhase, string> = {
  idle: 'Press start and play a chord',
  listening: 'Listening — strum a chord',
  analyzing: 'Identifying chord',
  detected: 'Chord detected',
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-1.5 w-1.5 rounded-full bg-amber-glow animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}

export function StatusLine({ phase }: { phase: DetectionPhase }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-white/60">
      <span>{COPY[phase]}</span>
      {phase === 'analyzing' && <ThinkingDots />}
    </div>
  )
}
