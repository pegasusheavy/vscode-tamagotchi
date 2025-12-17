import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  blush: string;
}

interface SpriteData {
  name: string;
  path: string;
  svg: string;
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
                  class="text-center group rounded-xl p-2 transition-all"
                  [class.ring-2]="selectedPreset()?.name === preset.name"
                  [class.ring-white]="selectedPreset()?.name === preset.name"
                  [class.bg-white/10]="selectedPreset()?.name === preset.name">
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
              @for (sprite of previewSprites(); track sprite.name) {
                <div class="text-center">
                  <div class="w-20 h-20 mx-auto mb-2 sprite-container"
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

            @if (adultSprite()) {
              <div class="mt-8 text-center">
                <div class="w-32 h-32 mx-auto animate-bounce-slow sprite-container"
                     [innerHTML]="getSanitizedSvg(adultSprite()!.svg)"
                     [style.--pet-primary]="currentColors().primary"
                     [style.--pet-secondary]="currentColors().secondary"
                     [style.--pet-accent]="currentColors().accent"
                     [style.--pet-blush]="currentColors().blush">
                </div>
                <p class="mt-4 text-white/60">
                  Using: <span class="font-bold" [style.color]="currentColors().primary">{{ selectedPreset()?.name || 'Custom' }}</span>
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host ::ng-deep .sprite-container svg {
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
export class ColorsComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

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

  previewSprites = signal<SpriteData[]>([]);
  adultSprite = signal<SpriteData | null>(null);

  private spriteInfo = [
    { name: 'Egg', path: 'sprites/egg.svg' },
    { name: 'Baby', path: 'sprites/baby.svg' },
    { name: 'Child', path: 'sprites/child.svg' },
    { name: 'Teen', path: 'sprites/teen.svg' },
    { name: 'Sleeping', path: 'sprites/sleeping.svg' },
    { name: 'Dirty', path: 'sprites/dirty.svg' },
  ];

  ngOnInit() {
    this.loadSprites();
  }

  private async loadSprites() {
    const sprites: SpriteData[] = [];
    for (const info of this.spriteInfo) {
      const svg = await this.loadSvg(info.path);
      sprites.push({ ...info, svg });
    }
    this.previewSprites.set(sprites);

    // Load adult sprite for main preview
    const adultSvg = await this.loadSvg('sprites/adult.svg');
    this.adultSprite.set({ name: 'Adult', path: 'sprites/adult.svg', svg: adultSvg });
  }

  private loadSvg(path: string): Promise<string> {
    return new Promise((resolve) => {
      this.http.get(path, { responseType: 'text' }).subscribe({
        next: (svg) => resolve(svg),
        error: () => resolve('')
      });
    });
  }

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
}
