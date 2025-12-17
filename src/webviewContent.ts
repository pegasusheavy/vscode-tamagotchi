import * as vscode from 'vscode';
import { TamagotchiState } from './tamagotchi';

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

function getPetSprite(state: TamagotchiState): string {
  const { mood, stats, currentAction } = state;

  // Different sprites based on stage
  const stageSprites: Record<string, Record<string, string>> = {
    egg: {
      idle: '🥚',
      happy: '🥚',
      neutral: '🥚',
      sad: '🥚',
      sleeping: '🥚',
      sick: '🥚',
      dead: '💔',
    },
    baby: {
      idle: '🐣',
      happy: '🐥',
      neutral: '🐣',
      sad: '😢',
      sleeping: '😴',
      sick: '🤒',
      dead: '💀',
      eating: '😋',
      playing: '🎉',
      cleaning: '🛁',
    },
    child: {
      idle: '🐱',
      happy: '😺',
      neutral: '🐱',
      sad: '😿',
      sleeping: '😴',
      sick: '🤒',
      dead: '💀',
      eating: '😋',
      playing: '🎮',
      cleaning: '🧼',
    },
    teen: {
      idle: '🐯',
      happy: '😸',
      neutral: '🐯',
      sad: '😿',
      sleeping: '😴',
      sick: '🤕',
      dead: '💀',
      eating: '🍖',
      playing: '⚽',
      cleaning: '🚿',
    },
    adult: {
      idle: '🦁',
      happy: '🦁',
      neutral: '🦁',
      sad: '😢',
      sleeping: '😴',
      sick: '🤒',
      dead: '💀',
      eating: '🍗',
      playing: '🏆',
      cleaning: '✨',
    },
  };

  const sprites = stageSprites[stats.stage] || stageSprites.baby;

  if (currentAction !== 'idle' && sprites[currentAction]) {
    return sprites[currentAction];
  }

  return sprites[mood] || sprites.idle;
}

export function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  state: TamagotchiState,
  themeName: string = 'classic'
): string {
  const theme = THEMES[themeName as keyof typeof THEMES] || THEMES.classic;
  const sprite = getPetSprite(state);
  const nonce = getNonce();

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
      background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
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
      font-size: 80px;
      line-height: 1;
      animation: bounce 1s ease-in-out infinite;
      display: inline-block;
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

    .stat-fill.low {
      background: #ff4444;
    }

    .stat-fill.medium {
      background: #ffaa00;
    }

    .stat-fill.high {
      background: #44ff44;
    }

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

    .action-btn:active {
      transform: translateY(0);
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .action-btn .icon {
      font-size: 1.2rem;
    }

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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="pet-name" id="petName">${state.name}</div>
      <div class="pet-stage" id="petStage">${state.stats.stage}</div>
    </div>

    <div class="pet-display">
      <div class="pet-sprite" id="petSprite">${sprite}</div>
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

    <div class="actions">
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

    <div class="message" id="message">Take care of your Tamagotchi!</div>

    <div class="age-display" id="ageDisplay">Age: ${state.stats.age} ticks</div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    // Pet sprite mappings
    const stageSprites = {
      egg: {
        idle: '🥚', happy: '🥚', neutral: '🥚', sad: '🥚',
        sleeping: '🥚', sick: '🥚', dead: '💔'
      },
      baby: {
        idle: '🐣', happy: '🐥', neutral: '🐣', sad: '😢',
        sleeping: '😴', sick: '🤒', dead: '💀',
        eating: '😋', playing: '🎉', cleaning: '🛁'
      },
      child: {
        idle: '🐱', happy: '😺', neutral: '🐱', sad: '😿',
        sleeping: '😴', sick: '🤒', dead: '💀',
        eating: '😋', playing: '🎮', cleaning: '🧼'
      },
      teen: {
        idle: '🐯', happy: '😸', neutral: '🐯', sad: '😿',
        sleeping: '😴', sick: '🤕', dead: '💀',
        eating: '🍖', playing: '⚽', cleaning: '🚿'
      },
      adult: {
        idle: '🦁', happy: '🦁', neutral: '🦁', sad: '😢',
        sleeping: '😴', sick: '🤒', dead: '💀',
        eating: '🍗', playing: '🏆', cleaning: '✨'
      }
    };

    function getPetSprite(state) {
      const sprites = stageSprites[state.stats.stage] || stageSprites.baby;
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
      spriteEl.textContent = getPetSprite(state);
      spriteEl.className = 'pet-sprite ' + (state.currentAction !== 'idle' ? state.currentAction : state.mood);

      document.getElementById('moodIndicator').textContent = 'Feeling ' + state.mood;

      // Update stats
      const stats = ['hunger', 'happiness', 'energy', 'cleanliness', 'health'];
      stats.forEach(stat => {
        const value = Math.round(state.stats[stat]);
        document.getElementById(stat + 'Value').textContent = value + '%';
        const bar = document.getElementById(stat + 'Bar');
        bar.style.width = value + '%';
        bar.className = 'stat-fill ' + getStatClass(value);
      });

      // Update buttons
      const isAlive = state.stats.isAlive;
      document.getElementById('feedBtn').disabled = !isAlive;
      document.getElementById('playBtn').disabled = !isAlive;
      document.getElementById('sleepBtn').disabled = !isAlive;
      document.getElementById('cleanBtn').disabled = !isAlive;

      document.getElementById('ageDisplay').textContent = 'Age: ' + state.stats.age + ' ticks';
    }

    function showMessage(text) {
      const msgEl = document.getElementById('message');
      msgEl.textContent = text;
      msgEl.style.opacity = '1';
    }

    // Button handlers
    document.getElementById('feedBtn').addEventListener('click', () => {
      vscode.postMessage({ command: 'feed' });
    });

    document.getElementById('playBtn').addEventListener('click', () => {
      vscode.postMessage({ command: 'play' });
    });

    document.getElementById('sleepBtn').addEventListener('click', () => {
      vscode.postMessage({ command: 'sleep' });
    });

    document.getElementById('cleanBtn').addEventListener('click', () => {
      vscode.postMessage({ command: 'clean' });
    });

    // Message handler
    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
        case 'stateUpdate':
          updateUI(message.state);
          break;
        case 'actionResult':
          showMessage(message.message);
          break;
      }
    });

    // Request initial state
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

