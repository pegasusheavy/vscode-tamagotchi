import { Component, signal, computed } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  blush: string;
}

@Component({
  selector: 'app-colors',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section id="colors" class="py-32 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold mb-4">Color <span class="gradient-text">Customization</span></h2>
          <p class="text-xl text-white/60 max-w-2xl mx-auto">
            Make your pet truly unique with custom colors or choose from beautiful presets
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-start">
          <!-- Color Controls -->
          <div class="glass rounded-3xl p-8">
            <h3 class="text-xl font-bold mb-6">Color Presets</h3>
            <div class="grid grid-cols-4 gap-4 mb-8">
              @for (preset of presets; track preset.name) {
                <button
                  (click)="selectPreset(preset)"
                  class="text-center group"
                  [class.ring-2]="selectedPreset()?.name === preset.name"
                  [class.ring-white]="selectedPreset()?.name === preset.name">
                  <div class="w-12 h-12 mx-auto rounded-full mb-2 transition-transform group-hover:scale-110"
                       [style.background]="'linear-gradient(135deg, ' + preset.primary + ', ' + preset.secondary + ')'">
                  </div>
                  <span class="text-xs text-white/70">{{ preset.name }}</span>
                </button>
              }
            </div>

            <h3 class="text-xl font-bold mb-6">Custom Colors</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <label class="w-24 text-sm text-white/70">Primary</label>
                <input type="color" [(ngModel)]="customColors.primary" (ngModelChange)="updateCustom()"
                       class="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0"/>
                <input type="text" [(ngModel)]="customColors.primary" (ngModelChange)="updateCustom()"
                       class="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm font-mono"/>
              </div>
              <div class="flex items-center gap-4">
                <label class="w-24 text-sm text-white/70">Secondary</label>
                <input type="color" [(ngModel)]="customColors.secondary" (ngModelChange)="updateCustom()"
                       class="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0"/>
                <input type="text" [(ngModel)]="customColors.secondary" (ngModelChange)="updateCustom()"
                       class="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm font-mono"/>
              </div>
              <div class="flex items-center gap-4">
                <label class="w-24 text-sm text-white/70">Accent</label>
                <input type="color" [(ngModel)]="customColors.accent" (ngModelChange)="updateCustom()"
                       class="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0"/>
                <input type="text" [(ngModel)]="customColors.accent" (ngModelChange)="updateCustom()"
                       class="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm font-mono"/>
              </div>
              <div class="flex items-center gap-4">
                <label class="w-24 text-sm text-white/70">Blush</label>
                <input type="color" [(ngModel)]="customColors.blush" (ngModelChange)="updateCustom()"
                       class="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0"/>
                <input type="text" [(ngModel)]="customColors.blush" (ngModelChange)="updateCustom()"
                       class="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm font-mono"/>
              </div>
            </div>

            <div class="mt-8 p-4 bg-black/20 rounded-xl">
              <h4 class="text-sm font-bold mb-2 text-white/70">VSCode Settings</h4>
              <pre class="text-xs font-mono text-tama-mint overflow-x-auto"><code>{{ settingsJson() }}</code></pre>
            </div>
          </div>

          <!-- Preview -->
          <div class="glass rounded-3xl p-8">
            <h3 class="text-xl font-bold mb-6 text-center">Live Preview</h3>
            <div class="grid grid-cols-3 gap-6">
              @for (sprite of previewSprites; track sprite.name) {
                <div class="text-center">
                  <div class="w-20 h-20 mx-auto mb-2"
                       [innerHTML]="getSanitizedSvg(sprite.svg)"
                       [style.--pet-primary]="currentColors().primary"
                       [style.--pet-secondary]="currentColors().secondary"
                       [style.--pet-accent]="currentColors().accent"
                       [style.--pet-blush]="currentColors().blush">
                  </div>
                  <span class="text-xs text-white/60">{{ sprite.name }}</span>
                </div>
              }
            </div>

            <div class="mt-8 text-center">
              <div class="w-32 h-32 mx-auto animate-bounce-slow"
                   [innerHTML]="getSanitizedSvg(adultSvg)"
                   [style.--pet-primary]="currentColors().primary"
                   [style.--pet-secondary]="currentColors().secondary"
                   [style.--pet-accent]="currentColors().accent"
                   [style.--pet-blush]="currentColors().blush">
              </div>
              <p class="mt-4 text-white/60">
                Using: <span class="font-bold" [style.color]="currentColors().primary">{{ selectedPreset()?.name || 'Custom' }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host ::ng-deep svg {
      width: 100%;
      height: 100%;
    }
    input[type="color"] {
      -webkit-appearance: none;
      padding: 0;
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 8px;
    }
  `]
})
export class ColorsComponent {
  constructor(private sanitizer: DomSanitizer) {}

  presets: ColorPreset[] = [
    { name: 'Default', primary: '#ff6b9d', secondary: '#c44cff', accent: '#ffe14c', blush: '#ffb3d9' },
    { name: 'Sakura', primary: '#ffb7c5', secondary: '#ff69b4', accent: '#ffd700', blush: '#ffe4e9' },
    { name: 'Ocean', primary: '#00bcd4', secondary: '#0077be', accent: '#7fdbff', blush: '#b3e5fc' },
    { name: 'Sunset', primary: '#ff6b35', secondary: '#f72585', accent: '#ffd23f', blush: '#ffaa85' },
    { name: 'Forest', primary: '#4caf50', secondary: '#2e7d32', accent: '#8bc34a', blush: '#a5d6a7' },
    { name: 'Galaxy', primary: '#9c27b0', secondary: '#673ab7', accent: '#e040fb', blush: '#ce93d8' },
    { name: 'Candy', primary: '#f48fb1', secondary: '#81d4fa', accent: '#fff176', blush: '#f8bbd9' },
    { name: 'Mono', primary: '#9e9e9e', secondary: '#616161', accent: '#e0e0e0', blush: '#bdbdbd' },
  ];

  selectedPreset = signal<ColorPreset | null>(this.presets[0]);

  customColors = {
    primary: '#ff6b9d',
    secondary: '#c44cff',
    accent: '#ffe14c',
    blush: '#ffb3d9'
  };

  currentColors = computed(() => {
    const preset = this.selectedPreset();
    if (preset) {
      return preset;
    }
    return this.customColors;
  });

  settingsJson = computed(() => {
    const colors = this.currentColors();
    return `{
  "tamagotchi.petColors.primary": "${colors.primary}",
  "tamagotchi.petColors.secondary": "${colors.secondary}",
  "tamagotchi.petColors.accent": "${colors.accent}",
  "tamagotchi.petColors.blush": "${colors.blush}"
}`;
  });

  previewSprites = [
    { name: 'Egg', svg: this.eggSvg },
    { name: 'Baby', svg: this.babySvg },
    { name: 'Child', svg: this.childSvg },
    { name: 'Teen', svg: this.teenSvg },
    { name: 'Sleeping', svg: this.sleepingSvg },
    { name: 'Dirty', svg: this.dirtySvg },
  ];

  selectPreset(preset: ColorPreset) {
    this.selectedPreset.set(preset);
    this.customColors = { ...preset };
  }

  updateCustom() {
    this.selectedPreset.set(null);
  }

  getSanitizedSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  // SVG getters (simplified versions)
  get eggSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="eg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary)"/><stop offset="100%" stop-color="var(--pet-secondary)"/></linearGradient></defs><ellipse cx="16" cy="18" rx="10" ry="12" fill="url(#eg)"/><ellipse cx="12" cy="12" rx="3" ry="4" fill="rgba(255,255,255,0.4)"/><path d="M10 14 L12 11 L14 15 L16 10 L18 14" stroke="var(--pet-accent)" stroke-width="1.5" fill="none"/></svg>`;
  }

  get babySvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary)"/><stop offset="100%" stop-color="var(--pet-secondary)"/></linearGradient></defs><ellipse cx="16" cy="18" rx="11" ry="10" fill="url(#bg)"/><ellipse cx="11" cy="16" rx="2.5" ry="3" fill="white"/><circle cx="11" cy="16" r="1.5" fill="#1a1a2e"/><ellipse cx="21" cy="16" rx="2.5" ry="3" fill="white"/><circle cx="21" cy="16" r="1.5" fill="#1a1a2e"/><ellipse cx="7" cy="20" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.7"/><ellipse cx="25" cy="20" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.7"/><path d="M13 22 Q16 25 19 22" stroke="#1a1a2e" stroke-width="1.5" fill="none"/><circle cx="12" cy="6" r="1.5" fill="var(--pet-accent)"/></svg>`;
  }

  get childSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary)"/><stop offset="100%" stop-color="var(--pet-secondary)"/></linearGradient></defs><ellipse cx="7" cy="8" rx="4" ry="5" fill="url(#cg)"/><ellipse cx="7" cy="8" rx="2" ry="3" fill="var(--pet-blush)"/><ellipse cx="25" cy="8" rx="4" ry="5" fill="url(#cg)"/><circle cx="16" cy="14" r="10" fill="url(#cg)"/><ellipse cx="11" cy="13" rx="2.5" ry="3" fill="white"/><circle cx="11" cy="13" r="1.8" fill="#1a1a2e"/><ellipse cx="21" cy="13" rx="2.5" ry="3" fill="white"/><circle cx="21" cy="13" r="1.8" fill="#1a1a2e"/><ellipse cx="16" cy="16" rx="1.5" ry="1" fill="var(--pet-blush)"/><path d="M13 19 Q16 22 19 19" stroke="#1a1a2e" stroke-width="1.5" fill="none"/></svg>`;
  }

  get teenSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary)"/><stop offset="100%" stop-color="var(--pet-secondary)"/></linearGradient></defs><path d="M5 12 L8 3 L11 10" fill="url(#tg)"/><path d="M21 10 L24 3 L27 12" fill="url(#tg)"/><circle cx="16" cy="14" r="10" fill="url(#tg)"/><path d="M11 7 L13 10 M15 6 L16 10 M19 7 L21 10" stroke="var(--pet-accent)" stroke-width="1.5"/><ellipse cx="11" cy="13" rx="3" ry="3.5" fill="white"/><circle cx="11" cy="13" r="2" fill="#1a1a2e"/><ellipse cx="21" cy="13" rx="3" ry="3.5" fill="white"/><circle cx="21" cy="13" r="2" fill="#1a1a2e"/><ellipse cx="6" cy="16" rx="2" ry="1.5" fill="var(--pet-blush)" opacity="0.7"/><path d="M12 20 Q16 23 20 20" stroke="#1a1a2e" stroke-width="1.5" fill="none"/></svg>`;
  }

  get adultSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary)"/><stop offset="100%" stop-color="var(--pet-secondary)"/></linearGradient><radialGradient id="mg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="var(--pet-accent)"/><stop offset="100%" stop-color="var(--pet-primary)"/></radialGradient></defs><path d="M4 16 L6 8 L10 14 L12 6 L16 12 L20 6 L22 14 L26 8 L28 16" fill="url(#mg)"/><circle cx="16" cy="16" r="10" fill="url(#ag)"/><path d="M14 7 L16 4 L18 7 L16 9 Z" fill="var(--pet-accent)"/><ellipse cx="11" cy="14" rx="3" ry="3.5" fill="white"/><circle cx="11" cy="14" r="2.2" fill="#1a1a2e"/><ellipse cx="21" cy="14" rx="3" ry="3.5" fill="white"/><circle cx="21" cy="14" r="2.2" fill="#1a1a2e"/><ellipse cx="16" cy="17" rx="2" ry="1.5" fill="var(--pet-blush)"/><path d="M12 21 Q16 24 20 21" stroke="#1a1a2e" stroke-width="2" fill="none"/><ellipse cx="16" cy="26" rx="3" ry="2" fill="var(--pet-accent)"/></svg>`;
  }

  get sleepingSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary)"/><stop offset="100%" stop-color="var(--pet-secondary)"/></linearGradient></defs><ellipse cx="16" cy="20" rx="12" ry="8" fill="url(#sg)"/><circle cx="12" cy="14" r="8" fill="url(#sg)"/><path d="M7 13 Q9 11 11 13 M13 13 Q15 11 17 13" stroke="#1a1a2e" stroke-width="1.5" fill="none"/><ellipse cx="5" cy="15" rx="1.5" ry="1" fill="var(--pet-blush)" opacity="0.7"/><text x="22" y="8" font-size="5" fill="var(--pet-accent)">Z</text><text x="25" y="5" font-size="4" fill="var(--pet-accent)" opacity="0.7">Z</text></svg>`;
  }

  get dirtySvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary)"/><stop offset="100%" stop-color="var(--pet-secondary)"/></linearGradient></defs><ellipse cx="16" cy="18" rx="9" ry="8" fill="url(#dg)" opacity="0.85"/><circle cx="16" cy="12" r="8" fill="url(#dg)" opacity="0.85"/><ellipse cx="12" cy="11" rx="2.5" ry="2.5" fill="white"/><circle cx="12" cy="11" r="1.5" fill="#1a1a2e"/><ellipse cx="20" cy="11" rx="2.5" ry="2.5" fill="white"/><circle cx="20" cy="11" r="1.5" fill="#1a1a2e"/><path d="M13 16 Q16 14 19 16" stroke="#1a1a2e" stroke-width="1.2" fill="none"/><path d="M4 14 Q5 12 4 10" stroke="#98D982" stroke-width="1" fill="none" opacity="0.7"/><ellipse cx="5" cy="24" rx="2.5" ry="1.5" fill="#6B4423"/><ellipse cx="27" cy="25" rx="2" ry="1.2" fill="#6B4423"/></svg>`;
  }
}

