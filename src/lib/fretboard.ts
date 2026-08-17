/** Standard tuning, ordered low string (6, thickest) to high string (1, thinnest). */
export const STRING_OPEN_MIDI = [40, 45, 50, 55, 59, 64] as const // E2 A2 D3 G3 B3 E4
export const STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'E'] as const
export const FRET_COUNT = 12
export const MARKER_FRETS = new Set([3, 5, 7, 9])
export const DOUBLE_MARKER_FRET = 12

export function pitchClassAt(stringIndex: number, fret: number): number {
  return ((STRING_OPEN_MIDI[stringIndex] + fret) % 12 + 12) % 12
}
