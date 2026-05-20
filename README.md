# Widget Builder

Smartphones are built around apps, not around the people using them. Data people need exists across their apps daily, but lives in silos; leaving users to do the mental work of connecting it themselves.

User research revealed the core frustration is functional mismatch, not aesthetics. People don't need prettier widgets. They need interfaces that fit how their lives are actually structured.

Widget Builder is the implementation tool behind **ALIGNED** — a three-stage framework that keeps the user in control from start to finish.

## The ALIGNED Framework

**1. Identify**
The system surfaces where the user's phone is already creating unnecessary effort, using patterns from their own screen time and app behavior — so they don't have to diagnose the problem themselves.

**2. Collaborate**
Working with an AI agent through whatever input feels natural — a sketch, a description, a screenshot — the system generates a custom interface built around the user's actual habits, not a template.

**3. Implement**
The user decides whether to put it on their phone. Nothing gets added without a deliberate choice.

Over time, what the user builds gets saved and maintained, so the work doesn't disappear when their habits evolve.

## Features

- **Step 1 — Properties**: Choose widget type, size, functionality, and format
- **Step 2 — Describe**: Type a description or draw a sketch on a canvas
- **Step 3 — Generate**: Claude AI builds the widget in real time
- **Step 4 — Preview**: View the widget in a sandboxed iframe and copy the HTML

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Backend**: Express (Node.js)
- **AI**: Anthropic Claude API (`claude-opus-4-6`) with vision support

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
# Install dependencies
npm install

# Add your API key
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY=your_key_here

# Start the dev server
npm run dev
```

App runs at `http://localhost:5173`

## Project Structure

```
widget-builder/
├── server/
│   └── index.js          # Express API — POST /api/generate
└── src/
    ├── App.jsx            # Screen routing + shared state
    ├── index.css          # All styles
    └── components/
        ├── Step1Properties.jsx
        ├── Step2Describe.jsx   # Text + canvas sketch input
        ├── Step3Loading.jsx
        └── Step4Result.jsx     # Widget preview + export
```
