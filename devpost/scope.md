# Scope — EthSL Tutor (proof of concept)

## The idea
A tiny web app that helps hearing family members in Ethiopia learn everyday sign-language words. Three things: bilingual word cards (English + Amharic), a short quiz, and a camera mode that watches your hand and tells you if your hand shape (open palm / fist) is correct.

## The kernel
The heart of this PoC is **hand-shape practice with live camera feedback**. Word cards and quizzes teach vocabulary; the camera mode proves the learner's hands are doing the right thing — the first step toward real sign recognition.

## Done means
- A working web page a stranger can open on their phone, with no login and no install.
- 12 everyday words shown in English + Amharic (+ pronunciation help).
- A 10-question quiz that keeps score and gives kind feedback.
- Camera mode: detects an open palm and a fist, asks the learner to hold the shape ~1 second, and counts correct holds. Runs on-device; nothing is recorded.
- Public GitHub repo + 1–3 minute demo video showing it working.

## Out of scope (later, not now)
- Full sign-language dictionary with video per sign (needs Deaf teachers to verify every sign).
- AI chat tutor (needs an API key and money I don't have).
- Interpreter directory and booking (the bigger EthSL vision).
- Accounts, offline mode, more than 12 words.
