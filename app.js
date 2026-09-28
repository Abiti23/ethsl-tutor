/* EthSL Tutor — app logic. No build step, no backend, no API keys.
   Camera hand tracking uses MediaPipe Hands, loaded on demand from CDN,
   and runs 100% on-device. */

(function () {
  "use strict";

  /* ---------- Tabs ---------- */
  var tabButtons = document.querySelectorAll(".tabs button");
  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      document.querySelectorAll("main section").forEach(function (s) { s.hidden = true; });
      document.getElementById("tab-" + btn.dataset.tab).hidden = false;
      if (btn.dataset.tab === "camera") { /* camera starts only on button press */ }
    });
  });

  /* ---------- Learn: flip cards ---------- */
  var cardsEl = document.getElementById("cards");
  document.getElementById("practiceTip").textContent = PRACTICE_TIP;
  LESSONS.forEach(function (w) {
    var card = document.createElement("div");
    card.className = "card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    function render() {
      if (card.dataset.side === "back") {
        card.innerHTML = '<div class="back-am">' + w.am + '</div>' +
                         '<div class="back-say">' + w.say + '</div>' +
                         '<div class="front-hint">tap to flip back</div>';
      } else {
        card.innerHTML = '<div class="front-en">' + w.en + '</div>' +
                         '<div class="front-hint">tap to see አማርኛ</div>';
      }
    }
    card.addEventListener("click", function () {
      card.dataset.side = card.dataset.side === "back" ? "front" : "back";
      render();
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
    });
    render();
    cardsEl.appendChild(card);
  });

  /* ---------- Quiz ---------- */
  var QUIZ_LEN = 10;
  var qList = [], qIndex = 0, qScore = 0;

  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function makeQuestion() {
    var word = qList[qIndex];
    var enToAm = Math.random() < 0.5; // direction: EN->AM or AM->EN
    var others = shuffled(LESSONS.filter(function (w) { return w !== word; })).slice(0, 3);
    var options = shuffled([word].concat(others));
    return { word: word, enToAm: enToAm, options: options };
  }
  function renderQuestion() {
    var q = makeQuestion();
    document.getElementById("quizProgress").textContent =
      "Question " + (qIndex + 1) + " of " + QUIZ_LEN;
    document.getElementById("quizQ").textContent = q.enToAm
      ? 'How do you say "' + q.word.en + '" in Amharic?'
      : 'What does "' + q.word.am + '" mean in English?';
    var box = document.getElementById("quizOptions");
    box.innerHTML = "";
    document.getElementById("quizFeedback").textContent = "";
    document.getElementById("quizFeedback").className = "feedback";
    q.options.forEach(function (opt) {
      var b = document.createElement("button");
      b.textContent = q.enToAm ? opt.am : opt.en;
      b.addEventListener("click", function () {
        var ok = opt === q.word;
        box.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
        if (ok) {
          qScore++;
          b.classList.add("correct");
          var fb = document.getElementById("quizFeedback");
          fb.textContent = "✅ Correct! Well done.";
          fb.classList.add("good");
        } else {
          b.classList.add("wrong");
          box.querySelectorAll("button").forEach(function (x) {
            if (x.textContent === (q.enToAm ? q.word.am : q.word.en)) x.classList.add("correct");
          });
          var fb2 = document.getElementById("quizFeedback");
          fb2.textContent = "Not quite — the answer is highlighted. You'll get the next one!";
          fb2.classList.add("bad");
        }
        setTimeout(function () {
          qIndex++;
          if (qIndex < QUIZ_LEN) renderQuestion(); else endQuiz();
        }, 1400);
      });
      box.appendChild(b);
    });
  }
  function endQuiz() {
    document.getElementById("quizPlay").hidden = true;
    document.getElementById("quizEnd").hidden = false;
    document.getElementById("quizScore").textContent =
      "You scored " + qScore + " / " + QUIZ_LEN;
    document.getElementById("quizPraise").textContent =
      qScore >= 8 ? "Amazing! You are really learning." :
      qScore >= 5 ? "Good progress — keep practicing!" :
                    "A great start. Try the Learn tab, then come back!";
  }
  document.getElementById("quizBegin").addEventListener("click", function () {
    qList = shuffled(LESSONS).slice(0, QUIZ_LEN);
    qIndex = 0; qScore = 0;
    document.getElementById("quizStart").hidden = true;
    document.getElementById("quizEnd").hidden = true;
    document.getElementById("quizPlay").hidden = false;
    renderQuestion();
  });
  document.getElementById("quizAgain").addEventListener("click", function () {
    document.getElementById("quizBegin").click();
  });

  /* ---------- Camera practice: hand-shape detection ---------- */
  var MP = {
    hands: "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js",
    cameraUtils: "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675466862/camera_utils.js",
    drawing: "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1675466124/drawing_utils.js"
  };
  var exercise = "palm"; // or "fist"
  var running = false, mpHands = null, mpCamera = null, mpLoaded = false;
  var holdStart = 0, wins = 0;
  var HOLD_MS = 1200;

  document.querySelectorAll("#exerciseSeg button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#exerciseSeg button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      exercise = btn.dataset.ex;
      holdStart = 0;
      setStatus(exercise === "palm" ? "Show an open palm ✋ to the camera." : "Make a fist ✊ to the camera.", "");
    });
  });

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.onload = resolve;
      s.onerror = function () { reject(new Error("failed to load " + src)); };
      document.head.appendChild(s);
    });
  }
  function setStatus(text, cls) {
    var el = document.getElementById("camStatus");
    el.textContent = text;
    el.className = "cam-status" + (cls ? " " + cls : "");
  }

  // Count extended fingers from hand landmarks.
  // Landmark ids: thumb 2/3/4, index 5/6/7/8, middle 9/10/11/12, ring 13/14/15/16, pinky 17/18/19/20.
  function countExtended(lm) {
    var count = 0;
    var fingers = [[8, 6], [12, 10], [16, 14], [20, 18]]; // [tip, pip]
    fingers.forEach(function (f) {
      if (lm[f[0]].y < lm[f[1]].y) count++; // tip above knuckle = extended
    });
    // Thumb: extended if tip is far from index base (works for either hand).
    var dx = Math.abs(lm[4].x - lm[5].x);
    var dy = Math.abs(lm[4].y - lm[5].y);
    var handSize = Math.abs(lm[0].y - lm[9].y) || 1;
    if (Math.sqrt(dx * dx + dy * dy) / handSize > 0.55) count++;
    return count;
  }

  function onResults(results) {
    var video = document.getElementById("camVideo");
    var canvas = document.getElementById("camCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Mirror the drawing to match the mirrored video.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      var lm = results.multiHandLandmarks[0];
      if (window.drawConnectors && window.drawLandmarks && window.HAND_CONNECTIONS) {
        drawConnectors(ctx, lm, HAND_CONNECTIONS, { color: "#12b76a", lineWidth: 3 });
        drawLandmarks(ctx, lm, { color: "#ffffff", lineWidth: 1, radius: 3 });
      }
      var n = countExtended(lm);
      var target = exercise === "palm" ? 5 : 0;
      var match = exercise === "palm" ? n >= 4 : n <= 1;
      var now = Date.now();
      if (match) {
        if (!holdStart) holdStart = now;
        var left = Math.ceil((HOLD_MS - (now - holdStart)) / 1000);
        if (now - holdStart >= HOLD_MS) {
          wins++;
          document.getElementById("camWins").textContent = wins;
          holdStart = 0;
          setStatus(wins === 1 ? "✅ Perfect! Hold it again." :
                    "✅ Excellent! " + wins + " correct holds. Keep going!", "ok");
        } else {
          setStatus("Hold it... " + left + "s", "ok");
        }
      } else {
        holdStart = 0;
        setStatus("I see " + n + " fingers up — " +
          (exercise === "palm" ? "open your palm wider ✋" : "close your hand into a fist ✊"), "");
      }
      void target;
    } else {
      holdStart = 0;
      setStatus("Show your hand to the camera…", "");
    }
    ctx.restore();
  }

  document.getElementById("camStart").addEventListener("click", function () {
    if (running) return;
    setStatus("Loading hand tracking… (needs internet the first time)", "");
    var chain = mpLoaded ? Promise.resolve() :
      loadScript(MP.drawing).then(function () { return loadScript(MP.hands); })
                           .then(function () { return loadScript(MP.cameraUtils); })
                           .then(function () { mpLoaded = true; });
    chain.then(function () {
      var video = document.getElementById("camVideo");
      mpHands = new Hands({ locateFile: function (f) {
        return "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/" + f;
      }});
      mpHands.setOptions({ maxNumHands: 1, modelComplexity: 0,
        minDetectionConfidence: 0.6, minTrackingConfidence: 0.5 });
      mpHands.onResults(onResults);
      mpCamera = new Camera(video, {
        onFrame: function () { mpHands.send({ image: video }); },
        width: 640, height: 480
      });
      return mpCamera.start();
    }).then(function () {
      running = true;
      document.getElementById("camStart").disabled = true;
      document.getElementById("camStop").disabled = false;
      setStatus(exercise === "palm" ? "Show an open palm ✋ to the camera." : "Make a fist ✊ to the camera.", "");
    }).catch(function (err) {
      setStatus("Could not start the camera: " + (err && err.message ? err.message : err) +
        ". Please allow camera access and check your internet.", "");
    });
  });

  document.getElementById("camStop").addEventListener("click", function () {
    if (mpCamera) { try { mpCamera.stop(); } catch (e) {} mpCamera = null; }
    var video = document.getElementById("camVideo");
    if (video.srcObject) { video.srcObject.getTracks().forEach(function (t) { t.stop(); }); video.srcObject = null; }
    if (mpHands) { try { mpHands.close(); } catch (e) {} mpHands = null; }
    running = false; holdStart = 0;
    document.getElementById("camStart").disabled = false;
    document.getElementById("camStop").disabled = true;
    setStatus("Camera stopped.", "");
  });
})();
