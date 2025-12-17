import * as vscode from 'vscode';
import { TamagotchiState } from './tamagotchi';

export interface PetColors {
  primary: string;
  secondary: string;
  accent: string;
  blush: string;
}

// Color presets for quick customization
export const COLOR_PRESETS: Record<string, PetColors> = {
  sakura: {
    primary: '#ffb7c5',
    secondary: '#ff69b4',
    accent: '#ffd700',
    blush: '#ffe4e9',
  },
  ocean: {
    primary: '#00bcd4',
    secondary: '#0077be',
    accent: '#7fdbff',
    blush: '#b3e5fc',
  },
  sunset: {
    primary: '#ff6b35',
    secondary: '#f72585',
    accent: '#ffd23f',
    blush: '#ffaa85',
  },
  forest: {
    primary: '#4caf50',
    secondary: '#2e7d32',
    accent: '#8bc34a',
    blush: '#a5d6a7',
  },
  galaxy: {
    primary: '#9c27b0',
    secondary: '#673ab7',
    accent: '#e040fb',
    blush: '#ce93d8',
  },
  candy: {
    primary: '#f48fb1',
    secondary: '#81d4fa',
    accent: '#fff176',
    blush: '#f8bbd9',
  },
  monochrome: {
    primary: '#9e9e9e',
    secondary: '#616161',
    accent: '#e0e0e0',
    blush: '#bdbdbd',
  },
};

const THEMES = {
  classic: {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    accent: '#e94560',
    accentSecondary: '#ff6b6b',
    text: '#eee',
    textMuted: '#aaa',
    statBar: '#e94560',
    buttonBg: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
    buttonHover: 'linear-gradient(135deg, #ff6b6b 0%, #e94560 100%)',
  },
  neon: {
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 50%, #0d0d0d 100%)',
    cardBg: 'rgba(0, 255, 255, 0.05)',
    accent: '#00ffff',
    accentSecondary: '#ff00ff',
    text: '#fff',
    textMuted: '#888',
    statBar: '#00ffff',
    buttonBg: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
    buttonHover: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
  },
  pastel: {
    bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ffecd2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.6)',
    accent: '#ff9a9e',
    accentSecondary: '#fecfef',
    text: '#5c5c5c',
    textMuted: '#888',
    statBar: '#ff9a9e',
    buttonBg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    buttonHover: 'linear-gradient(135deg, #fecfef 0%, #ff9a9e 100%)',
  },
  dark: {
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    accent: '#7c3aed',
    accentSecondary: '#a78bfa',
    text: '#e5e5e5',
    textMuted: '#737373',
    statBar: '#7c3aed',
    buttonBg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    buttonHover: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
  },
};

