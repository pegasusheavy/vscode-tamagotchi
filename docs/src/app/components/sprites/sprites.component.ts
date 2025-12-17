import { Component, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-sprites',
  standalone: true,
  template: `
    <section id="sprites" class="py-32 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold mb-4">Custom <span class="gradient-text">SVG Sprites</span></h2>
          <p class="text-xl text-white/60 max-w-2xl mx-auto">
            Hand-crafted pixel-art style sprites for every evolution stage and special state
          </p>
        </div>

        <!-- Evolution Stages -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-center mb-8">Evolution Stages</h3>
          <div class="flex flex-wrap justify-center items-end gap-8">
            @for (stage of evolutionStages; track stage.name) {
              <div class="text-center group cursor-pointer" (click)="selectSprite(stage)">
                <div class="w-24 h-24 mb-3 mx-auto transition-transform group-hover:scale-110"
                     [innerHTML]="getSanitizedSvg(stage.svg)"
                     [style.--pet-primary]="currentColors().primary"
                     [style.--pet-secondary]="currentColors().secondary"
                     [style.--pet-accent]="currentColors().accent"
                     [style.--pet-blush]="currentColors().blush">
                </div>
                <div class="text-sm font-bold">{{ stage.name }}</div>
                <div class="text-xs text-white/40">{{ stage.ticks }}</div>
              </div>
              @if (!$last && stage.name !== 'Adult') {
                <div class="text-2xl text-white/30 mb-8">→</div>
              }
            }
          </div>
        </div>

        <!-- Special States -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-center mb-8">Special States</h3>
          <div class="flex flex-wrap justify-center gap-8">
            @for (state of specialStates; track state.name) {
              <div class="text-center group cursor-pointer" (click)="selectSprite(state)">
                <div class="w-24 h-24 mb-3 mx-auto transition-transform group-hover:scale-110"
                     [innerHTML]="getSanitizedSvg(state.svg)"
                     [style.--pet-primary]="currentColors().primary"
                     [style.--pet-secondary]="currentColors().secondary"
                     [style.--pet-accent]="currentColors().accent"
                     [style.--pet-blush]="currentColors().blush">
                </div>
                <div class="text-sm font-bold">{{ state.name }}</div>
                <div class="text-xs text-white/40">{{ state.trigger }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Selected Sprite Preview -->
        <div class="glass rounded-3xl p-8 max-w-xl mx-auto">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold gradient-text">{{ selectedSprite().name }}</h3>
            <p class="text-white/60 text-sm">{{ selectedSprite().description }}</p>
          </div>
          <div class="w-48 h-48 mx-auto animate-bounce-slow"
               [innerHTML]="getSanitizedSvg(selectedSprite().svg)"
               [style.--pet-primary]="currentColors().primary"
               [style.--pet-secondary]="currentColors().secondary"
               [style.--pet-accent]="currentColors().accent"
               [style.--pet-blush]="currentColors().blush">
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
  `]
})
export class SpritesComponent {
  constructor(private sanitizer: DomSanitizer) {}

  currentColors = signal({
    primary: '#ff6b9d',
    secondary: '#c44cff',
    accent: '#ffe14c',
    blush: '#ffb3d9'
  });

  evolutionStages = [
    { name: 'Egg', ticks: '0-9 ticks', svg: this.eggSvg, description: 'A mysterious glowing egg waiting to hatch' },
    { name: 'Baby', ticks: '10-49 ticks', svg: this.babySvg, description: 'A cute blob with big eyes and an antenna' },
    { name: 'Child', ticks: '50-149 ticks', svg: this.childSvg, description: 'Growing up with ears and whiskers' },
    { name: 'Teen', ticks: '150-299 ticks', svg: this.teenSvg, description: 'Cool stripes and confident attitude' },
    { name: 'Adult', ticks: '300+ ticks', svg: this.adultSvg, description: 'Majestic creature with flowing mane' },
  ];

