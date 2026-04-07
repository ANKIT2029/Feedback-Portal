# PeopleOS — HR Management App

A mobile-first HR management web app built with HTML, CSS, JavaScript, Bootstrap 5, and the Anthropic Claude API.

---

## 📁 Project Structure

```
peopleos/
│
├── index.html          ← App shell & all screen markup (HTML only)
│
├── css/
│   └── style.css       ← All styles: variables, layout, components, animations
│
├── js/
│   ├── api.js          ← Anthropic API integration (AI Improve & AI Summarise)
│   └── app.js          ← All UI logic: navigation, clock, quiz, feedback, toast
│
└── README.md           ← This file
```

---

## 🧱 Tech Stack

| File          | Technology            | Role                                      |
|---------------|-----------------------|-------------------------------------------|
| `index.html`  | HTML5                 | Structure, screens, components            |
| `style.css`   | CSS3 + Bootstrap 5    | Layout, theming, animations               |
| `app.js`      | Vanilla JavaScript    | UI state, navigation, interactions        |
| `api.js`      | Anthropic Claude API  | AI feedback improvement & analysis        |
| Icons         | Font Awesome 6        | All icons                                 |
| Fonts         | Google Fonts          | Syne (headings) + DM Sans (body)          |

---

## 📱 Features

### 🏠 Dashboard
- Personalised greeting with date and department
- Monthly attendance stats (present, late, attendance %)
- Quick action tiles for all 4 modules
- Pending training modules with progress bars
- Recent feedback preview

### ⏱️ Attendance
- Live clock with AM/PM
- Check In / Check Out toggle button
- Weekly summary with day-by-day indicators
- Attendance history log with status badges (Present / Late / Absent / Half Day)
- Leave balance display (Casual & Sick leaves)

### 💬 Feedback
Three tabs:
- **Give Feedback** — Select colleague, star rating, write feedback, AI Improve / AI Summarise
- **Received** — View feedback received with AI-powered insights panel
- **Team Pulse** — Team sentiment scores across 3 dimensions

### 🎓 Training
- Overall learning progress bar with XP tracker
- Module cards with status badges (New / In Progress / Done)
- Interactive **Knowledge Check quiz modal** per module
- Correct/wrong answer highlighting + XP reward

### 👤 Profile
- Employee info card (ID, email, join date, manager)
- Performance stats (rating, XP, streak)
- Notification toggle switches

---

## 🤖 API Integration (js/api.js)

Both AI features are in the **Give Feedback** tab:

| Button         | Function         | What it does                                          |
|----------------|------------------|-------------------------------------------------------|
| AI Improve     | `aiImprove()`    | Rewrites the feedback to be more professional (2–3 sentences) |
| AI Summarise   | `aiSummarise()`  | Returns sentiment, key themes, and one growth suggestion |

All API calls go through `callAnthropicAPI(prompt)` which hits:
```
POST https://api.anthropic.com/v1/messages
Model: claude-sonnet-4-20250514
```

---

## 🚀 How to Run

Just open `index.html` in any modern browser — no build tools or server required.

```bash
# Option 1: Direct open
open index.html

# Option 2: Local server (recommended)
npx serve .
# or
python -m http.server 8080
```

---

## 🎨 Design System

All design tokens live in `css/style.css` under `:root`:

```css
--bg:      #0c0f1a   /* App background          */
--card:    #1a2035   /* Card surface             */
--accent:  #4f8ef7   /* Primary blue             */
--accent2: #7c5cfc   /* Secondary purple         */
--green:   #2ed47a   /* Success / Present        */
--orange:  #f4a34a   /* Warning / Late           */
--red:     #f45a5a   /* Error / Absent           */
```
# Application_Feedback
