/**
 * Theme Presets for the 3D Animated Resume Portfolio.
 * Inspired by futuristic electric blue, cyan, white, and deep navy design reference.
 */

export const THEME_PRESETS = [
  {
    id: 'blue-futuristic',
    name: 'Blue & White Futuristic',
    description: 'Electric blue, cyan, deep navy background with crisp white typography and neon energy rings.',
    category: 'Cyber Tech',
    isDark: true,
    colors: {
      primary: '#00f0ff',       // Electric Cyan
      secondary: '#3b82f6',     // Electric Blue
      accent: '#8b5cf6',        // Violet Glow
      background: '#030712',    // Deep Navy/Black
      cardBg: 'rgba(11, 19, 39, 0.7)',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      border: 'rgba(0, 240, 255, 0.25)',
      glow: 'rgba(0, 240, 255, 0.35)',
    },
  },
  {
    id: 'midnight-navy',
    name: 'Midnight Navy & Cyan',
    description: 'Deep celestial navy blue with icy cyan highlights and soft blue undertones.',
    category: 'Executive Dark',
    isDark: true,
    colors: {
      primary: '#38bdf8',       // Sky Cyan
      secondary: '#1d4ed8',     // Royal Blue
      accent: '#06b6d4',        // Deep Cyan
      background: '#020b1e',    // Pure Navy
      cardBg: 'rgba(8, 22, 54, 0.75)',
      textPrimary: '#ffffff',
      textSecondary: '#93c5fd',
      border: 'rgba(56, 189, 248, 0.25)',
      glow: 'rgba(56, 189, 248, 0.3)',
    },
  },
  {
    id: 'purple-neon',
    name: 'Purple & Neon Blue',
    description: 'Vibrant synthwave aesthetic with neon purple, ultraviolet glow, and cyan accents.',
    category: 'Vibrant Synth',
    isDark: true,
    colors: {
      primary: '#a855f7',       // Neon Violet
      secondary: '#00f0ff',     // Cyan Accent
      accent: '#ec4899',        // Soft Pink
      background: '#08031a',    // Dark Violet Navy
      cardBg: 'rgba(23, 10, 48, 0.75)',
      textPrimary: '#faf5ff',
      textSecondary: '#d8b4fe',
      border: 'rgba(168, 85, 247, 0.3)',
      glow: 'rgba(168, 85, 247, 0.4)',
    },
  },
  {
    id: 'emerald-black',
    name: 'Emerald & Black',
    description: 'High-contrast matrix tech theme with glowing emerald green and deep obsidian panels.',
    category: 'Matrix Tech',
    isDark: true,
    colors: {
      primary: '#10b981',       // Emerald Green
      secondary: '#06b6d4',     // Cyan
      accent: '#34d399',        // Mint
      background: '#020d08',    // Deep Obsidian
      cardBg: 'rgba(6, 30, 20, 0.75)',
      textPrimary: '#f0fdf4',
      textSecondary: '#86efac',
      border: 'rgba(16, 185, 129, 0.28)',
      glow: 'rgba(16, 185, 129, 0.35)',
    },
  },
  {
    id: 'white-silver-minimal',
    name: 'White & Silver Minimal',
    description: 'Clean Scandinavian light theme with crisp white panels, silver borders, and subtle blue highlights.',
    category: 'Clean Light',
    isDark: false,
    colors: {
      primary: '#2563eb',       // Modern Royal Blue
      secondary: '#0284c7',     // Sky Blue
      accent: '#7c3aed',        // Royal Violet
      background: '#f8fafc',    // Pure Crisp Light
      cardBg: 'rgba(255, 255, 255, 0.92)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      border: 'rgba(37, 99, 235, 0.2)',
      glow: 'rgba(37, 99, 235, 0.15)',
    },
  },
  {
    id: 'black-gold-premium',
    name: 'Black & Gold Premium',
    description: 'Ultra-luxurious dark theme with molten gold gradients, warm bronze accents, and deep jet black.',
    category: 'Luxury Modern',
    isDark: true,
    colors: {
      primary: '#fbbf24',       // Molten Gold
      secondary: '#f59e0b',     // Amber
      accent: '#38bdf8',        // Blue Contrast
      background: '#090805',    // Jet Black
      cardBg: 'rgba(26, 21, 10, 0.8)',
      textPrimary: '#fffbeb',
      textSecondary: '#fcd34d',
      border: 'rgba(251, 191, 36, 0.3)',
      glow: 'rgba(251, 191, 36, 0.35)',
    },
  },
];

export const DEFAULT_THEME_ID = 'blue-futuristic';
