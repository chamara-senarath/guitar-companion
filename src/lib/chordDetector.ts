import { CHORD_QUALITIES, type ChordQuality, noteName } from './music'

export interface ChordMatch {
  root: number
  quality: ChordQuality
  symbol: string
  label: string
  score: number
  pitchClasses: number[]
}

interface ChordTemplate {
  root: number
  quality: ChordQuality
  vector: number[]
  norm: number
}

const TEMPLATES: ChordTemplate[] = []
for (let root = 0; root < 12; root++) {
  for (const quality of CHORD_QUALITIES) {
    const vector = new Array(12).fill(0)
    for (const interval of quality.intervals) vector[(root + interval) % 12] = 1
    TEMPLATES.push({ root, quality, vector, norm: Math.sqrt(quality.intervals.length) })
  }
}

/** Root-mean-square amplitude of a time-domain buffer, used as a mic level / silence gate. */
export function computeRms(timeData: Float32Array): number {
  let sum = 0
  for (let i = 0; i < timeData.length; i++) sum += timeData[i] * timeData[i]
  return Math.sqrt(sum / timeData.length)
}

/**
 * Folds FFT bin energy into a 12-bin pitch-class histogram (a "chromagram").
 * Harmonics of a played note mostly land on pitch classes already in the
 * chord (octaves, fifths, major thirds), which is what makes this simple
 * fold-and-match approach work reasonably well for real strummed chords.
 */
export function computeChroma(
  freqData: Float32Array,
  sampleRate: number,
  fftSize: number,
  minFreq = 75,
  maxFreq = 4500,
): number[] {
  const chroma = new Array(12).fill(0)
  const binHz = sampleRate / fftSize
  const minBin = Math.max(1, Math.floor(minFreq / binHz))
  const maxBin = Math.min(freqData.length - 1, Math.ceil(maxFreq / binHz))

  for (let i = minBin; i <= maxBin; i++) {
    const db = freqData[i]
    if (!Number.isFinite(db) || db < -85) continue
    const freq = i * binHz
    const midi = 69 + 12 * Math.log2(freq / 440)
    const pitchClass = ((Math.round(midi) % 12) + 12) % 12
    chroma[pitchClass] += Math.pow(10, db / 20)
  }
  return chroma
}

/** Cosine similarity between the live chromagram and every chord template; returns the best match. */
export function matchChord(chroma: number[], minScore = 0.5): ChordMatch | null {
  const chromaNorm = Math.sqrt(chroma.reduce((sum, v) => sum + v * v, 0))
  if (chromaNorm < 1e-6) return null

  let best: { template: ChordTemplate; score: number } | null = null
  for (const template of TEMPLATES) {
    let dot = 0
    for (let i = 0; i < 12; i++) dot += chroma[i] * template.vector[i]
    const score = dot / (chromaNorm * template.norm)
    if (!best || score > best.score) best = { template, score }
  }
  if (!best || best.score < minScore) return null

  const { template } = best
  return {
    root: template.root,
    quality: template.quality,
    symbol: noteName(template.root) + template.quality.suffix,
    label: `${noteName(template.root)} ${template.quality.label}`,
    score: best.score,
    pitchClasses: template.quality.intervals.map((iv) => (template.root + iv) % 12),
  }
}

export function roleForPitchClass(match: ChordMatch, pitchClass: number) {
  const interval = ((pitchClass - match.root) % 12 + 12) % 12
  return match.quality.roleForInterval[interval] ?? null
}