  specialStates = [
    { name: 'Sleeping', trigger: 'During rest', svg: this.sleepingSvg, description: 'Curled up peacefully with floating ZZZs' },
    { name: 'Sick', trigger: 'Low health', svg: this.sickSvg, description: 'Needs medicine and care' },
    { name: 'Dirty', trigger: 'Low cleanliness', svg: this.dirtySvg, description: 'Surrounded by poop piles and flies!' },
    { name: 'Ghost', trigger: 'When deceased', svg: this.deadSvg, description: 'Don\'t let this happen!' },
  ];

  selectedSprite = signal(this.evolutionStages[4]);

  selectSprite(sprite: any) {
    this.selectedSprite.set(sprite);
  }

  getSanitizedSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  // SVG Sprites
  get eggSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs><linearGradient id="eggG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary, #ff6b9d)"/><stop offset="100%" stop-color="var(--pet-secondary, #c44cff)"/></linearGradient></defs>
      <ellipse cx="16" cy="18" rx="10" ry="12" fill="url(#eggG)"/>
      <ellipse cx="12" cy="12" rx="3" ry="4" fill="rgba(255,255,255,0.4)"/>
      <path d="M10 14 L12 11 L14 15 L16 10 L18 14 L20 12 L22 15" stroke="var(--pet-accent, #ffe14c)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  get babySvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs><linearGradient id="babyG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary, #ff6b9d)"/><stop offset="100%" stop-color="var(--pet-secondary, #c44cff)"/></linearGradient></defs>
      <ellipse cx="16" cy="18" rx="11" ry="10" fill="url(#babyG)"/>
      <ellipse cx="11" cy="16" rx="2.5" ry="3" fill="white"/><circle cx="11" cy="16" r="1.5" fill="#1a1a2e"/>
      <ellipse cx="21" cy="16" rx="2.5" ry="3" fill="white"/><circle cx="21" cy="16" r="1.5" fill="#1a1a2e"/>
      <ellipse cx="7" cy="20" rx="2" ry="1.5" fill="var(--pet-blush, #ffb3d9)" opacity="0.7"/>
      <ellipse cx="25" cy="20" rx="2" ry="1.5" fill="var(--pet-blush, #ffb3d9)" opacity="0.7"/>
      <path d="M13 22 Q16 25 19 22" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M16 8 Q14 4 12 6" stroke="var(--pet-primary, #ff6b9d)" stroke-width="2" fill="none"/>
      <circle cx="12" cy="6" r="1.5" fill="var(--pet-accent, #ffe14c)"/>
    </svg>`;
  }

  get childSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs><linearGradient id="childG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary, #ff6b9d)"/><stop offset="100%" stop-color="var(--pet-secondary, #c44cff)"/></linearGradient></defs>
      <ellipse cx="7" cy="8" rx="4" ry="5" fill="url(#childG)"/><ellipse cx="7" cy="8" rx="2" ry="3" fill="var(--pet-blush, #ffb3d9)"/>
      <ellipse cx="25" cy="8" rx="4" ry="5" fill="url(#childG)"/><ellipse cx="25" cy="8" rx="2" ry="3" fill="var(--pet-blush, #ffb3d9)"/>
      <circle cx="16" cy="14" r="10" fill="url(#childG)"/>
      <ellipse cx="11" cy="13" rx="2.5" ry="3" fill="white"/><circle cx="11" cy="13" r="1.8" fill="#1a1a2e"/>
      <ellipse cx="21" cy="13" rx="2.5" ry="3" fill="white"/><circle cx="21" cy="13" r="1.8" fill="#1a1a2e"/>
      <ellipse cx="16" cy="16" rx="1.5" ry="1" fill="var(--pet-blush, #ffb3d9)"/>
      <path d="M13 19 Q16 22 19 19" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <line x1="3" y1="14" x2="7" y2="15" stroke="#1a1a2e" stroke-width="0.8"/>
      <line x1="25" y1="15" x2="29" y2="14" stroke="#1a1a2e" stroke-width="0.8"/>
    </svg>`;
  }

