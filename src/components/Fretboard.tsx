import { useMemo } from 'react'
import {
  DOUBLE_MARKER_FRET,
  FRET_COUNT,
  MARKER_FRETS,
  STRING_LABELS,
  STRING_OPEN_MIDI,
  pitchClassAt,
} from '../lib/fretboard'
import { roleForPitchClass, type ChordMatch } from '../lib/chordDetector'
import { ROLE_COLORS } from '../lib/roleColors'

const VIEW_W = 880
const VIEW_H = 240
const PAD_LEFT = 48
const PAD_RIGHT = 24
const PAD_TOP = 20
const PAD_BOTTOM = 36

const NECK_X0 = PAD_LEFT
const NECK_X1 = VIEW_W - PAD_RIGHT
const NECK_Y0 = PAD_TOP
const NECK_Y1 = VIEW_H - PAD_BOTTOM
const COL_WIDTH = (NECK_X1 - NECK_X0) / FRET_COUNT
const ROW_HEIGHT = (NECK_Y1 - NECK_Y0) / (STRING_OPEN_MIDI.length - 1)

/** Render rows top-to-bottom, high string (thin) to low string (thick) — matches standard tab layout. */
const RENDER_STRING_ORDER = [...STRING_OPEN_MIDI.keys()].reverse()

function xForWire(fretIndex: number) {
  return NECK_X0 + fretIndex * COL_WIDTH
}

function xForFret(fret: number) {
  return fret === 0 ? NECK_X0 - 18 : NECK_X0 + (fret - 0.5) * COL_WIDTH
}

function yForRow(row: number) {
  return NECK_Y0 + row * ROW_HEIGHT
}

function stringThickness(row: number) {
  return 1.1 + (row / (RENDER_STRING_ORDER.length - 1)) * 2.4
}

interface HighlightPoint {
  key: string
  x: number
  y: number
  role: string
  isRoot: boolean
}

export function Fretboard({ chord, detectedAt }: { chord: ChordMatch | null; detectedAt: number | null }) {
  const points = useMemo<HighlightPoint[]>(() => {
    if (!chord) return []
    const result: HighlightPoint[] = []
    RENDER_STRING_ORDER.forEach((stringIndex, row) => {
      for (let fret = 0; fret <= FRET_COUNT; fret++) {
        const pitchClass = pitchClassAt(stringIndex, fret)
        if (!chord.pitchClasses.includes(pitchClass)) continue
        const role = roleForPitchClass(chord, pitchClass)
        if (!role) continue
        result.push({
          key: `${stringIndex}-${fret}`,
          x: xForFret(fret),
          y: yForRow(row),
          role,
          isRoot: role === 'root',
        })
      }
    })
    return result
  }, [chord])

  return (
    <div className="min-h-0 shrink-0 rounded-2xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full" role="img" aria-label="Guitar fretboard">
        <defs>
          <linearGradient id="neckGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1e2b" />
            <stop offset="1" stopColor="#12131d" />
          </linearGradient>
          <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
          </filter>
        </defs>

        <rect
          x={NECK_X0 - 24}
          y={NECK_Y0 - 12}
          width={NECK_X1 - NECK_X0 + 24}
          height={NECK_Y1 - NECK_Y0 + 24}
          rx={16}
          fill="url(#neckGrad)"
        />

        {/* fret wires, 0 = nut */}
        {Array.from({ length: FRET_COUNT + 1 }, (_, i) => i).map((i) => (
          <line
            key={i}
            x1={xForWire(i)}
            x2={xForWire(i)}
            y1={NECK_Y0}
            y2={NECK_Y1}
            stroke={i === 0 ? '#e7e6ee' : '#3a3d4d'}
            strokeWidth={i === 0 ? 5 : 2}
            strokeLinecap="round"
          />
        ))}

        {/* inlay markers */}
        {[...MARKER_FRETS].map((fret) => (
          <circle key={fret} cx={xForFret(fret)} cy={(yForRow(2) + yForRow(3)) / 2} r={4} fill="#2c2f40" />
        ))}
        <circle cx={xForFret(DOUBLE_MARKER_FRET)} cy={(yForRow(0) + yForRow(1)) / 2} r={4} fill="#2c2f40" />
        <circle cx={xForFret(DOUBLE_MARKER_FRET)} cy={(yForRow(3) + yForRow(4)) / 2} r={4} fill="#2c2f40" />

        {/* strings */}
        {RENDER_STRING_ORDER.map((stringIndex, row) => (
          <line
            key={stringIndex}
            x1={NECK_X0 - 18}
            x2={NECK_X1}
            y1={yForRow(row)}
            y2={yForRow(row)}
            stroke="#8b8fa3"
            strokeWidth={stringThickness(row)}
            strokeLinecap="round"
          />
        ))}

        {/* string labels */}
        {RENDER_STRING_ORDER.map((stringIndex, row) => (
          <text
            key={stringIndex}
            x={NECK_X0 - 34}
            y={yForRow(row) + 4}
            fontSize={13}
            fontWeight={600}
            fill="#6b6f82"
            textAnchor="middle"
          >
            {STRING_LABELS[stringIndex]}
          </text>
        ))}

        {/* fret numbers */}
        {[3, 5, 7, 9, DOUBLE_MARKER_FRET].map((fret) => (
          <text
            key={fret}
            x={xForFret(fret)}
            y={NECK_Y1 + 24}
            fontSize={12}
            fill="#4b4e5f"
            textAnchor="middle"
          >
            {fret}
          </text>
        ))}

        {/* highlighted chord tones */}
        <g key={detectedAt ?? chord?.symbol ?? 'empty'}>
          {points.map((point, i) => (
            <g
              key={point.key}
              className="animate-dot-pop [transform-box:fill-box] [transform-origin:center]"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <circle cx={point.x} cy={point.y} r={point.isRoot ? 13 : 11} fill={ROLE_COLORS[point.role as keyof typeof ROLE_COLORS]} filter="url(#dotGlow)" opacity={0.55} />
              <circle
                cx={point.x}
                cy={point.y}
                r={point.isRoot ? 10 : 8}
                fill={ROLE_COLORS[point.role as keyof typeof ROLE_COLORS]}
                stroke="#0a0b12"
                strokeWidth={1.5}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
