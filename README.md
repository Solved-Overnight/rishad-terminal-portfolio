# 🖥️ Interactive AI Terminal Portfolio

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?logo=tailwindcss)

A highly interactive, developer-centric portfolio website that mimics a Linux terminal environment. It features a realistic file system, Zsh-style command prompts, a 3D interactive ID card, and a fully integrated AI persona powered by Google's Gemini API to answer visitor queries.

## ✨ Features

- **Terminal Interface**:
  - **Zsh/Kali Style Prompt**: Authentic dual-line prompt design.
  - **File System Navigation**: Use `ls`, `cd`, `pwd`, and `cat` to explore project files.
  - **Command History**: Cycle through previous commands using Up/Down arrows.
  - **Autocompletion**: Tab completion for available commands.
  - **Typewriter Effect**: Retro-style text rendering for outputs.

- **🤖 AI Integration**:
  - Chat directly with the portfolio owner's persona.
  - Powered by **Google Gemini 2.5 Flash**.
  - Context-aware responses regarding skills, experience, and projects.
  - **Secure API Key Management**: Users can input their own API key via the terminal (`sudo api`) which is stored locally in the browser.

- **🎨 UI/UX**:
  - **3D ID Card**: Physics-based interactive tilt effect using React refs and mouse events.
  - **Theming System**: Switch between presets (Matrix, Dracula, Monokai, Light) or create a custom color scheme.
  - **Responsive Design**: optimized for both desktop and mobile viewing.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (Custom configuration for animations & typography)
- **AI**: @google/genai SDK
- **State Management**: React Context API & Hooks
- **Font**: Fira Code (Monospace with ligatures)

## ⌨️ Usage

Once the terminal is loaded, you can interact with it just like a real shell.

### Core Commands

| Command | Description |
| :--- | :--- |
| `help` | Display list of available commands |
| `ls` | List directory contents |
| `cd [dir]` | Change directory |
| `cat [file]` | Read file contents |
| `clear` | Clear terminal history |
| `theme` | Open theme settings or switch themes |
| `sudo api` | Configure Gemini API Key |

### AI Chat
Simply type any question that isn't a system command, and the AI will respond.
> **Example**: "What is your experience with React?"

### Shortcuts
- `about`, `projects`, `skills`, `experience`, `contact`

## 🎨 Themes

You can switch themes using the UI settings icon (top right of the card section) or via the terminal command:
```bash
theme dracula
theme monokai
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
