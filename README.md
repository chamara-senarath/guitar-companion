# Guitar Companion

Guitar Companion listens through your microphone and tells you what guitar chord you
just played, in real time — with the matching notes lit up on an animated
fretboard. It's the first tool in what's meant to grow into a small set of
practice tools for guitar learners.

## How it works

There's no ML model or server involved — everything runs locally in the
browser:

1. The Web Audio API (`AnalyserNode`) reads the mic input and computes an FFT.
2. FFT bin energy is folded into a 12-bin **chromagram** (one bin per pitch
   class, C through B), ignoring octave — see
   [`src/lib/chordDetector.ts`](src/lib/chordDetector.ts).
3. The chromagram is compared (cosine similarity) against a library of chord
   templates — major, minor, 7th, maj7, min7, sus2, sus4, dim, aug, for all 12
   roots — and the best match above a confidence threshold wins.
4. A short rolling window of per-frame guesses is used to "confirm" a chord
   only once it's consistently the winner, which drives the
   listening → analyzing → detected states in the UI
   ([`src/lib/chordEngine.ts`](src/lib/chordEngine.ts)).
5. The confirmed chord's notes are mapped onto standard-tuning fret positions
   and highlighted on the fretboard SVG
   ([`src/components/Fretboard.tsx`](src/components/Fretboard.tsx)).

## What you see

A live input level meter, the currently detected chord with its confidence, the
chord's notes listed by role (root, third, fifth, etc.), and an animated
fretboard where the detected chord's notes light up across the fretboard. A
"Start" button prompts for microphone access.

## Tips for best results

This works best with a single, clean strum held for a second in a quiet room —
it's a lightweight signal-processing heuristic, not a trained model, so noisy
input or fast chord changes will be less reliable.

## Browser support note

Microphone access via `getUserMedia` requires a secure context (HTTPS, or
`localhost` when running locally), since the app relies on getting clean audio
input from your mic.