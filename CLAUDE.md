# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server with hot reload (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

This is an interactive terminal portfolio website built with React 19, TypeScript, and Vite. The core architecture consists of:

- **Terminal Emulator**: The main interactive component in `components/Terminal.tsx` - handles command parsing, history, autocompletion, and output rendering
- **AI Integration**: `services/geminiService.ts` provides Gemini 2.5 Flash integration for the AI chat feature
- **Theme System**: `contexts/ThemeContext.tsx` and `utils/themes.ts` manage theming with presets (Matrix, Dracula, Monokai, Light)
- **3D Components**: Uses `@react-three/fiber` and `@react-three/drei` for the interactive 3D ID card effect
- **State Management**: React Context API for theme and terminal state; localStorage for persisting user preferences (API key, theme)

### Key Files

- `App.tsx` - Main application component, orchestrates terminal and 3D card
- `components/Terminal.tsx` - Terminal emulator UI and command handling
- `components/IdCard.tsx` - 3D physics-based interactive card
- `services/geminiService.ts` - Google Gemini API client
- `constants.ts` - File system structure and command definitions
- `types.ts` - TypeScript type definitions

## Gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available skills: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/retro`, `/investigate`, `/document-release`, `/document-generate`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`.
