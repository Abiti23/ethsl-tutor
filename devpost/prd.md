# PRD — EthSL Tutor (proof of concept)

## Who it is for
Hearing family members of Deaf people in Ethiopia, mostly beginners, mostly on phones.

## Screens (tabs)
1. **Learn** — grid of 12 word cards (English word). Tap a card to flip it: Amharic word (Ethiopic script) + pronunciation hint. A demo video is embedded at the top as the visual sign reference. A short practice tip sits below.
2. **Quiz** — "Start quiz" button → 10 questions, each multiple choice with 4 options. Questions go both directions (English→Amharic and Amharic→English), shuffled. After answering: correct answers turn green, wrong answers turn red and the right one is highlighted, with kind feedback. End screen shows score + encouragement + "Try again".
3. **Camera** — exercise picker (Open palm / Fist), Start/Stop camera buttons, live video with hand-skeleton overlay, status line with instructions and feedback, counter of correct holds. Requires holding the shape ~1.2 seconds to count as correct.
4. **About** — what the app is, who built it, the honest note (verify signs with a Deaf teacher), and the privacy note (camera never leaves the device).

## Behavior & edge cases
- No login, no backend, no build step: open `index.html` and it works.
- If the camera library (CDN) fails to load: show a clear message, other tabs keep working.
- If the user denies camera permission: show what went wrong in plain words.
- If no hand is visible: status says "Show your hand to the camera…".
- Quiz always has exactly 4 options, 1 correct; questions and options are shuffled every run.

## Now vs later
- NOW: 12 words, quiz, 2 hand shapes, real sign videos per word demo, phone-friendly design.
- LATER: more words, more hand shapes, AI tutor chat, interpreter directory, offline support.
