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
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 pb-16 pt-10 sm:pt-14">
      <header className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-white/40">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-glow" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em]">Guitar companion</span>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Fretwise</h1>
        <p className="mt-3 max-w-md text-sm text-white/45 sm:text-base">
          Listens through your microphone and tells you exactly what chord you just played — the
          first tool in a growing set of practice tools for guitar learners.
        </p>
      </header>

      <main className="mt-10 flex flex-1 flex-col items-center gap-8">
        <section className="flex flex-col items-center gap-4">
          <MicButton phase={state.phase} level={state.level} onStart={start} onStop={stop} />
          <StatusLine phase={state.phase} />
          <LevelMeter level={state.level} active={state.phase !== 'idle'} />
          {error && (
            <p className="max-w-sm text-center text-sm text-ember" role="alert">
              {error}
            </p>
          )}
        </section>

        <section className="w-full">
          <ChordCard chord={state.chord} phase={state.phase} detectedAt={state.detectedAt} />
        </section>

        <section className="w-full space-y-4">
          <Fretboard chord={state.chord} detectedAt={state.detectedAt} />
          <ChordLegend chord={state.chord} />
        </section>
      </main>

      <footer className="mt-14 flex flex-col items-center gap-1 text-center text-xs text-white/25">
        <p>Works best with clean, single strums in a quiet room — let the chord ring for a beat.</p>
        <p>Recognizes major, minor, 7th, maj7, min7, sus2, sus4, diminished and augmented chords.</p>
      </footer>
    </div>
  )
}

export default App
