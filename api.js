/* ============================================================
   PeopleOS HR App — js/api.js
   Handles all Anthropic API calls.
   Functions exported to global scope for use in app.js.

   Methods:
     callAnthropicAPI(prompt)  → raw API call, returns text
     aiImprove()               → rewrites feedback professionally
     aiSummarise()             → analyses feedback for sentiment & themes
   ============================================================ */

const API_URL   = "https://api.anthropic.com/v1/messages";
const API_MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1000;


/* ──────────────────────────────────────────────────────────
   CORE API CALLER
   ────────────────────────────────────────────────────────── */
async function callAnthropicAPI(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: API_MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Extract all text blocks from the response
  const text = data.content
    ?.map(block => block.text || "")
    .join("") || "";

  return text.trim();
}


/* ──────────────────────────────────────────────────────────
   AI IMPROVE — Rewrites feedback to be professional
   ────────────────────────────────────────────────────────── */
async function aiImprove() {
  const inputText = document.getElementById("fb-text").value.trim();
  if (!inputText) {
    showToast("✍️ Write feedback first");
    return;
  }

  const responseBox  = document.getElementById("ai-resp");
  const responseText = document.getElementById("ai-resp-text");

  // Show box with loading state
  responseBox.classList.add("show");
  responseText.innerHTML = `
    <div class="ai-loading">
      <div class="spinner"></div> Improving your feedback...
    </div>`;

  const prompt = `You are an HR communication expert.
Improve this employee feedback to be more professional, constructive, and specific.
Keep it concise (2–3 sentences max).
Return ONLY the improved feedback text — no preamble, no explanation.

Original feedback:
"${inputText}"`;

  try {
    const improved = await callAnthropicAPI(prompt);
    responseText.textContent = improved;

    // Also update the textarea with the improved version
    document.getElementById("fb-text").value = improved;
    showToast("✅ Feedback improved by AI");
  } catch (error) {
    console.error("AI Improve error:", error);
    responseText.textContent = "⚠️ Could not connect to AI. Please try again.";
  }
}


/* ──────────────────────────────────────────────────────────
   AI SUMMARISE — Extracts sentiment, themes & suggestion
   ────────────────────────────────────────────────────────── */
async function aiSummarise() {
  const inputText = document.getElementById("fb-text").value.trim();
  if (!inputText) {
    showToast("✍️ Write feedback first");
    return;
  }

  const responseBox  = document.getElementById("ai-resp");
  const responseText = document.getElementById("ai-resp-text");

  // Show box with loading state
  responseBox.classList.add("show");
  responseText.innerHTML = `
    <div class="ai-loading">
      <div class="spinner"></div> Analysing feedback...
    </div>`;

  const prompt = `You are an HR analytics assistant.
Analyse the following employee feedback and return a short structured analysis with:
1) Sentiment: Positive / Neutral / Negative
2) Key themes: (max 3 bullet points)
3) One actionable growth suggestion

Format as clean bullet points. Be concise.

Feedback:
"${inputText}"`;

  try {
    const summary = await callAnthropicAPI(prompt);
    responseText.textContent = summary;
    showToast("📊 Analysis complete");
  } catch (error) {
    console.error("AI Summarise error:", error);
    responseText.textContent = "⚠️ Could not connect to AI. Please try again.";
  }
}
