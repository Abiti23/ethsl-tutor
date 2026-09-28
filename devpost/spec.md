# Spec — EthSL Tutor (proof of concept)

## How it is built
A **static website**: plain HTML + CSS + JavaScript. No server, no database, no API keys, no build tools. This keeps it free to host (GitHub Pages) and easy to open on a Chromebook or phone.

## Files
- `index.html` — the whole app: 4 tabs (Learn / Quiz / Camera / About).
- `styles.css` — mobile-first, high-contrast dark theme.
- `lessons.js` — the 12 words as data (English, Amharic, pronunciation).
- `app.js` — tab switching, flip cards, quiz engine, camera hand tracking.
- `devpost/` — this planning folder (learner-profile, scope, prd, spec, checklist, app-map).

## Hand tracking (the technical core)
- Library: **MediaPipe Hands** (JavaScript), loaded on demand from the jsDelivr CDN. Runs fully in the browser, on-device — no video ever leaves the phone.
- Each video frame: MediaPipe returns 21 hand landmarks. We count extended fingers: for index/middle/ring/pinky, the fingertip is "extended" when it is above its middle knuckle; for the thumb, when the tip is far from the index base.
- Open palm = 4–5 fingers extended. Fist = 0–1 extended.
- A hold counts when the shape is held continuously for ~1.2 seconds (prevents flicker false-positives).
- The video is mirrored (selfie view) and the hand skeleton is drawn on a canvas overlay.

## Data flow
`lessons.js` → rendered into cards (Learn) and shuffled into questions (Quiz). Camera frames → MediaPipe → landmark list → finger count → exercise check → status text.

## Run instructions
1. Open `index.html` in any modern browser (or serve the folder: `python3 -m http.server`).
2. Camera tab needs HTTPS or `localhost` for camera permission, plus internet the first time (to load MediaPipe from CDN).

## Tradeoffs
- MediaPipe instead of a custom model: free, no training data, works today. Downside: only 2 hand shapes in this PoC, not full sign recognition.
- Static site instead of an app framework: simpler, but no offline support yet.
