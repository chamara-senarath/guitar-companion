# Fretwise

Fretwise listens through your microphone and tells you what guitar chord you
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

This works best with a single, clean strum held for a second in a quiet room —
it's a lightweight signal-processing heuristic, not a trained model, so noisy
input or fast chord changes will be less reliable.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL in a browser and click **Start** — you'll be
prompted for microphone access.

## Building

```bash
npm run build
```

Outputs a static site to `dist/`. `vite.config.ts` uses `base: './'` so the
build works from any subpath, which is what makes GitHub Pages hosting
straightforward.

## Deploying to GitHub Pages

**Option A — GitHub Actions (recommended).** This repo includes
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds
and deploys on every push to `main`. One-time setup after pushing to GitHub:

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

Your site will be published at `https://<your-username>.github.io/<repo-name>/`.

**Option B — manual deploy with `gh-pages`.**

```bash
npm run deploy
```

This builds the app and pushes `dist/` to a `gh-pages` branch (via the
`gh-pages` package). Then point GitHub Pages at the `gh-pages` branch under
**Settings → Pages**.

## Browser support note

Microphone access via `getUserMedia` requires a secure context (HTTPS, or
`localhost` in dev) — GitHub Pages serves over HTTPS, so this is satisfied
automatically once deployed.
