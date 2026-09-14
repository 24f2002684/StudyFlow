# MUDICHU 🎓✨

> A fun, colorful, and minimalist to-do and productivity web app designed specifically for college students.

MUDICHU balances productivity with visual delight: clean dark/light themes, an integrated Pomodoro timer with a circular countdown ring and audio alerts, drag-and-drop task grouping, and Firestore real-time persistence (with zero-config local storage fallback).

---

## 💡 About & Motivation

Built by **Suhail Akthar S M** as a personal project to complement my own lifestyle as well as my college mates'. Juggling classes, assignments, and study sessions can get chaotic, so I thought creating something clean, intuitive, and visually pleasing would be genuinely useful for them too — so yeah, here's **MUDICHU**!

---

## 🌟 Key Features

- **Task Management**:
  - Add, edit, delete, and mark tasks complete.
  - Metadata: Title, Course/Subject tags with custom color dots, Due Dates, and Pastel Priority Badges (Low, Medium, High).
  - Dynamic grouping into **Today**, **This Week**, **Later**, and **Completed**.
  - Drag-and-drop reordering within groups.
  - Real-time search and clickable course filter chips.

- **Pomodoro Focus Timer**:
  - Modes: 25 min Focus, 5 min Short Break, 15 min Long Break (after 4 sessions).
  - Smooth animated circular SVG progress ring.
  - Task attachment: Link active study sessions directly to an assignment to log pomodoros spent (`🍅 x 3`).
  - Web Audio API synthesized acoustic chime notifications.
  - Daily focus session tracker (`🍅🍅🍅`) and total focus minutes.

- **Visual Delight & Aesthetics**:
  - Theme toggle between Light and Dark mode with smooth 300ms transitions and persistent state.
  - Satisfying checkbox animation with confetti celebration bursts (`canvas-confetti`).
  - "Today's Progress" motivational bar and student-tailored encouraging microcopy.
  - Modern typography using *Plus Jakarta Sans*.
  - Fully responsive design crafted for desktop and mobile.

- **Storage & Deployment**:
  - Real-time synchronization with **Google Cloud Firestore**.
  - Automatic zero-config **Local Storage** fallback if Firebase credentials are not provided.
  - Ready for deployment to **Vercel** with `vercel.json`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn / pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/24f2002684/StudyFlow.git
   cd StudyFlow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure Firebase:
   Copy `.env.example` to `.env` and fill in your Firebase project credentials:
   ```bash
   cp .env.example .env
   ```
   *Note: If omitted, MUDICHU works seamlessly out-of-the-box using local storage.*

4. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## 🛠️ Tech Stack

- **Framework**: React + Vite (TypeScript)
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Web Audio API
- **Persistence**: Firebase Firestore / LocalStorage
- **Deployment**: Vercel

---

## 👨‍💻 Author

Created with ❤️ by **Suhail Akthar S M**.

---

## 📄 License
MIT