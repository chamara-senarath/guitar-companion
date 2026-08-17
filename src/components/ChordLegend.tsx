import type { ChordMatch } from '../lib/chordDetector'
import type { NoteRole } from '../lib/music'
import { ROLE_COLORS, ROLE_LABELS } from '../lib/roleColors'

export function ChordLegend({ chord }: { chord: ChordMatch | null }) {
  if (!chord) return null

  const roles = Array.from(new Set(Object.values(chord.quality.roleForInterval))) as NoteRole[]

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
      {roles.map((role) => (
        <span key={role} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: ROLE_COLORS[role], boxShadow: `0 0 8px ${ROLE_COLORS[role]}` }}
          />
          {ROLE_LABELS[role]}
        </span>
      ))}
    </div>
  )
}
