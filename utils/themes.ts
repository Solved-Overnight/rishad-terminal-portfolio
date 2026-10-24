export type ThemeId = 
  | 'default' 
  | 'dracula' 
  | 'monokai' 
  | 'nord' 
  | 'tokyonight' 
  | 'catppuccin' 
  | 'onedark' 
  | 'gruvbox' 
  | 'rosepine'
  | 'kanagawa'
  | 'cobalt'
  | 'ayu'
  | 'github_dark'
  | 'cyberpunk' 
  | 'solarized' 
  | 'synthwave' 
  | 'light' 
  | 'custom';

export interface ThemeColors {
  bg: string;
  primary: string; // Main accent (cursor, prompt name, primary highlights)
  secondary: string; // Links, directories, secondary highlights
  accent: string; // Special accents, badges
  dim: string; // Borders, surfaces, subdued elements
  text: string; // Main text
  textDim: string; // Secondary text
}

export interface Theme {
  id: ThemeId;
  name: string;
  isDark?: boolean;
  colors: ThemeColors;
}

export const THEMES: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'Matrix',
    isDark: true,
    colors: {
      bg: '#0c0c0c',
      primary: '#4af626', // Bright Green
      secondary: '#4b84ff',
      accent: '#29C5F6',
      dim: '#232936',
      text: '#f0f0f0',
      textDim: '#8b949e'
    }
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    isDark: true,
    colors: {
      bg: '#282a36',
      primary: '#ff79c6', // Pink
      secondary: '#bd93f9', // Purple
      accent: '#8be9fd', // Cyan
      dim: '#44475a',
      text: '#f8f8f2',
      textDim: '#6272a4'
    }
  },
  monokai: {
    id: 'monokai',
    name: 'Monokai Pro',
    isDark: true,
    colors: {
      bg: '#272822',
      primary: '#a6e22e', // Green
      secondary: '#66d9ef', // Blue
      accent: '#fd971f', // Orange
      dim: '#3e3d32',
      text: '#f8f8f2',
      textDim: '#75715e'
    }
  },
  nord: {
    id: 'nord',
    name: 'Nord Arctic',
    isDark: true,
    colors: {
      bg: '#2e3440',
      primary: '#88c0d0', // Frost Cyan
      secondary: '#81a1c1', // Frost Blue
      accent: '#a3be8c', // Sage Green
      dim: '#434c5e',
      text: '#eceff4',
      textDim: '#d8dee9'
    }
  },
  tokyonight: {
    id: 'tokyonight',
    name: 'Tokyo Night',
    isDark: true,
    colors: {
      bg: '#1a1b26',
      primary: '#7aa2f7', // Neon Blue
      secondary: '#bb9af7', // Neon Purple
      accent: '#7dcfff', // Sky Cyan
      dim: '#24283b',
      text: '#c0caf5',
      textDim: '#565f89'
    }
  },
  catppuccin: {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    isDark: true,
    colors: {
      bg: '#1e1e2e',
      primary: '#cba6f7', // Mauve
      secondary: '#89b4fa', // Blue
      accent: '#a6e3a1', // Green
      dim: '#313244',
      text: '#cdd6f4',
      textDim: '#a6adc8'
    }
  },
  onedark: {
    id: 'onedark',
    name: 'One Dark Pro',
    isDark: true,
    colors: {
      bg: '#21252b',
      primary: '#98c379', // Soft Green
      secondary: '#61afef', // Soft Blue
      accent: '#e5c07b', // Soft Yellow/Gold
      dim: '#2c313a',
      text: '#abb2bf',
      textDim: '#5c6370'
    }
  },
  gruvbox: {
    id: 'gruvbox',
    name: 'Gruvbox Dark',
    isDark: true,
    colors: {
      bg: '#282828',
      primary: '#fabd2f', // Warm Gold
      secondary: '#b8bb26', // Olive Green
      accent: '#fe8019', // Orange
      dim: '#3c3836',
      text: '#ebdbb2',
      textDim: '#a89984'
    }
  },
  rosepine: {
    id: 'rosepine',
    name: 'Rosé Pine',
    isDark: true,
    colors: {
      bg: '#191724',
      primary: '#ebbcba', // Rose
      secondary: '#c4a7e7', // Iris
      accent: '#9ccfd8', // Foam
      dim: '#26233a',
      text: '#e0def4',
      textDim: '#908caa'
    }
  },
  kanagawa: {
    id: 'kanagawa',
    name: 'Kanagawa',
    isDark: true,
    colors: {
      bg: '#1f1f28',
      primary: '#98bb6c', // Spring Green
      secondary: '#7e9cd8', // Wave Blue
      accent: '#ffa066', // Surimi Orange
      dim: '#2a2a37',
      text: '#dcd7ba',
      textDim: '#727169'
    }
  },
  cobalt: {
    id: 'cobalt',
    name: 'Cobalt2',
    isDark: true,
    colors: {
      bg: '#193549',
      primary: '#ffc600', // Yellow
      secondary: '#0088ff', // Bright Blue
      accent: '#ff9d00', // Orange
      dim: '#15232d',
      text: '#ffffff',
      textDim: '#a2b6c7'
    }
  },
  ayu: {
    id: 'ayu',
    name: 'Ayu Dark',
    isDark: true,
    colors: {
      bg: '#0f141c',
      primary: '#e6b450', // Warm Gold
      secondary: '#39bae6', // Sky Blue
      accent: '#ff3333', // Coral
      dim: '#1b2230',
      text: '#b3b1ad',
      textDim: '#626a73'
    }
  },
  github_dark: {
    id: 'github_dark',
    name: 'GitHub Dark',
    isDark: true,
    colors: {
      bg: '#0d1117',
      primary: '#58a6ff', // GitHub Blue
      secondary: '#3fb950', // GitHub Green
      accent: '#d29922', // GitHub Gold
      dim: '#21262d',
      text: '#c9d1d9',
      textDim: '#8b949e'
    }
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    isDark: true,
    colors: {
      bg: '#120d24',
      primary: '#ffe600', // Neon Yellow
      secondary: '#ff2a85', // Hot Pink
      accent: '#05d9e8', // Electric Cyan
      dim: '#291b4e',
      text: '#fbfbfb',
      textDim: '#a277ff'
    }
  },
  solarized: {
    id: 'solarized',
    name: 'Solarized Dark',
    isDark: true,
    colors: {
      bg: '#002b36',
      primary: '#2aa198', // Cyan
      secondary: '#268bd2', // Blue
      accent: '#b58900', // Yellow
      dim: '#073642',
      text: '#93a1a1',
      textDim: '#586e75'
    }
  },
  synthwave: {
    id: 'synthwave',
    name: "Synthwave '84",
    isDark: true,
    colors: {
      bg: '#262335',
      primary: '#ff7edb', // Neon Pink
      secondary: '#36f9f6', // Neon Teal
      accent: '#fede5d', // Sunset Yellow
      dim: '#494364',
      text: '#ffffff',
      textDim: '#848bbd'
    }
  },
  light: {
    id: 'light',
    name: 'Clean Light',
    isDark: false,
    colors: {
      bg: '#f6f8fa',
      primary: '#0969da', // GitHub Blue
      secondary: '#8250df', // Purple
      accent: '#1a7f37', // Green
      dim: '#d0d7de',
      text: '#1f2328',
      textDim: '#656d76'
    }
  },
  // Placeholder for custom, structure copied from default initially
  custom: {
    id: 'custom',
    name: 'Custom',
    isDark: true,
    colors: {
      bg: '#000000',
      primary: '#ffffff',
      secondary: '#aaaaaa',
      accent: '#cccccc',
      dim: '#333333',
      text: '#ffffff',
      textDim: '#888888'
    }
  }
};