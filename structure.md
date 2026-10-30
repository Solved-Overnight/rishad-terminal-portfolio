# Portfolio Website - Technical HTML & DOM Structure Document

> **Project:** Moniruzzaman Rishad Portfolio OS (`mzrishad.is-a.dev`)  
> **Tech Stack:** React 19, TypeScript, Three.js (`@react-three/fiber`), Rapier 3D Physics (`@react-three/rapier`), Tailwind CSS, Google Gemini 3.6 Flash  
> **Purpose:** Detailed layout, coordinate space, element selector, and DOM hierarchy guide for video automation, camera choreography, and Claude Hyperframe generation.

---

## 1. Global Document Shell & Entry Points

### 1.1 `index.html` Head & Root
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <!-- Fonts: Fira Code (Monospace) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>Moniruzzaman Rishad - Terminal Portfolio</title>
  </head>
  <body class="bg-black text-white overflow-hidden select-none">
    <div id="root"></div>
  </body>
</html>
```

### 1.2 Theme Context Root Wrapper
- **Component:** `<ThemeProvider>` wrapping `<PortfolioOS>`
- **Active CSS Variables & Classes:** Dynamically sets `--terminal-bg`, `--terminal-primary`, `--terminal-dim`, `--terminal-text` across the entire document tree.

---

## 2. High-Level Layout Matrix

The application operates as a full-viewport Cyberpunk OS environment:
`div.h-[100dvh].w-screen.bg-terminal-black.text-terminal-text.font-mono.flex.flex-col.md:flex-row.overflow-hidden.relative`

```
+---------------------------------------------------------------------------------------------------+
| MOBILE TOP NAVIGATION BAR (Visible on screens < 768px)                                           |
| [Blogs Button]                    [ID Card | Terminal Toggle]                 [Hamburger Menu]   |
+-------------------------------------------------+---+---------------------------------------------+
| LEFT PANEL (35% default desktop / 100% mobile)  | R | RIGHT PANEL (65% default desktop / 100% mob)|
|                                                 | E |                                             |
| [Identity Header: M. Rishad / AI & ML Engineer] | S | [Top Scrollable Command Chips Toolbar]      |
| [Desktop Action Icons: Projects, Resume, etc.]  | I |                                             |
|                                                 | Z | [Terminal Viewport: Shell Output Stream]    |
|   +---------------------------------------+     | E |   - System welcome banner                   |
|   | 3D WEBGL CANVAS (Three.js + Rapier)   |     | R |   - Typewriter text & rich cards            |
|   | Dynamic Lanyard + 3D Kinetic ID Card  |     |   |   - Interactive Kali Prompt Line:           |
|   | Real-time physics, drag, swing, spin  |     | B |     ┌──(rishad㉿portfolio)-[~]               |
|   +---------------------------------------+     | A |     └─$ [Blinking cursor & input]           |
|                                                 | R |                                             |
| [Slide-to-Terminal Widget] (Mobile only)        |   | [Floating Scroll-to-Bottom FAB]             |
| [Social Icons Dock & Glowing Contact Button]    |   | [Bottom Status Bar: Read Blogs, Clock, etc] |
+-------------------------------------------------+---+---------------------------------------------+
```

---

## 3. Left Panel: 3D ID Card & Identity Column

### 3.1 Left Column Container
- **Tag & Selectors:** `div.relative.flex-shrink-0.flex.flex-col.items-center.overflow-y-auto.md:overflow-hidden`
- **Dynamic Width:** `style={{ width: isMobile ? '100%' : '${sidebarWidth}%' }}` (Default: `35%`, resizable from `20%` to `70%`).
- **Background Styling:** Radial gradient transitioning from `theme.colors.dim` to `theme.colors.bg`.

### 3.2 Identity Header (Top-Left)
- **Tag & Selectors:** `div.md:absolute.md:top-6.md:left-6.z-20.font-mono`
  - `h1.text-4xl.font-bold.text-terminal-primary.tracking-tighter` -> **`M. Rishad`**
  - `p.text-terminal-text-dim.text-sm.mt-1.tracking-wide` -> **`AI & ML Engineer`**

### 3.3 Desktop Quick Actions Toolbar (Top-Right of Left Panel)
- **Tag & Selectors:** `div.absolute.top-4.right-4.z-30.hidden.md:flex.gap-2`
  - **Projects Button:** `button[title="Projects Showcase"]` -> Opens `<ProjectsModal>`
  - **Resume Button:** `button[title="Download Resume"]` -> Triggers terminal `git clone` download action
  - **History Button:** `button[title="Command History"]` -> Opens `<HistoryModal>`
  - **Settings Button:** `button[title="Settings & Themes"]` -> Opens `<SettingsModal>` (Theme switcher)
  - **Power Menu Button:** `button[title="Power Options"]` -> Toggles dropdown with *Restart*, *Power Off*, *Log Out*

### 3.4 WebGL 3D ID Card Canvas
- **Container:** `div.absolute.inset-0.z-0.flex.items-center.justify-center`
- **R3F Canvas Element:** `<Canvas camera={{ position: [0, 0, 12], fov: 25 }} dpr={[1, 2]}>`
- **Rapier Physics Hierarchy:**
  - `RigidBody[type="fixed"]` (Fixed anchor ceiling at `[0, 4, 0]`)
  - `RigidBody[j1, j2, j3]` (Rope joints simulating elastic lanyard cord segments)
  - `RigidBody[card]` (Dynamic cuboid collider `[0.8, 1.125, 0.01]` with spherical joint to `j3`)
- **Mesh Components:**
  - `<mesh ref={band}>`: `<meshLineGeometry>` textured with `SOLVED OVERNIGHT` repeat ribbon
  - `<mesh geometry={nodes.clip}>`: Metal alloy clip holding the card
  - `<mesh geometry={nodes.clamp}>`: Metal fastener connecting lanyard to clip
  - `<mesh geometry={nodes.card}>`: Main double-sided card mesh with custom 4096×4096 CanvasTexture
- **2D Canvas Texture Map Elements:**
  - **Front Face (x: 0, y: 0, w: 1024, h: 1546):**
    - Top Clip Notch Slot (`#FF8C00` orange accent notch at `ox + 442, -30`)
    - Monogram Badge `'R'` (top-left rounded box)
    - Username `@mzrishad` (top-right text)
    - Center Profile Photo (`id_photo.png` cover crop in 580×580 frame)
    - Full Name `M. Rishad` (96px Fira Code bold)
    - Role Badge `AI & ML Engineer` (rounded pill)
    - Footer: `JOIN DATE: Oct 2023`, High-DPI Vector QR Code, Barcode & `ID: 948382`
  - **Back Face (x: 1024, y: 0, w: 1024, h: 1546):**
    - Magnetic Stripe (black/dark-slate band at `y: 100`)
    - Monogram & Header `MONIRUZZAMAN RISHAD`
    - Contact List: `EMAIL`, `GITHUB`, `LINKEDIN`, `WEBSITE`
    - Holographic Microchip (gold EMV chip gradient at `x: 740, y: 580`)
    - Bottom Security Notice: `PROPERTY OF M. RISHAD • AUTHORIZED ACCESS ONLY`

