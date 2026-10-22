# Student Learning Hub — BOS Academic Library + GATE 2028

A real, responsive, educational web application for Electronics and Communication Engineering (ECE) students.

## Features

1. **Authentication**:
   - Secure student login & registration flow.
   - Quick Guest Demo mode for fast access.
   - Forgot-password workflow.

2. **Main Dashboard**:
   - Personalized welcome banner.
   - Two large hero navigation cards: **BOS Academic Library** and **GATE 2028 Preparation**.
   - Quick Access to **Simulation Tools**, **NPTEL Courses**, **YouTube Resources**, and **Bookmarks**.
   - Real-time progress trackers & recent study files.
   - Global search bar covering subjects, course codes, and lab simulation tools.

3. **BOS Academic Library**:
   - 4-Year complete structure (Year 1 to Year 4, Semester 1 & Semester 2).
   - Subject cards with syllabus outlines, notes, and PDF viewer integration (`/ECE.pdf`).
   - Admin dialogs to add/delete subjects and link resources.
   - Connected Simulation Tools strip & NPTEL panel.

4. **GATE 2028 Preparation**:
   - Dedicated ECE syllabus for all 9 core subjects (Engineering Mathematics, Network Theory, Signals & Systems, EDC, Analog Circuits, Digital Circuits, Control Systems, Communications, EMFT).
   - Subject weightage and topic progress tracking.
   - **Private Study Planner & Timetable**: daily study checklist, priority tags, and weekly preparation schedule.
   - Previous Year Question papers archive (2015-2024).

5. **Simulation Software**:
   - Dedicated laboratory section with external access links for MATLAB & Simulink, LTspice, NI Multisim, Proteus VSM, Verilog Tools (EDA Playground), and Python for ECE.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite.
- **Styling**: Tailwind CSS v4, Lucide icons.
- **Persistence**: LocalStorage with full Supabase PostgreSQL schema migration ready in `supabase/schema.sql`.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Visit `http://localhost:5173/` in your browser.

### 3. Build for Production
```bash
npm run build
```

## Database Setup (Supabase)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor and run the SQL migration located at `supabase/schema.sql`.
3. Copy your project URL and anon public key into `.env` (refer to `.env.example`).
