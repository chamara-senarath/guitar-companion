export const PITCH_CLASSES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const

export type NoteRole = 'root' | 'second' | 'third' | 'fourth' | 'fifth' | 'seventh'

export type ChordQualityKey =
  | 'maj' | 'min' | 'dom7' | 'maj7' | 'min7' | 'sus2' | 'sus4' | 'dim' | 'aug'

export interface ChordQuality {
  key: ChordQualityKey
  /** Appended directly after the root note name, e.g. "" | "m" | "7" */
  suffix: string
  label: string
  /** Semitone offsets from the root, root (0) always included. */
  intervals: number[]
  roleForInterval: Partial<Record<number, NoteRole>>
}

export const CHORD_QUALITIES: ChordQuality[] = [
  { key: 'maj', suffix: '', label: 'Major', intervals: [0, 4, 7], roleForInterval: { 0: 'root', 4: 'third', 7: 'fifth' } },
  { key: 'min', suffix: 'm', label: 'Minor', intervals: [0, 3, 7], roleForInterval: { 0: 'root', 3: 'third', 7: 'fifth' } },
  { key: 'dom7', suffix: '7', label: 'Dominant 7th', intervals: [0, 4, 7, 10], roleForInterval: { 0: 'root', 4: 'third', 7: 'fifth', 10: 'seventh' } },
  { key: 'maj7', suffix: 'maj7', label: 'Major 7th', intervals: [0, 4, 7, 11], roleForInterval: { 0: 'root', 4: 'third', 7: 'fifth', 11: 'seventh' } },
  { key: 'min7', suffix: 'm7', label: 'Minor 7th', intervals: [0, 3, 7, 10], roleForInterval: { 0: 'root', 3: 'third', 7: 'fifth', 10: 'seventh' } },
  { key: 'sus2', suffix: 'sus2', label: 'Suspended 2nd', intervals: [0, 2, 7], roleForInterval: { 0: 'root', 2: 'second', 7: 'fifth' } },
  { key: 'sus4', suffix: 'sus4', label: 'Suspended 4th', intervals: [0, 5, 7], roleForInterval: { 0: 'root', 5: 'fourth', 7: 'fifth' } },
  { key: 'dim', suffix: 'dim', label: 'Diminished', intervals: [0, 3, 6], roleForInterval: { 0: 'root', 3: 'third', 6: 'fifth' } },
  { key: 'aug', suffix: 'aug', label: 'Augmented', intervals: [0, 4, 8], roleForInterval: { 0: 'root', 4: 'third', 8: 'fifth' } },
]

export function noteName(pitchClass: number): string {
  return PITCH_CLASSES[((pitchClass % 12) + 12) % 12]
}