### 3.5 Social Dock & Glowing Contact Button (Bottom-Left)
- **Tag & Selectors:** `div.fixed.bottom-3.left-1/2.md:absolute.md:bottom-6.md:left-6.z-40`
  - **Social Links:** Circular pill buttons with SVG icons: GitHub, LinkedIn, Facebook, Instagram
  - **StarBorder Contact CTA:** `<StarBorder as="button">` with rotating multi-point SVG glow effect and text `"Contact Me"`. Dispatches `'contact'` command directly to the terminal.

### 3.6 Mobile Interactive Controls (Active on `< 768px`)
- **Header Toggle Slider:** `div[role="tablist"]` with smooth sliding indicator between `'ID Card'` and `'Terminal'`.
- **Slide-to-Terminal Widget:** `<MobileSlideToTerminal>` widget positioned at `bottom-[4.25rem]` with chevron arrow animation: `"Slide to Terminal >>>"`.
- **Hamburger System Drawer:** `<MobileMenu>` with smooth slide-in transition, 25% curved border radius, accessing Resume, Projects, History, Themes, and Reload.

---

## 4. Middle Resizer Handle (Desktop Splitter)

- **Tag & Selectors:** `div.hidden.md:block.w-1.h-full.cursor-col-resize.z-50.transition-colors`
- **Behavior:**
  - Default: `bg-terminal-dim`
  - Hover: `hover:bg-terminal-primary/50`
  - Active Dragging: `bg-terminal-primary`
- **Events:** `onMouseDown={startResizing}` calculates percentage ratio across window X axis.

---

## 5. Right Panel: Unix Terminal Interface

### 5.1 Terminal Container
- **Tag & Selectors:** `div.flex-col.bg-terminal-black.relative.h-full.font-mono.text-base`
- **Width:** `style={{ width: isMobile ? '100%' : '${100 - sidebarWidth}%' }}`

### 5.2 Top Quick Shortcuts Carousel
- **Tag & Selectors:** `div.flex-none.p-3.border-b.border-terminal-dim.bg-terminal-black.z-20.sticky.top-0`
- **Controls:** Left arrow `◀`, scrollable container `overflow-x-auto.scrollbar-hide`, Right arrow `▶`
- **Action Chips:**
  - `help`, `about`, `projects`, `skills`, `experience`, `blogs`, `contact`, `theme`, `ai`, `clear`, `ls`, `cat`, `history`