// SVG Sprites with CSS variable support
const SVG_SPRITES = {
  egg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="eggGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--pet-primary)"/>
        <stop offset="100%" stop-color="var(--pet-secondary)"/>
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="18" rx="10" ry="12" fill="url(#eggGrad)"/>
    <ellipse cx="12" cy="12" rx="3" ry="4" fill="rgba(255,255,255,0.4)"/>
    <path d="M10 14 L12 11 L14 15 L16 10 L18 14 L20 12 L22 15" stroke="var(--pet-accent)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="6" cy="10" r="1" fill="var(--pet-accent)" opacity="0.8"/>
    <circle cx="26" cy="14" r="1" fill="var(--pet-accent)" opacity="0.6"/>
  </svg>`,

  baby: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="babyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--pet-primary)"/>
        <stop offset="100%" stop-color="var(--pet-secondary)"/>
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="18" rx="11" ry="10" fill="url(#babyGrad)"/>
    <ellipse cx="12" cy="14" rx="4" ry="3" fill="rgba(255,255,255,0.25)"/>
    <ellipse cx="11" cy="16" rx="2.5" ry="3" fill="white"/>
    <circle cx="11" cy="16" r="1.5" fill="#1a1a2e"/>
    <circle cx="10.5" cy="15.5" r="0.5" fill="white"/>
    <ellipse cx="21" cy="16" rx="2.5" ry="3" fill="white"/>
    <circle cx="21" cy="16" r="1.5" fill="#1a1a2e"/>
    <circle cx="20.5" cy="15.5" r="0.5" fill="white"/>
    <ellipse cx="7" cy="20" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.7"/>
    <ellipse cx="25" cy="20" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.7"/>
    <path d="M13 22 Q16 25 19 22" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="11" cy="27" rx="3" ry="2" fill="var(--pet-secondary)"/>
    <ellipse cx="21" cy="27" rx="3" ry="2" fill="var(--pet-secondary)"/>
    <path d="M16 8 Q14 4 12 6" stroke="var(--pet-primary)" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="12" cy="6" r="1.5" fill="var(--pet-accent)"/>
  </svg>`,

  child: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="childGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--pet-primary)"/>
        <stop offset="100%" stop-color="var(--pet-secondary)"/>
      </linearGradient>
    </defs>
    <ellipse cx="7" cy="8" rx="4" ry="5" fill="url(#childGrad)"/>
    <ellipse cx="7" cy="8" rx="2" ry="3" fill="var(--pet-blush)"/>
    <ellipse cx="25" cy="8" rx="4" ry="5" fill="url(#childGrad)"/>
    <ellipse cx="25" cy="8" rx="2" ry="3" fill="var(--pet-blush)"/>
    <circle cx="16" cy="14" r="10" fill="url(#childGrad)"/>
    <ellipse cx="12" cy="10" rx="4" ry="3" fill="rgba(255,255,255,0.25)"/>
    <ellipse cx="11" cy="13" rx="2.5" ry="3" fill="white"/>
    <circle cx="11" cy="13" r="1.8" fill="#1a1a2e"/>
    <circle cx="10.3" cy="12.3" r="0.6" fill="white"/>
    <ellipse cx="21" cy="13" rx="2.5" ry="3" fill="white"/>
    <circle cx="21" cy="13" r="1.8" fill="#1a1a2e"/>
    <circle cx="20.3" cy="12.3" r="0.6" fill="white"/>
    <ellipse cx="16" cy="16" rx="1.5" ry="1" fill="var(--pet-blush)"/>
    <ellipse cx="7" cy="16" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.6"/>
    <ellipse cx="25" cy="16" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.6"/>
    <path d="M13 19 Q16 22 19 19" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="16" cy="26" rx="6" ry="4" fill="url(#childGrad)"/>
    <ellipse cx="12" cy="29" rx="2.5" ry="1.5" fill="var(--pet-secondary)"/>
    <ellipse cx="20" cy="29" rx="2.5" ry="1.5" fill="var(--pet-secondary)"/>
    <line x1="3" y1="14" x2="7" y2="15" stroke="#1a1a2e" stroke-width="0.8" stroke-linecap="round"/>
    <line x1="3" y1="17" x2="7" y2="17" stroke="#1a1a2e" stroke-width="0.8" stroke-linecap="round"/>
    <line x1="25" y1="15" x2="29" y2="14" stroke="#1a1a2e" stroke-width="0.8" stroke-linecap="round"/>
    <line x1="25" y1="17" x2="29" y2="17" stroke="#1a1a2e" stroke-width="0.8" stroke-linecap="round"/>
  </svg>`,

  teen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="teenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--pet-primary)"/>
        <stop offset="100%" stop-color="var(--pet-secondary)"/>
      </linearGradient>
    </defs>
    <path d="M5 12 L8 3 L11 10" fill="url(#teenGrad)"/>
    <path d="M6 10 L8 5 L10 9" fill="var(--pet-blush)"/>
    <path d="M21 10 L24 3 L27 12" fill="url(#teenGrad)"/>
    <path d="M22 9 L24 5 L26 10" fill="var(--pet-blush)"/>
    <circle cx="16" cy="14" r="10" fill="url(#teenGrad)"/>
    <path d="M11 7 L13 10" stroke="var(--pet-accent)" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M15 6 L16 10" stroke="var(--pet-accent)" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M19 7 L21 10" stroke="var(--pet-accent)" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="11" cy="11" rx="3" ry="2" fill="rgba(255,255,255,0.2)"/>
    <ellipse cx="11" cy="13" rx="3" ry="3.5" fill="white"/>
    <circle cx="11" cy="13" r="2" fill="#1a1a2e"/>
    <circle cx="10" cy="12" r="0.8" fill="white"/>
    <ellipse cx="21" cy="13" rx="3" ry="3.5" fill="white"/>
    <circle cx="21" cy="13" r="2" fill="#1a1a2e"/>
    <circle cx="20" cy="12" r="0.8" fill="white"/>
    <path d="M15 16 L16 17.5 L17 16 Z" fill="#1a1a2e"/>
    <ellipse cx="6" cy="16" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.7"/>
    <ellipse cx="26" cy="16" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.7"/>
    <path d="M12 20 Q16 23 20 20" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="16" cy="27" rx="7" ry="4" fill="url(#teenGrad)"/>
    <path d="M12 25 L11 29" stroke="var(--pet-accent)" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M16 24 L16 29" stroke="var(--pet-accent)" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M20 25 L21 29" stroke="var(--pet-accent)" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="10" cy="30" rx="3" ry="2" fill="var(--pet-secondary)"/>
    <ellipse cx="22" cy="30" rx="3" ry="2" fill="var(--pet-secondary)"/>
  </svg>`,

  adult: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="adultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--pet-primary)"/>
        <stop offset="100%" stop-color="var(--pet-secondary)"/>
      </linearGradient>
      <radialGradient id="maneGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="var(--pet-accent)"/>
        <stop offset="100%" stop-color="var(--pet-primary)"/>
      </radialGradient>
    </defs>
    <path d="M4 16 L6 8 L10 14 L12 6 L16 12 L20 6 L22 14 L26 8 L28 16" fill="url(#maneGrad)"/>
    <path d="M3 18 L5 12 L8 17" fill="url(#maneGrad)"/>
    <path d="M24 17 L27 12 L29 18" fill="url(#maneGrad)"/>
    <circle cx="16" cy="16" r="10" fill="url(#adultGrad)"/>
    <ellipse cx="11" cy="12" rx="4" ry="3" fill="rgba(255,255,255,0.2)"/>
    <path d="M14 7 L16 4 L18 7 L16 9 Z" fill="var(--pet-accent)"/>
    <circle cx="16" cy="6.5" r="1" fill="white" opacity="0.6"/>
    <ellipse cx="11" cy="14" rx="3" ry="3.5" fill="white"/>
    <circle cx="11" cy="14" r="2.2" fill="#1a1a2e"/>
    <circle cx="10" cy="13" r="0.9" fill="white"/>
    <circle cx="12" cy="15" r="0.4" fill="var(--pet-accent)"/>
    <ellipse cx="21" cy="14" rx="3" ry="3.5" fill="white"/>
    <circle cx="21" cy="14" r="2.2" fill="#1a1a2e"/>
    <circle cx="20" cy="13" r="0.9" fill="white"/>
    <circle cx="22" cy="15" r="0.4" fill="var(--pet-accent)"/>
    <path d="M8 10 L14 11" stroke="var(--pet-secondary)" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M18 11 L24 10" stroke="var(--pet-secondary)" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="16" cy="17" rx="2" ry="1.5" fill="var(--pet-blush)"/>
    <ellipse cx="6" cy="17" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.6"/>
    <ellipse cx="26" cy="17" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.6"/>
    <path d="M12 21 Q16 24 20 21" stroke="#1a1a2e" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M13 21 L12.5 23" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M19 21 L19.5 23" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="16" cy="28" rx="8" ry="4" fill="url(#adultGrad)"/>
    <ellipse cx="16" cy="26" rx="3" ry="2" fill="var(--pet-accent)"/>
    <ellipse cx="9" cy="30" rx="3" ry="2" fill="var(--pet-secondary)"/>
    <ellipse cx="23" cy="30" rx="3" ry="2" fill="var(--pet-secondary)"/>
    <circle cx="4" cy="6" r="1" fill="var(--pet-accent)" opacity="0.8"/>
    <circle cx="28" cy="8" r="0.8" fill="var(--pet-accent)" opacity="0.6"/>
  </svg>`,

  sleeping: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="sleepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--pet-primary)"/>
        <stop offset="100%" stop-color="var(--pet-secondary)"/>
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="20" rx="12" ry="8" fill="url(#sleepGrad)"/>
    <circle cx="12" cy="14" r="8" fill="url(#sleepGrad)"/>
    <ellipse cx="9" cy="11" rx="3" ry="2" fill="rgba(255,255,255,0.2)"/>
    <path d="M7 13 Q9 11 11 13" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M13 13 Q15 11 17 13" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="5" cy="15" rx="1.5" ry="1" fill="var(--pet-blush)" opacity="0.7"/>
    <ellipse cx="19" cy="15" rx="1.5" ry="1" fill="var(--pet-blush)" opacity="0.7"/>
    <path d="M10 17 Q12 19 14 17" stroke="#1a1a2e" stroke-width="1" fill="none" stroke-linecap="round"/>
    <ellipse cx="6" cy="8" rx="3" ry="4" fill="url(#sleepGrad)"/>
    <ellipse cx="6" cy="8" rx="1.5" ry="2" fill="var(--pet-blush)"/>
    <path d="M26 18 Q30 14 28 22 Q26 26 22 24" stroke="url(#sleepGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="22" y="8" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="var(--pet-accent)">Z</text>
    <text x="25" y="5" font-family="Arial, sans-serif" font-size="4" font-weight="bold" fill="var(--pet-accent)" opacity="0.7">Z</text>
    <text x="27" y="3" font-family="Arial, sans-serif" font-size="3" font-weight="bold" fill="var(--pet-accent)" opacity="0.5">z</text>
    <ellipse cx="24" cy="24" rx="2" ry="1.5" fill="var(--pet-secondary)"/>
  </svg>`,

  sick: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="sickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--pet-primary)"/>
        <stop offset="100%" stop-color="var(--pet-secondary)"/>
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="22" rx="10" ry="7" fill="url(#sickGrad)" opacity="0.8"/>
    <circle cx="16" cy="13" r="9" fill="url(#sickGrad)" opacity="0.8"/>
    <path d="M24 8 Q26 10 25 12 Q24 14 23 12 Q22 10 24 8" fill="#4cc9ff"/>
    <rect x="3" y="14" width="8" height="2" rx="1" fill="white"/>
    <rect x="3" y="14" width="5" height="2" rx="1" fill="#ff4444"/>
    <circle cx="2" cy="15" r="2" fill="white"/>
    <circle cx="2" cy="15" r="1.5" fill="#ff4444"/>
    <circle cx="11" cy="12" r="3" fill="white"/>
    <path d="M9 10 L13 14 M9 14 L13 10" stroke="#1a1a2e" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="21" cy="12" r="3" fill="white"/>
    <path d="M19 10 L23 14 M19 14 L23 10" stroke="#1a1a2e" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M12 19 Q16 16 20 19" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="7" cy="15" rx="2" ry="1.5" fill="#98fb98" opacity="0.5"/>
    <ellipse cx="25" cy="15" rx="2" ry="1.5" fill="#98fb98" opacity="0.5"/>
    <ellipse cx="12" cy="28" rx="3" ry="2" fill="var(--pet-secondary)" opacity="0.7"/>
    <ellipse cx="20" cy="28" rx="3" ry="2" fill="var(--pet-secondary)" opacity="0.7"/>
  </svg>`,

  dead: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="deadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#888888"/>
        <stop offset="100%" stop-color="#555555"/>
      </linearGradient>
    </defs>
    <path d="M8 28 L8 14 Q8 6 16 6 Q24 6 24 14 L24 28 Q22 26 20 28 Q18 30 16 28 Q14 26 12 28 Q10 30 8 28" fill="url(#deadGrad)" opacity="0.6"/>
    <ellipse cx="16" cy="4" rx="6" ry="2" fill="none" stroke="var(--pet-accent)" stroke-width="1.5"/>
    <path d="M10 13 L14 17 M10 17 L14 13" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>
    <path d="M18 13 L22 17 M18 17 L22 13" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="16" cy="22" rx="3" ry="2" fill="#1a1a2e"/>
    <path d="M24 16 Q26 18 25 20 Q24 22 23 20 Q22 18 24 16" fill="#4cc9ff" opacity="0.8"/>
    <circle cx="10" cy="8" r="0.8" fill="white" opacity="0.5"/>
    <circle cx="22" cy="6" r="0.6" fill="white" opacity="0.4"/>
  </svg>`,

  dirty: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="dirtyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--pet-primary)"/>
        <stop offset="100%" stop-color="var(--pet-secondary)"/>
      </linearGradient>
      <linearGradient id="poopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#8B6914"/>
        <stop offset="50%" stop-color="#6B4423"/>
        <stop offset="100%" stop-color="#4A2C17"/>
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="18" rx="9" ry="8" fill="url(#dirtyGrad)" opacity="0.85"/>
    <ellipse cx="12" cy="20" rx="2" ry="1" fill="#8B6914" opacity="0.4"/>
    <ellipse cx="20" cy="17" rx="1.5" ry="1" fill="#8B6914" opacity="0.3"/>
    <circle cx="16" cy="12" r="8" fill="url(#dirtyGrad)" opacity="0.85"/>
    <ellipse cx="13" cy="9" rx="3" ry="2" fill="rgba(255,255,255,0.15)"/>
    <ellipse cx="12" cy="11" rx="2.5" ry="2.5" fill="white"/>
    <circle cx="12" cy="11" r="1.5" fill="#1a1a2e"/>
    <circle cx="11.5" cy="10.5" r="0.5" fill="white"/>
    <ellipse cx="20" cy="11" rx="2.5" ry="2.5" fill="white"/>
    <circle cx="20" cy="11" r="1.5" fill="#1a1a2e"/>
    <circle cx="19.5" cy="10.5" r="0.5" fill="white"/>
    <path d="M24 7 Q25 9 24.5 10 Q24 11 23.5 10 Q23 9 24 7" fill="#87CEEB"/>
    <path d="M13 16 Q14.5 14.5 16 16 Q17.5 17.5 19 16" stroke="#1a1a2e" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M4 14 Q5 12 4 10" stroke="#98D982" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M6 16 Q7 14 6 12" stroke="#98D982" stroke-width="0.8" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M26 12 Q27 10 26 8" stroke="#98D982" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M28 14 Q29 12 28 10" stroke="#98D982" stroke-width="0.8" fill="none" stroke-linecap="round" opacity="0.5"/>
    <ellipse cx="5" cy="26" rx="3" ry="1.5" fill="#4A2C17"/>
    <ellipse cx="5" cy="24.5" rx="2.5" ry="1.5" fill="url(#poopGrad)"/>
    <ellipse cx="5" cy="23" rx="2" ry="1.3" fill="url(#poopGrad)"/>
    <ellipse cx="5" cy="21.8" rx="1.3" ry="1" fill="url(#poopGrad)"/>
    <circle cx="5" cy="20.5" r="0.8" fill="#6B4423"/>
    <ellipse cx="4" cy="22.5" rx="0.5" ry="0.8" fill="rgba(255,255,255,0.2)"/>
    <ellipse cx="27" cy="27" rx="2.5" ry="1.2" fill="#4A2C17"/>
    <ellipse cx="27" cy="25.8" rx="2" ry="1.2" fill="url(#poopGrad)"/>
    <ellipse cx="27" cy="24.8" rx="1.5" ry="1" fill="url(#poopGrad)"/>
    <circle cx="27" cy="23.8" r="0.7" fill="#6B4423"/>
    <ellipse cx="26.3" cy="25" rx="0.4" ry="0.6" fill="rgba(255,255,255,0.2)"/>
    <ellipse cx="8" cy="18" rx="0.8" ry="0.5" fill="#2a2a2a"/>
    <path d="M7.5 17.5 Q7 17 6.5 17.5" stroke="#555" stroke-width="0.3" fill="none"/>
    <path d="M8.5 17.5 Q9 17 9.5 17.5" stroke="#555" stroke-width="0.3" fill="none"/>
    <ellipse cx="24" cy="20" rx="0.7" ry="0.4" fill="#2a2a2a"/>
    <path d="M23.5 19.5 Q23 19 22.7 19.3" stroke="#555" stroke-width="0.3" fill="none"/>
    <path d="M24.5 19.5 Q25 19 25.3 19.3" stroke="#555" stroke-width="0.3" fill="none"/>
    <ellipse cx="12" cy="25" rx="2.5" ry="1.5" fill="var(--pet-secondary)" opacity="0.8"/>
    <ellipse cx="20" cy="25" rx="2.5" ry="1.5" fill="var(--pet-secondary)" opacity="0.8"/>
  </svg>`,
};

// Emoji fallbacks
const EMOJI_SPRITES = {
  egg: { idle: '🥚', happy: '🥚', neutral: '🥚', sad: '🥚', sleeping: '🥚', sick: '🥚', dead: '💔' },
  baby: { idle: '🐣', happy: '🐥', neutral: '🐣', sad: '😢', sleeping: '😴', sick: '🤒', dead: '💀', eating: '😋', playing: '🎉', cleaning: '🛁' },
  child: { idle: '🐱', happy: '😺', neutral: '🐱', sad: '😿', sleeping: '😴', sick: '🤒', dead: '💀', eating: '😋', playing: '🎮', cleaning: '🧼' },
  teen: { idle: '🐯', happy: '😸', neutral: '🐯', sad: '😿', sleeping: '😴', sick: '🤕', dead: '💀', eating: '🍖', playing: '⚽', cleaning: '🚿' },
  adult: { idle: '🦁', happy: '🦁', neutral: '🦁', sad: '😢', sleeping: '😴', sick: '🤒', dead: '💀', eating: '🍗', playing: '🏆', cleaning: '✨' },
};

function getSvgSprite(state: TamagotchiState): string {
  const { mood, stats, currentAction } = state;

  if (!stats.isAlive) return SVG_SPRITES.dead;
  if (currentAction === 'sleeping' || mood === 'sleeping') return SVG_SPRITES.sleeping;
  if (mood === 'sick') return SVG_SPRITES.sick;
  // Show dirty sprite when cleanliness drops below 30%
  if (stats.cleanliness < 30) return SVG_SPRITES.dirty;

  return SVG_SPRITES[stats.stage as keyof typeof SVG_SPRITES] || SVG_SPRITES.baby;
}

function getEmojiSprite(state: TamagotchiState): string {
  const { mood, stats, currentAction } = state;
  const sprites = EMOJI_SPRITES[stats.stage as keyof typeof EMOJI_SPRITES] || EMOJI_SPRITES.baby;

  if (currentAction !== 'idle' && sprites[currentAction as keyof typeof sprites]) {
    return sprites[currentAction as keyof typeof sprites];
  }

  return sprites[mood as keyof typeof sprites] || sprites.idle;
}

export function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  state: TamagotchiState,
  themeName: string = 'classic',
  useCustomSprites: boolean = true,
  petColors: PetColors = { primary: '#ff6b9d', secondary: '#c44cff', accent: '#ffe14c', blush: '#ffb3d9' }
): string {
  const theme = THEMES[themeName as keyof typeof THEMES] || THEMES.classic;
  const nonce = getNonce();

  const spriteContent = useCustomSprites ? getSvgSprite(state) : '';
  const emojiContent = getEmojiSprite(state);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>Tamagotchi</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --bg: ${theme.bg};
      --card-bg: ${theme.cardBg};
      --accent: ${theme.accent};
      --accent-secondary: ${theme.accentSecondary};
      --text: ${theme.text};
      --text-muted: ${theme.textMuted};
      --stat-bar: ${theme.statBar};
      --button-bg: ${theme.buttonBg};
      --button-hover: ${theme.buttonHover};

      /* Pet colors - customizable */
      --pet-primary: ${petColors.primary};
      --pet-secondary: ${petColors.secondary};
      --pet-accent: ${petColors.accent};
      --pet-blush: ${petColors.blush};
      --pet-eyes: #1a1a2e;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      overflow-x: hidden;
    }

    .container {
      width: 100%;
      max-width: 320px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .header {
      text-align: center;
    }

    .pet-name {
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, var(--pet-primary), var(--pet-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .pet-stage {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .pet-display {
      background: var(--card-bg);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .pet-sprite {
      width: 120px;
      height: 120px;
      margin: 0 auto;
      animation: bounce 1s ease-in-out infinite;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pet-sprite.emoji-mode {
      font-size: 80px;
      line-height: 1;
    }

    .pet-sprite.sleeping {
      animation: sleep 2s ease-in-out infinite;
    }

    .pet-sprite.eating {
      animation: eat 0.3s ease-in-out infinite;
    }

    .pet-sprite.playing {
      animation: play 0.5s ease-in-out infinite;
    }

    .pet-sprite.dead {
      animation: none;
      opacity: 0.5;
    }

    .pet-sprite svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes sleep {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(5px) scale(0.95); }
    }

    @keyframes eat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    @keyframes play {
      0% { transform: rotate(-10deg); }
      50% { transform: rotate(10deg); }
      100% { transform: rotate(-10deg); }
    }

    .mood-indicator {
      margin-top: 10px;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .stats-container {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .stat {
      margin-bottom: 12px;
    }

    .stat:last-child {
      margin-bottom: 0;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 0.85rem;
    }

    .stat-label {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-value {
      color: var(--text-muted);
    }

    .stat-bar {
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .stat-fill {
      height: 100%;
      background: var(--stat-bar);
      border-radius: 4px;
      transition: width 0.5s ease, background-color 0.3s ease;
    }

    .stat-fill.low { background: #ff4444; }
    .stat-fill.medium { background: #ffaa00; }
    .stat-fill.high { background: #44ff44; }

    .actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .action-btn {
      padding: 14px 16px;
      border: none;
      border-radius: 12px;
      background: var(--button-bg);
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .action-btn:hover {
      background: var(--button-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }

    .action-btn:active { transform: translateY(0); }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .action-btn .icon { font-size: 1.2rem; }

    .message {
      text-align: center;
      padding: 10px;
      background: var(--card-bg);
      border-radius: 10px;
      font-size: 0.9rem;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .age-display {
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .restart-container {
      text-align: center;
    }

    .restart-btn {
      width: 100%;
      padding: 18px 24px;
      font-size: 1rem;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      animation: pulse-glow 2s ease-in-out infinite;
    }

    .restart-btn:hover {
      background: linear-gradient(135deg, #45a049 0%, #4CAF50 100%);
      transform: translateY(-3px);
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4); }
      50% { box-shadow: 0 4px 25px rgba(76, 175, 80, 0.7); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="pet-name" id="petName">${state.name}</div>
      <div class="pet-stage" id="petStage">${state.stats.stage}</div>
    </div>

    <div class="pet-display">
      <div class="pet-sprite ${useCustomSprites ? '' : 'emoji-mode'}" id="petSprite">
        ${useCustomSprites ? spriteContent : emojiContent}
      </div>
      <div class="mood-indicator" id="moodIndicator">Feeling ${state.mood}</div>
    </div>

    <div class="stats-container">
      <div class="stat">
        <div class="stat-header">
          <span class="stat-label">🍖 Hunger</span>
          <span class="stat-value" id="hungerValue">${Math.round(state.stats.hunger)}%</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill" id="hungerBar" style="width: ${state.stats.hunger}%"></div>
        </div>
      </div>

      <div class="stat">
        <div class="stat-header">
          <span class="stat-label">😊 Happiness</span>
          <span class="stat-value" id="happinessValue">${Math.round(state.stats.happiness)}%</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill" id="happinessBar" style="width: ${state.stats.happiness}%"></div>
        </div>
      </div>

      <div class="stat">
        <div class="stat-header">
          <span class="stat-label">⚡ Energy</span>
          <span class="stat-value" id="energyValue">${Math.round(state.stats.energy)}%</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill" id="energyBar" style="width: ${state.stats.energy}%"></div>
        </div>
      </div>

      <div class="stat">
        <div class="stat-header">
          <span class="stat-label">🧼 Cleanliness</span>
          <span class="stat-value" id="cleanlinessValue">${Math.round(state.stats.cleanliness)}%</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill" id="cleanlinessBar" style="width: ${state.stats.cleanliness}%"></div>
        </div>
      </div>

      <div class="stat">
        <div class="stat-header">
          <span class="stat-label">❤️ Health</span>
          <span class="stat-value" id="healthValue">${Math.round(state.stats.health)}%</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill" id="healthBar" style="width: ${state.stats.health}%"></div>
        </div>
      </div>
    </div>

    <div class="actions" id="actionsContainer" style="${!state.stats.isAlive ? 'display: none;' : ''}">
      <button class="action-btn" id="feedBtn" ${!state.stats.isAlive ? 'disabled' : ''}>
        <span class="icon">🍖</span> Feed
      </button>
      <button class="action-btn" id="playBtn" ${!state.stats.isAlive ? 'disabled' : ''}>
        <span class="icon">🎾</span> Play
      </button>
      <button class="action-btn" id="sleepBtn" ${!state.stats.isAlive ? 'disabled' : ''}>
        <span class="icon">💤</span> Sleep
      </button>
      <button class="action-btn" id="cleanBtn" ${!state.stats.isAlive ? 'disabled' : ''}>
        <span class="icon">🛁</span> Clean
      </button>
    </div>

    <div class="restart-container" id="restartContainer" style="${state.stats.isAlive ? 'display: none;' : ''}">
      <button class="action-btn restart-btn" id="restartBtn">
        <span class="icon">🔄</span> Start New Tamagotchi
      </button>
    </div>

    <div class="message" id="message">${!state.stats.isAlive ? '💔 Your Tamagotchi has passed away...' : 'Take care of your Tamagotchi!'}</div>

    <div class="age-display" id="ageDisplay">Age: ${state.stats.age} ticks</div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const useCustomSprites = ${useCustomSprites};

    const SVG_SPRITES = {
      egg: \`${SVG_SPRITES.egg.replace(/`/g, '\\`')}\`,
      baby: \`${SVG_SPRITES.baby.replace(/`/g, '\\`')}\`,
      child: \`${SVG_SPRITES.child.replace(/`/g, '\\`')}\`,
      teen: \`${SVG_SPRITES.teen.replace(/`/g, '\\`')}\`,
      adult: \`${SVG_SPRITES.adult.replace(/`/g, '\\`')}\`,
      sleeping: \`${SVG_SPRITES.sleeping.replace(/`/g, '\\`')}\`,
      sick: \`${SVG_SPRITES.sick.replace(/`/g, '\\`')}\`,
      dead: \`${SVG_SPRITES.dead.replace(/`/g, '\\`')}\`,
      dirty: \`${SVG_SPRITES.dirty.replace(/`/g, '\\`')}\`,
    };

    const EMOJI_SPRITES = ${JSON.stringify(EMOJI_SPRITES)};

    function getSvgSprite(state) {
      if (!state.stats.isAlive) return SVG_SPRITES.dead;
      if (state.currentAction === 'sleeping' || state.mood === 'sleeping') return SVG_SPRITES.sleeping;
      if (state.mood === 'sick') return SVG_SPRITES.sick;
      if (state.stats.cleanliness < 30) return SVG_SPRITES.dirty;
      return SVG_SPRITES[state.stats.stage] || SVG_SPRITES.baby;
    }

    function getEmojiSprite(state) {
      const sprites = EMOJI_SPRITES[state.stats.stage] || EMOJI_SPRITES.baby;
      if (state.currentAction !== 'idle' && sprites[state.currentAction]) {
        return sprites[state.currentAction];
      }
      return sprites[state.mood] || sprites.idle;
    }

    function getStatClass(value) {
      if (value < 30) return 'low';
      if (value < 60) return 'medium';
      return 'high';
    }

    function updateUI(state) {
      document.getElementById('petName').textContent = state.name;
      document.getElementById('petStage').textContent = state.stats.stage;

      const spriteEl = document.getElementById('petSprite');
      if (useCustomSprites) {
        spriteEl.innerHTML = getSvgSprite(state);
        spriteEl.className = 'pet-sprite ' + (state.currentAction !== 'idle' ? state.currentAction : state.mood);
      } else {
        spriteEl.textContent = getEmojiSprite(state);
        spriteEl.className = 'pet-sprite emoji-mode ' + (state.currentAction !== 'idle' ? state.currentAction : state.mood);
      }

      document.getElementById('moodIndicator').textContent = 'Feeling ' + state.mood;

      const stats = ['hunger', 'happiness', 'energy', 'cleanliness', 'health'];
      stats.forEach(stat => {
        const value = Math.round(state.stats[stat]);
        document.getElementById(stat + 'Value').textContent = value + '%';
        const bar = document.getElementById(stat + 'Bar');
        bar.style.width = value + '%';
        bar.className = 'stat-fill ' + getStatClass(value);
      });

      const isAlive = state.stats.isAlive;
      document.getElementById('feedBtn').disabled = !isAlive;
      document.getElementById('playBtn').disabled = !isAlive;
      document.getElementById('sleepBtn').disabled = !isAlive;
      document.getElementById('cleanBtn').disabled = !isAlive;

      // Show/hide actions vs restart button
      document.getElementById('actionsContainer').style.display = isAlive ? '' : 'none';
      document.getElementById('restartContainer').style.display = isAlive ? 'none' : '';

      // Update message for dead state
      if (!isAlive) {
        document.getElementById('message').textContent = '💔 Your Tamagotchi has passed away...';
      }

      document.getElementById('ageDisplay').textContent = 'Age: ' + state.stats.age + ' ticks';
    }

    function showMessage(text) {
      document.getElementById('message').textContent = text;
    }

    document.getElementById('feedBtn').addEventListener('click', () => vscode.postMessage({ command: 'feed' }));
    document.getElementById('playBtn').addEventListener('click', () => vscode.postMessage({ command: 'play' }));
    document.getElementById('sleepBtn').addEventListener('click', () => vscode.postMessage({ command: 'sleep' }));
    document.getElementById('cleanBtn').addEventListener('click', () => vscode.postMessage({ command: 'clean' }));
    document.getElementById('restartBtn').addEventListener('click', () => vscode.postMessage({ command: 'restart' }));

    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
        case 'stateUpdate': updateUI(message.state); break;
        case 'actionResult': showMessage(message.message); break;
      }
    });

    vscode.postMessage({ command: 'getState' });
  </script>
</body>
</html>`;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
