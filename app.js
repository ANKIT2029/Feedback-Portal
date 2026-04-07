/* ============================================================
   PeopleOS HR App — js/app.js
   All UI logic, state management and interactions.

   Sections:
     1. App State
     2. Navigation
     3. Live Clock (Attendance)
     4. Check In / Out
     5. Star Rating (Feedback)
     6. Colleague Selector (Feedback)
     7. Feedback Tab Switcher
     8. Training Tab Switcher
     9. Submit Feedback
    10. Quiz System
    11. Toast Notification
    12. App Init
   ============================================================ */


/* ──────────────────────────────────────────────────────────
   1. APP STATE
   ────────────────────────────────────────────────────────── */
let checkedIn        = true;   // Employee currently checked in
let currentRating    = 0;      // Feedback star rating (1–5)
let selectedColleague = null;  // Name of selected colleague for feedback

let currentQuiz = null;  // Array of questions for active quiz
let currentQIdx = 0;     // Current question index in quiz


/* ──────────────────────────────────────────────────────────
   2. NAVIGATION
   Switches active screen and updates bottom nav highlight.
   ────────────────────────────────────────────────────────── */
function navigate(page) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));

  // Deactivate all nav items
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  // Show target screen
  document.getElementById("screen-" + page).classList.add("active");

  // Highlight matching nav item (if it exists)
  const navEl = document.getElementById("nav-" + page);
  if (navEl) navEl.classList.add("active");

  // Start live clock when entering attendance screen
  if (page === "attendance") startClock();
}


/* ──────────────────────────────────────────────────────────
   3. LIVE CLOCK
   Updates the time display on the attendance screen every 10s.
   ────────────────────────────────────────────────────────── */
function startClock() {
  function tick() {
    const now  = new Date();
    let   h    = now.getHours();
    const m    = now.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12; // Convert to 12-hour format

    const timeEl  = document.getElementById("live-time");
    const ampmEl  = document.getElementById("live-ampm");
    if (timeEl) timeEl.textContent = h + ":" + String(m).padStart(2, "0");
    if (ampmEl) ampmEl.textContent = ampm;
  }

  tick(); // Run immediately
  setInterval(tick, 10000); // Then every 10 seconds
}


/* ──────────────────────────────────────────────────────────
   4. CHECK IN / OUT
   Toggles check-in state and updates the UI accordingly.
   ────────────────────────────────────────────────────────── */
function toggleCheckIn() {
  checkedIn = !checkedIn;

  const btn        = document.getElementById("checkin-btn");
  const badge      = document.getElementById("status-badge");
  const statusText = document.getElementById("status-text");

  if (checkedIn) {
    // ── Checked In State ──
    btn.classList.add("checked-in");
    btn.innerHTML = '<i class="fas fa-sign-out-alt"></i>&nbsp; Check Out';

    badge.style.background   = "rgba(46,212,122,0.12)";
    badge.style.color        = "var(--green)";
    badge.style.borderColor  = "rgba(46,212,122,0.3)";
    statusText.textContent   = "Checked In";

    showToast("✅ Checked In Successfully");
  } else {
    // ── Checked Out State ──
    btn.classList.remove("checked-in");
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i>&nbsp; Check In';

    badge.style.background   = "rgba(244,90,90,0.12)";
    badge.style.color        = "var(--red)";
    badge.style.borderColor  = "rgba(244,90,90,0.3)";
    statusText.textContent   = "Checked Out";

    showToast("👋 Checked Out. Have a great day!");
  }
}


/* ──────────────────────────────────────────────────────────
   5. STAR RATING
   Highlights stars up to the selected rating.
   ────────────────────────────────────────────────────────── */
function rateStar(n) {
  currentRating = n;
  document.querySelectorAll(".star").forEach((star, index) => {
    star.classList.toggle("active", index < n);
  });
}


/* ──────────────────────────────────────────────────────────
   6. COLLEAGUE SELECTOR
   Highlights selected colleague avatar in the feedback form.
   ────────────────────────────────────────────────────────── */
function selectColleague(el, name) {
  selectedColleague = name;

  // Clear all outlines
  document.querySelectorAll(".colleague-chip .fb-avatar").forEach(a => {
    a.style.outline = "none";
  });

  // Highlight selected
  el.querySelector(".fb-avatar").style.outline = "2px solid var(--accent)";

  showToast("Selected: " + name);
}


/* ──────────────────────────────────────────────────────────
   7. FEEDBACK TAB SWITCHER
   ────────────────────────────────────────────────────────── */
function switchFbTab(tab, clickedPill) {
  // Hide all tab content panels
  document.querySelectorAll(".fb-tab-content").forEach(t => t.classList.remove("active"));

  // Deactivate all pills in the feedback screen only
  clickedPill.closest(".tab-pills").querySelectorAll(".tab-pill").forEach(p => {
    p.classList.remove("active");
  });

  // Show selected panel and highlight pill
  document.getElementById("fb-" + tab).classList.add("active");
  clickedPill.classList.add("active");
}


/* ──────────────────────────────────────────────────────────
   8. TRAINING TAB SWITCHER
   Currently just switches the pill highlight (content filtering
   can be extended here).
   ────────────────────────────────────────────────────────── */
function switchTrainTab(tab, clickedPill) {
  clickedPill.closest(".tab-pills").querySelectorAll(".tab-pill").forEach(p => {
    p.classList.remove("active");
  });
  clickedPill.classList.add("active");
  // Future: filter module cards by tab === 'inprogress' or 'completed'
}


/* ──────────────────────────────────────────────────────────
   9. SUBMIT FEEDBACK
   Validates and submits the feedback form.
   ────────────────────────────────────────────────────────── */