  get teenSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs><linearGradient id="teenG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary, #ff6b9d)"/><stop offset="100%" stop-color="var(--pet-secondary, #c44cff)"/></linearGradient></defs>
      <path d="M5 12 L8 3 L11 10" fill="url(#teenG)"/><path d="M6 10 L8 5 L10 9" fill="var(--pet-blush, #ffb3d9)"/>
      <path d="M21 10 L24 3 L27 12" fill="url(#teenG)"/><path d="M22 9 L24 5 L26 10" fill="var(--pet-blush, #ffb3d9)"/>
      <circle cx="16" cy="14" r="10" fill="url(#teenG)"/>
      <path d="M11 7 L13 10 M15 6 L16 10 M19 7 L21 10" stroke="var(--pet-accent, #ffe14c)" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="11" cy="13" rx="3" ry="3.5" fill="white"/><circle cx="11" cy="13" r="2" fill="#1a1a2e"/>
      <ellipse cx="21" cy="13" rx="3" ry="3.5" fill="white"/><circle cx="21" cy="13" r="2" fill="#1a1a2e"/>
      <path d="M15 16 L16 17.5 L17 16 Z" fill="#1a1a2e"/>
      <ellipse cx="6" cy="16" rx="2" ry="1.5" fill="var(--pet-blush, #ffb3d9)" opacity="0.7"/>
      <ellipse cx="26" cy="16" rx="2" ry="1.5" fill="var(--pet-blush, #ffb3d9)" opacity="0.7"/>
      <path d="M12 20 Q16 23 20 20" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  get adultSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="adultG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary, #ff6b9d)"/><stop offset="100%" stop-color="var(--pet-secondary, #c44cff)"/></linearGradient>
        <radialGradient id="maneG" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="var(--pet-accent, #ffe14c)"/><stop offset="100%" stop-color="var(--pet-primary, #ff6b9d)"/></radialGradient>
      </defs>
      <path d="M4 16 L6 8 L10 14 L12 6 L16 12 L20 6 L22 14 L26 8 L28 16" fill="url(#maneG)"/>
      <circle cx="16" cy="16" r="10" fill="url(#adultG)"/>
      <path d="M14 7 L16 4 L18 7 L16 9 Z" fill="var(--pet-accent, #ffe14c)"/>
      <ellipse cx="11" cy="14" rx="3" ry="3.5" fill="white"/><circle cx="11" cy="14" r="2.2" fill="#1a1a2e"/>
      <ellipse cx="21" cy="14" rx="3" ry="3.5" fill="white"/><circle cx="21" cy="14" r="2.2" fill="#1a1a2e"/>
      <ellipse cx="16" cy="17" rx="2" ry="1.5" fill="var(--pet-blush, #ffb3d9)"/>
      <path d="M12 21 Q16 24 20 21" stroke="#1a1a2e" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="16" cy="26" rx="3" ry="2" fill="var(--pet-accent, #ffe14c)"/>
    </svg>`;
  }

  get sleepingSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs><linearGradient id="sleepG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary, #ff6b9d)"/><stop offset="100%" stop-color="var(--pet-secondary, #c44cff)"/></linearGradient></defs>
      <ellipse cx="16" cy="20" rx="12" ry="8" fill="url(#sleepG)"/>
      <circle cx="12" cy="14" r="8" fill="url(#sleepG)"/>
      <path d="M7 13 Q9 11 11 13" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M13 13 Q15 11 17 13" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="5" cy="15" rx="1.5" ry="1" fill="var(--pet-blush, #ffb3d9)" opacity="0.7"/>
      <ellipse cx="19" cy="15" rx="1.5" ry="1" fill="var(--pet-blush, #ffb3d9)" opacity="0.7"/>
      <text x="22" y="8" font-family="Arial" font-size="5" font-weight="bold" fill="var(--pet-accent, #ffe14c)">Z</text>
      <text x="25" y="5" font-family="Arial" font-size="4" font-weight="bold" fill="var(--pet-accent, #ffe14c)" opacity="0.7">Z</text>
      <text x="27" y="3" font-family="Arial" font-size="3" font-weight="bold" fill="var(--pet-accent, #ffe14c)" opacity="0.5">z</text>
    </svg>`;
  }

  get sickSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs><linearGradient id="sickG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary, #ff6b9d)"/><stop offset="100%" stop-color="var(--pet-secondary, #c44cff)"/></linearGradient></defs>
      <ellipse cx="16" cy="22" rx="10" ry="7" fill="url(#sickG)" opacity="0.8"/>
      <circle cx="16" cy="13" r="9" fill="url(#sickG)" opacity="0.8"/>
      <path d="M24 8 Q26 10 25 12 Q24 14 23 12 Q22 10 24 8" fill="#4cc9ff"/>
      <rect x="3" y="14" width="8" height="2" rx="1" fill="white"/>
      <rect x="3" y="14" width="5" height="2" rx="1" fill="#ff4444"/>
      <circle cx="11" cy="12" r="3" fill="white"/>
      <path d="M9 10 L13 14 M9 14 L13 10" stroke="#1a1a2e" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="21" cy="12" r="3" fill="white"/>
      <path d="M19 10 L23 14 M19 14 L23 10" stroke="#1a1a2e" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M12 19 Q16 16 20 19" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  get dirtySvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="dirtyG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--pet-primary, #ff6b9d)"/><stop offset="100%" stop-color="var(--pet-secondary, #c44cff)"/></linearGradient>
        <linearGradient id="poopG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8B6914"/><stop offset="50%" stop-color="#6B4423"/><stop offset="100%" stop-color="#4A2C17"/></linearGradient>
      </defs>
      <ellipse cx="16" cy="18" rx="9" ry="8" fill="url(#dirtyG)" opacity="0.85"/>
      <circle cx="16" cy="12" r="8" fill="url(#dirtyG)" opacity="0.85"/>
      <ellipse cx="12" cy="11" rx="2.5" ry="2.5" fill="white"/><circle cx="12" cy="11" r="1.5" fill="#1a1a2e"/>
      <ellipse cx="20" cy="11" rx="2.5" ry="2.5" fill="white"/><circle cx="20" cy="11" r="1.5" fill="#1a1a2e"/>
      <path d="M24 7 Q25 9 24.5 10 Q24 11 23.5 10 Q23 9 24 7" fill="#87CEEB"/>
      <path d="M13 16 Q14.5 14.5 16 16 Q17.5 17.5 19 16" stroke="#1a1a2e" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M4 14 Q5 12 4 10" stroke="#98D982" stroke-width="1" fill="none" opacity="0.7"/>
      <path d="M26 12 Q27 10 26 8" stroke="#98D982" stroke-width="1" fill="none" opacity="0.7"/>
      <ellipse cx="5" cy="26" rx="3" ry="1.5" fill="#4A2C17"/>
      <ellipse cx="5" cy="24.5" rx="2.5" ry="1.5" fill="url(#poopG)"/>
      <ellipse cx="5" cy="23" rx="2" ry="1.3" fill="url(#poopG)"/>
      <circle cx="5" cy="21.5" r="0.8" fill="#6B4423"/>
      <ellipse cx="27" cy="27" rx="2.5" ry="1.2" fill="#4A2C17"/>
      <ellipse cx="27" cy="25.8" rx="2" ry="1.2" fill="url(#poopG)"/>
      <circle cx="27" cy="24.5" r="0.7" fill="#6B4423"/>
    </svg>`;
  }

  get deadSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs><linearGradient id="deadG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#888888"/><stop offset="100%" stop-color="#555555"/></linearGradient></defs>
      <path d="M8 28 L8 14 Q8 6 16 6 Q24 6 24 14 L24 28 Q22 26 20 28 Q18 30 16 28 Q14 26 12 28 Q10 30 8 28" fill="url(#deadG)" opacity="0.6"/>
      <ellipse cx="16" cy="4" rx="6" ry="2" fill="none" stroke="var(--pet-accent, #ffe14c)" stroke-width="1.5"/>
      <path d="M10 13 L14 17 M10 17 L14 13" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>
      <path d="M18 13 L22 17 M18 17 L22 13" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="16" cy="22" rx="3" ry="2" fill="#1a1a2e"/>
      <path d="M24 16 Q26 18 25 20 Q24 22 23 20 Q22 18 24 16" fill="#4cc9ff" opacity="0.8"/>
    </svg>`;
  }
}