### 5.3 Output Stream & Scroll Viewport
- **Tag & Selectors:** `div.flex-grow.overflow-y-auto.p-4.sm:p-6.space-y-2.pb-48.custom-scrollbar`
- **Output Line Types:**
  1. **System Lines:** Boot status, hardware specs, ASCII banner (`Typewriter` stream).
  2. **Input Echo Lines:** `┌──(rishad㉿portfolio)-[~]` followed by user command.
  3. **Rich Custom Component Outputs:**
     - `projects`: Interactive Project Cards grid with category tags, live demo buttons, and GitHub stars.
     - `skills`: Visual skill proficiency matrix categorized into AI/ML, Backend, and Tooling.
     - `experience`: Career chronology timeline with role titles and quantifiable accomplishments.
     - `blogs`: Markdown formatted blog viewer with metadata chips (`📅 Date`, `⏱️ Read Time`, `✍️ Author`).
     - `theme`: Grid of available color schemes with preview swatches.
     - `ai`: Real-time streaming response from Google Gemini 3.6 Flash.
     - `apt update`: Simulated package manager download with ASCII progress bars.

### 5.4 Active Kali / POSIX Command Line Prompt
- **Tag & Selectors:** `div.mt-4.text-terminal-blue`
- **Prompt Structure:**
  ```
  ┌──(rishad㉿portfolio)-[~]
  └─$ [user-input-buffer] [blinking-cursor] [ghost-autocomplete-suggestion]
  ```
- **Elements:**
  - Line 1: `text-terminal-cyan` + `rishad㉿portfolio` (bold blue) + current directory
  - Line 2: `└─$ ` prompt symbol
  - Live Input Display: `div.relative.z-0.whitespace-pre-wrap`
  - Blinking Caret: `span.inline-block.bg-terminal-green.animate-blink.w-[4px].h-[1.2em]`
  - Ghost Autocompletion: `span.select-none.pointer-events-none.text-[#6e7681]`
  - Hidden Native Textarea: `textarea.absolute.inset-0.z-10.opacity-0` (captures keyboard inputs and mobile virtual keyboard).

### 5.5 Bottom Status Bar
- **Tag & Selectors:** `div.absolute.bottom-0.left-0.right-0.h-8.bg-terminal-black.border-t.border-terminal-dim.flex.items-center.justify-between.px-4.text-sm.z-30`
- **Left:** `button` -> `"Read Blogs ↗"` (opens `<BlogModal>`)
- **Center:** `span.text-terminal-primary.text-xs.md:text-sm` -> Real-time formatted clock (`MM/DD/YYYY, HH:MM:SS AM/PM`)
- **Right:** `a` -> `"Featured on Solved Overnight ↗"`

---

## 6. System Modals & State Screens

| Component | Target Selector | Visual Characteristics |
| :--- | :--- | :--- |
| `<BootScreen>` | `div.fixed.inset-0.bg-black.z-50` | Fast Linux kernel boot sequence, memory diagnostics, Kali logo ASCII art, green checkmarks `[ OK ]`. |
| `<LockScreen>` | `div.fixed.inset-0.backdrop-blur-xl.z-50` | User avatar, password prompt input, biometric lock animation, clock widget. |
| `<PowerOffScreen>` | `div.fixed.inset-0.bg-black.z-50` | CRT monitor turn-off scanline collapse animation, centered power button to restart. |
| `<SettingsModal>` | `div.fixed.inset-0.z-50.backdrop-blur-md` | Glassmorphic modal with theme swatches (Matrix, Cyberpunk, Dracula, Monokai, Nord, Tokyo Night, Catppuccin). |
| `<ProjectsModal>` | `div.fixed.inset-0.z-50.backdrop-blur-md` | Full-screen interactive project explorer with filters, tags, and architecture diagrams. |
| `<BlogModal>` | `div.fixed.inset-0.z-50.backdrop-blur-md` | Split view file explorer and rich Markdown document reader. |
| `<HistoryModal>` | `div.fixed.inset-0.z-50.backdrop-blur-md` | Timestamped list of executed terminal commands with re-run and export capabilities. |

---

## 7. Key Selectors for Video & Automation Targeting

```css
/* Identity & Top Branding */
h1:has-text("M. Rishad")
p:has-text("AI & ML Engineer")

/* 3D Canvas Container */
canvas[data-engine^="three.js"]

/* Lanyard Mesh Anchor Coordinates */
worldAnchor: Vector3(0, 1.45, -0.05)

/* Quick Action Chips */
button:has-text("projects")
button:has-text("skills")
button:has-text("theme")
button:has-text("ai")

/* Terminal Input Prompt */
textarea[autocomplete="off"]
span.animate-blink

/* Mobile Navigation Controls */
div[role="tablist"] button[role="tab"]
button[aria-label="Open System Menu"]
```
