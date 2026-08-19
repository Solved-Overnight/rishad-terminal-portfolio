export type ThemeId = 'default' | 'dracula' | 'monokai' | 'light' | 'custom';

export interface ThemeColors {
  bg: string;
  primary: string; // Main accent (cursor, prompt name)
  secondary: string; // Links, directories
  accent: string; // Highlights
  dim: string; // Borders, subdued elements
  text: string; // Main text
  textDim: string; // Secondary text
}

export interface Theme {
  id: ThemeId;
  name: string;
  colors: ThemeColors;
}

export const THEMES: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'Matrix / Default',
    colors: {
      bg: '#0c0c0c',
      primary: '#4af626', // Bright Green
      secondary: '#4b84ff',
      accent: '#29C5F6',
      dim: '#2d333b',
      text: '#f0f0f0',
      textDim: '#8b949e'
    }
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
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
    name: 'Monokai',
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
  light: {
    id: 'light',
    name: 'Clean Light',
    colors: {
      bg: '#ffffff',
      primary: '#0969da', // GitHub Blue
      secondary: '#8250df', // Purple
      accent: '#1a7f37', // Green
      dim: '#d0d7de',
      text: '#24292f',
      textDim: '#57606a'
    }
  },
  // Placeholder for custom, structure copied from default initially
  custom: {
    id: 'custom',
    name: 'Custom',
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