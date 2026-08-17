import { ChordCard } from './components/ChordCard'
import { ChordLegend } from './components/ChordLegend'
import { Fretboard } from './components/Fretboard'
import { LevelMeter } from './components/LevelMeter'
import { MicButton } from './components/MicButton'
import { StatusLine } from './components/StatusLine'
import { useChordListener } from './hooks/useChordListener'

function App() {
  const { state, error, start, stop } = useChordListener()

  return (
    <div className="mx-auto flex h-dvh max-w-5xl flex-col overflow-hidden px-4 py-3 sm:px-6 sm:py-4">
      <header className="flex flex-col items-center shrink-0 text-center">
        <div className="flex items-center gap-2 text-white/40">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-glow" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
            Guitar companion
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Fretwise</h1>
        <p className="mt-1 max-w-md text-xs text-white/40 sm:text-sm">
          Listens through your mic and tells you exactly what chord you just played.
        </p>
      </header>

      <main className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden sm:mt-4">
        {/* auto margins center this block when it's shorter than `main`, and
            gracefully fall back to top-aligned (no clipping/overlap) instead
            of bleeding into the header/footer when it's taller. */}
        <div className="my-auto grid w-full grid-cols-1 items-center gap-4 md:grid-cols-[200px_1fr] md:gap-6">
          <section className="flex flex-col items-center justify-center gap-2.5">
            <MicButton phase={state.phase} level={state.level} onStart={start} onStop={stop} />
            <StatusLine phase={state.phase} />
            <LevelMeter level={state.level} active={state.phase !== 'idle'} />
            {error && (
              <p className="max-w-[220px] text-center text-xs text-ember" role="alert">
                {error}
              </p>
            )}
          </section>

          <section className="flex min-h-0 flex-col gap-2.5 sm:gap-3">
            <ChordCard chord={state.chord} phase={state.phase} detectedAt={state.detectedAt} />
            <Fretboard chord={state.chord} detectedAt={state.detectedAt} />
            <ChordLegend chord={state.chord} />
          </section>
        </div>
      </main>

      <footer className="mt-2 shrink-0 text-center text-[11px] text-white/25 sm:mt-3">
        <p>
          Works best with clean, held strums in a quiet room — recognizes major, minor, 7th,
          maj7, min7, sus2, sus4, dim &amp; aug chords.
        </p>
      </footer>
    </div>
  )
}

export default App
