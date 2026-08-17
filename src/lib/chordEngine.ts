import { type ChordMatch, computeChroma, computeRms, matchChord } from './chordDetector'

export type DetectionPhase = 'idle' | 'listening' | 'analyzing' | 'detected'

export interface DetectionState {
  phase: DetectionPhase
  chord: ChordMatch | null
  detectedAt: number | null
  level: number
}

type FrameLabel =
  | { kind: 'silence' }
  | { kind: 'noise' }
  | { kind: 'chord'; match: ChordMatch }

const WINDOW_SIZE = 24
const CONFIRM_SHARE = 0.5
const CONFIRM_MIN_COUNT = 8
const SOUND_ON_RMS = 0.02
const SOUND_OFF_RMS = 0.012
const MIN_CHORD_SCORE = 0.55
const FFT_SIZE = 8192

export const INITIAL_DETECTION_STATE: DetectionState = {
  phase: 'idle',
  chord: null,
  detectedAt: null,
  level: 0,
}

/**
 * Wraps the mic + AnalyserNode plumbing and turns a noisy per-frame chord
 * guess into a stable reading: it keeps a short rolling window of per-frame
 * labels (chord symbol / "noise" / "silence") and only "confirms" a chord
 * once it dominates that window, which is what drives the
 * listening -> analyzing -> detected UI states.
 */
export class ChordEngine {
  private audioCtx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private stream: MediaStream | null = null
  private rafId = 0
  private timeData = new Float32Array(0)
  private freqData = new Float32Array(0)
  private window: FrameLabel[] = []
  private soundActive = false
  private smoothedLevel = 0
  private confirmedChord: ChordMatch | null = null
  private detectedAt: number | null = null
  private readonly onUpdate: (state: DetectionState) => void

  constructor(onUpdate: (state: DetectionState) => void) {
    this.onUpdate = onUpdate
  }

  async start() {
    this.stop()

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    })
    this.audioCtx = new AudioContext()
    const source = this.audioCtx.createMediaStreamSource(this.stream)
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.fftSize = FFT_SIZE
    this.analyser.smoothingTimeConstant = 0.65
    source.connect(this.analyser)

    this.timeData = new Float32Array(this.analyser.fftSize)
    this.freqData = new Float32Array(this.analyser.frequencyBinCount)
    this.window = []
    this.soundActive = false
    this.smoothedLevel = 0
    this.confirmedChord = null
    this.detectedAt = null

    this.onUpdate({ phase: 'listening', chord: null, detectedAt: null, level: 0 })
    this.tick()
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = 0
    this.stream?.getTracks().forEach((track) => track.stop())
    void this.audioCtx?.close()
    this.audioCtx = null
    this.analyser = null
    this.stream = null
    this.window = []
    this.confirmedChord = null
    this.detectedAt = null
    this.onUpdate(INITIAL_DETECTION_STATE)
  }

  private tick = () => {
    if (!this.analyser || !this.audioCtx) return

    this.analyser.getFloatTimeDomainData(this.timeData)
    this.analyser.getFloatFrequencyData(this.freqData)

    const rms = computeRms(this.timeData)
    if (this.soundActive) {
      if (rms < SOUND_OFF_RMS) this.soundActive = false
    } else if (rms > SOUND_ON_RMS) {
      this.soundActive = true
    }

    let label: FrameLabel
    if (!this.soundActive) {
      label = { kind: 'silence' }
    } else {
      const chroma = computeChroma(this.freqData, this.audioCtx.sampleRate, this.analyser.fftSize)
      const match = matchChord(chroma, MIN_CHORD_SCORE)
      label = match ? { kind: 'chord', match } : { kind: 'noise' }
    }

    this.window.push(label)
    if (this.window.length > WINDOW_SIZE) this.window.shift()

    const resolved = this.resolvePhase()
    if (resolved.phase === 'detected' && resolved.chord.symbol !== this.confirmedChord?.symbol) {
      this.confirmedChord = resolved.chord
      this.detectedAt = performance.now()
    }

    this.smoothedLevel = this.smoothedLevel * 0.75 + Math.min(1, rms * 6) * 0.25

    this.onUpdate({
      phase: resolved.phase,
      chord: this.confirmedChord,
      detectedAt: this.detectedAt,
      level: this.smoothedLevel,
    })

    this.rafId = requestAnimationFrame(this.tick)
  }

  private resolvePhase():
    | { phase: 'listening' | 'analyzing'; chord: null }
    | { phase: 'detected'; chord: ChordMatch } {
    if (this.window.length === 0) return { phase: 'listening', chord: null }

    const counts = new Map<string, { count: number; label: FrameLabel }>()
    for (const label of this.window) {
      const key = label.kind === 'chord' ? `chord:${label.match.symbol}` : label.kind
      const entry = counts.get(key)
      if (entry) entry.count += 1
      else counts.set(key, { count: 1, label })
    }

    let top: { count: number; label: FrameLabel } | null = null
    for (const entry of counts.values()) {
      if (!top || entry.count > top.count) top = entry
    }
    if (!top) return { phase: 'listening', chord: null }

    const share = top.count / this.window.length
    if (top.label.kind === 'silence' && share >= CONFIRM_SHARE) {
      return { phase: 'listening', chord: null }
    }
    if (top.label.kind === 'chord' && share >= CONFIRM_SHARE && top.count >= CONFIRM_MIN_COUNT) {
      return { phase: 'detected', chord: top.label.match }
    }
    return { phase: 'analyzing', chord: null }
  }
}
