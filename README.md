# Interactive Terminal Portfolio

A full-stack interactive portfolio application built with React, TypeScript, Three.js, Rapier physics, and Google Gemini. Features an interactive 3D lanyard ID card, a Linux-style terminal interface with custom command parsing, and an integrated AI assistant.

---

## Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **3D Graphics & Physics**: Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`
- **Backend / Proxy**: Express.js
- **AI Integration**: `@google/genai` (Google Gemini 3.6 Flash)
- **Build Tools**: Vite, esbuild, `tsx`

---

## Key Features

- **Interactive 3D ID Card**: Physics-driven 3D lanyard rendered using Three.js and Rapier rigid bodies. Supports drag physics, dynamic canvas barcode/QR texture rendering, and ambient lighting.
- **Terminal Engine**: Custom shell emulator with filesystem navigation (`ls`, `cd`, `pwd`, `cat`), system commands (`about`, `projects`, `skills`, `experience`, `contact`), theme management, command history, and tab completion.
- **AI Assistant**: Natural language query processing using Gemini 3.6 Flash. Evaluates prompts via an Express server endpoint (`/api/chat`) or directly via client environment configuration (`VITE_API_KEY` / `VITE_GEMINI_API_KEY`) for static SPA hosting platforms like Netlify.
- **Custom UI Components**: Custom StarBorder button effect, dynamic theme context state, and retro lock/boot terminal screens.

---

## Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Define configuration variables according to your deployment target:

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Server-side | API key used by the Express backend proxy (`server.ts`). |
| `VITE_API_KEY` | Client-side | API key used for direct API calls in static frontend deployments (e.g., Netlify). |

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Mode

```bash
npm run dev
```

Launches the Express server on `http://localhost:3000` with Vite middleware enabled.

### 3. Production Build

```bash
npm run build
```

Builds the static frontend assets into `dist/` and bundles `server.ts` into a self-contained CommonJS file `dist/server.cjs`.

### 4. Production Start

```bash
npm start
```

Runs the production Node server from `dist/server.cjs`.

---

## Terminal Commands

| Command | Description |
| :--- | :--- |
| `help` | Lists available commands |
| `ls [path]` | Lists contents of current or target directory |
| `cd [dir]` | Navigates directory hierarchy |
| `cat [file]` | Reads file contents |
| `pwd` | Displays current working directory |
| `clear` | Clears terminal history |
| `theme [name]` | Switches or previews visual color schemes |
| `about`, `projects`, `skills`, `experience`, `contact` | Displays detailed resume and portfolio sections |

---

## License

MIT
