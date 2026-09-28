# EthSL Tutor

A small, working proof of concept that helps hearing family members in Ethiopia
learn everyday sign-language words — built for the **Build With AI: Basics** hackathon.

## What it does
- 📖 **Learn** — 12 everyday words as flip cards in English + Amharic (አማርኛ),
  with a demo video as the visual sign reference.
- ❓ **Quiz** — 10 shuffled multiple-choice questions (both directions), score + kind feedback.
- ✋ **Camera practice** — the app watches your hand (on-device hand tracking)
  and tells you if your open palm / fist is correct. Nothing is recorded or uploaded.
- ℹ️ **About** — who built it, and an honest note: verify every sign with a Deaf teacher.

## Run it
No build step, no server, no API keys. Just open `index.html` in a modern browser.
(The camera tab needs HTTPS or `localhost`, plus internet the first time to load
the hand-tracking library from CDN.)

Or serve it locally:
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Planning docs
The `devpost/` folder holds the full plan-first trail:
`learner-profile.md` → `scope.md` → `prd.md` → `spec.md` → `checklist.md` → `app-map.html`.

## Honesty note
Sign language is visual and varies by community. This PoC teaches vocabulary and
hand-shape practice — it cannot replace learning from a Deaf signer.

## License
MIT — see `LICENSE`.
