import { useEffect } from 'react'
import { ChordCard } from './components/ChordCard'
import { ChordLegend } from './components/ChordLegend'
import { Fretboard } from './components/Fretboard'
import { LevelMeter } from './components/LevelMeter'
import { MicButton } from './components/MicButton'
import { ShortcutHint } from './components/ShortcutHint'
import { StatusLine } from './components/StatusLine'
import { useChordListener } from './hooks/useChordListener'

function App() {
  const { state, error, start, stop } = useChordListener()
  const isActive = state.phase !== 'idle'

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space') return
      const target = event.target as HTMLElement | null
      if (target?.isContentEditable) return
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return

      event.preventDefault()
      if (isActive) stop()
      else start()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, start, stop])

  return (
    <div className="mx-auto flex h-dvh max-w-5xl flex-col overflow-hidden px-4 py-3 sm:px-6 sm:py-4">
      <header className="flex shrink-0 flex-col items-start text-left">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Guitar Companion
        </h1>
        <p className="mt-1 whitespace-nowrap text-[11px] text-white/40 sm:text-sm">
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
            <LevelMeter level={state.level} active={isActive} />
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
            <ShortcutHint isActive={isActive} />
          </section>
        </div>
      </main>

      <footer className="mt-2 shrink-0 text-center text-[11px] text-white/25 sm:mt-3">
        <p>
          Works best with clean, held strums in a quiet room — recognizes major, minor, 7th,
          maj7, min7, sus2, sus4, dim &amp; aug chords.
        </p>
        <p className="mt-1">Made with ♥ and creativity by Chamara Senarath</p>
      </footer>
    </div>
  )
}

export default App
