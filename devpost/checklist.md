# Build checklist — EthSL Tutor (proof of concept)

- [x] Scope: idea, kernel, and definition of done written (`scope.md`)
- [x] PRD: screens, behavior, edge cases, now/later (`prd.md`)
- [x] Spec: static site + MediaPipe hand tracking plan (`spec.md`)
- [x] `lessons.js`: 12 everyday words (English + Amharic + pronunciation)
- [x] `index.html`: 4 tabs, word cards, quiz, camera, about, video embed
- [x] `styles.css`: mobile-first dark theme
- [x] `app.js`: tab nav, flip cards, quiz engine (10 Qs, shuffled, scored), camera practice
- [x] Camera: open-palm and fist detection, 1.2s hold, correct-hold counter, on-device only
- [x] JS syntax check passes (`node --check`)
- [ ] Open on a real phone: Learn cards flip, quiz completes, camera detects both shapes
- [ ] Public GitHub repo created with all files + `devpost/` docs
- [ ] 1–3 min demo video recorded showing the app working
- [ ] Devpost submission written (by me, in my own words) + exit survey done

## Learning wrap-up
Planning first (scope → PRD → spec) made the build calmer: I knew exactly what "done" meant before writing code, so I didn't wander. The hand-tracking math (fingertip vs knuckle) was the one genuinely new thing — it turned out to be simple geometry, not magic. Next time I would test on my phone earlier.
