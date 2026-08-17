import { useCallback, useEffect, useRef, useState } from 'react'
import { ChordEngine, type DetectionState, INITIAL_DETECTION_STATE } from '../lib/chordEngine'

export function useChordListener() {
  const [state, setState] = useState<DetectionState>(INITIAL_DETECTION_STATE)
  const [error, setError] = useState<string | null>(null)
  const engineRef = useRef<ChordEngine | null>(null)

  useEffect(() => {
    engineRef.current = new ChordEngine(setState)
    return () => engineRef.current?.stop()
  }, [])

  const start = useCallback(async () => {
    setError(null)
    try {
      await engineRef.current?.start()
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Microphone access was denied. Allow mic access in your browser settings and try again.'
          : 'Could not access the microphone. Check that a mic is connected and try again.'
      setError(message)
      setState(INITIAL_DETECTION_STATE)
    }
  }, [])

  const stop = useCallback(() => {
    engineRef.current?.stop()
  }, [])

  return { state, error, start, stop }
}