function submitFeedback() {
  const text = document.getElementById("fb-text").value.trim();

  if (!text) {
    showToast("⚠️ Please write feedback first");
    return;
  }
  if (!selectedColleague) {
    showToast("⚠️ Select a colleague first");
    return;
  }

  // Simulate submission
  showToast("🎉 Feedback sent to " + selectedColleague);

  // Reset form
  document.getElementById("fb-text").value = "";
  document.getElementById("ai-resp").classList.remove("show");
  rateStar(0);
  currentRating = 0;
  selectedColleague = null;
  document.querySelectorAll(".colleague-chip .fb-avatar").forEach(a => {
    a.style.outline = "none";
  });
}


/* ──────────────────────────────────────────────────────────
   10. QUIZ SYSTEM
   ────────────────────────────────────────────────────────── */

/** Quiz question bank, keyed by module id */
const quizData = {
  privacy: [
    {
      q:    "Under GDPR, what is the maximum time to report a data breach to authorities?",
      opts: ["24 hours", "48 hours", "72 hours", "7 days"],
      ans:  2
    },
    {
      q:    "Which of these is Personally Identifiable Information (PII)?",
      opts: ["Company revenue", "IP Address", "Product name", "Office location"],
      ans:  1
    },
    {
      q:    "What is 'data minimisation' in privacy law?",
      opts: ["Deleting old data", "Only collecting necessary data", "Encrypting all data", "Sharing data minimally"],
      ans:  1
    }
  ],
  cyber: [
    {
      q:    "What is phishing?",
      opts: ["A network protocol", "Fraudulent emails to steal info", "Firewall software", "Password encryption"],
      ans:  1
    },
    {
      q:    "What does MFA stand for?",
      opts: ["Multi-Factor Authentication", "Mobile File Access", "Main Firewall Architecture", "Manual File Audit"],
      ans:  0
    },
    {
      q:    "Which is the safest password practice?",
      opts: ["Using your birthdate", "Same password everywhere", "Unique complex password + manager", "Writing it on a sticky note"],
      ans:  2
    }
  ],
  leadership: [
    {
      q:    "What is 'active listening' in leadership?",
      opts: ["Listening while multitasking", "Fully focusing and engaging with the speaker", "Interrupting to show interest", "Taking detailed notes only"],
      ans:  1
    },
    {
      q:    "A servant leader primarily focuses on:",
      opts: ["Their own goals", "Empowering and serving the team", "Enforcing strict hierarchy", "Taking all major decisions alone"],
      ans:  1
    }
  ]
};


/** Open quiz modal for a given module type */
function openQuiz(type) {
  currentQuiz = quizData[type];
  currentQIdx = 0;
  document.getElementById("quiz-overlay").classList.add("show");
  renderQuestion();
}


/** Render the current question and its options */
function renderQuestion() {
  const question = currentQuiz[currentQIdx];

  document.getElementById("quiz-question").textContent =
    `Q${currentQIdx + 1}/${currentQuiz.length}: ${question.q}`;

  // Clear previous options and result
  const optsContainer = document.getElementById("quiz-options");
  optsContainer.innerHTML = "";
  document.getElementById("quiz-result").style.display = "none";

  // Build option elements
  question.opts.forEach((optText, index) => {
    const div = document.createElement("div");
    div.className = "quiz-opt";
    div.textContent = optText;
    div.onclick = () => answerQuiz(index, question.ans, div);
    optsContainer.appendChild(div);
  });
}


/** Handle an answer selection */
function answerQuiz(selected, correctIndex, selectedEl) {
  // Disable all options after answering
  document.querySelectorAll(".quiz-opt").forEach(o => o.onclick = null);

  const resultBox = document.getElementById("quiz-result");
  resultBox.style.display = "block";

  if (selected === correctIndex) {
    selectedEl.classList.add("correct");
    resultBox.style.background = "rgba(46,212,122,0.12)";
    resultBox.style.color      = "var(--green)";
    resultBox.textContent      = "✅ Correct! +10 XP";
    showToast("+10 XP earned! 🎯");
  } else {
    selectedEl.classList.add("wrong");
    document.querySelectorAll(".quiz-opt")[correctIndex].classList.add("correct");
    resultBox.style.background = "rgba(244,90,90,0.12)";
    resultBox.style.color      = "var(--red)";
    resultBox.textContent      = "❌ Incorrect. Correct answer is highlighted above.";
  }
}


/** Advance to the next question or close if quiz is complete */
function loadNextQuestion() {
  currentQIdx++;
  if (currentQIdx >= currentQuiz.length) {
    closeQuiz();
    showToast("🎓 Module section complete!");
  } else {
    renderQuestion();
  }
}


/** Close the quiz overlay */
function closeQuiz(event) {
  // If triggered by backdrop click, only close if click was on overlay itself
  if (event && event.target !== document.getElementById("quiz-overlay")) return;
  document.getElementById("quiz-overlay").classList.remove("show");
}


/* ──────────────────────────────────────────────────────────
   11. TOAST NOTIFICATION
   Shows a brief floating message at the bottom of the screen.
   ────────────────────────────────────────────────────────── */
function showToast(message) {
  const toastEl = document.getElementById("toast");
  toastEl.textContent = message;
  toastEl.style.opacity   = "1";
  toastEl.style.transform = "translateX(-50%) translateY(0)";

  setTimeout(() => {
    toastEl.style.opacity   = "0";
    toastEl.style.transform = "translateX(-50%) translateY(20px)";
  }, 2500);
}


/* ──────────────────────────────────────────────────────────
   12. APP INIT
   Runs once the DOM is ready.
   ────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  startClock();
});
