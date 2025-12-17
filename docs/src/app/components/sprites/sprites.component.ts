import { Component, signal, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

interface SpriteData {
  name: string;
  path: string;
  description: string;
  ticks?: string;
  trigger?: string;
  svg: string;
}

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
            @for (stage of evolutionStages(); track stage.name; let i = $index) {
              <div class="text-center group cursor-pointer" (click)="selectSprite(stage)">
                <div class="w-24 h-24 mb-3 mx-auto transition-transform group-hover:scale-110 sprite-container"
                     [innerHTML]="getSanitizedSvg(stage.svg)"
                     [style.--pet-primary]="currentColors().primary"
                     [style.--pet-secondary]="currentColors().secondary"
                     [style.--pet-accent]="currentColors().accent"
                     [style.--pet-blush]="currentColors().blush">
                </div>
                <div class="text-sm font-bold">{{ stage.name }}</div>
                <div class="text-xs text-white/40">{{ stage.ticks }}</div>
              </div>
              @if (i < evolutionStages().length - 1) {
                <div class="text-2xl text-white/30 mb-8">→</div>
              }
            }
          </div>
        </div>

        <!-- Special States -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-center mb-8">Special States</h3>
          <div class="flex flex-wrap justify-center gap-8">
            @for (state of specialStates(); track state.name) {
              <div class="text-center group cursor-pointer" (click)="selectSprite(state)">
                <div class="w-24 h-24 mb-3 mx-auto transition-transform group-hover:scale-110 sprite-container"
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
        @if (selectedSprite()) {
          <div class="glass rounded-3xl p-8 max-w-xl mx-auto">
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold gradient-text">{{ selectedSprite()!.name }}</h3>
              <p class="text-white/60 text-sm">{{ selectedSprite()!.description }}</p>
            </div>
            <div class="w-48 h-48 mx-auto animate-bounce-slow sprite-container"
                 [innerHTML]="getSanitizedSvg(selectedSprite()!.svg)"
                 [style.--pet-primary]="currentColors().primary"
                 [style.--pet-secondary]="currentColors().secondary"
                 [style.--pet-accent]="currentColors().accent"
                 [style.--pet-blush]="currentColors().blush">
            </div>
          </div>
        }

        <!-- SVG Features Info -->
        <div class="mt-16 glass rounded-2xl p-8">
          <h3 class="text-xl font-bold mb-6 text-center gradient-text">SVG Sprite Features</h3>
          <div class="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div class="text-4xl mb-3">🎨</div>
              <h4 class="font-bold mb-2">CSS Variables</h4>
              <p class="text-white/60 text-sm">Colors defined with CSS custom properties for easy theming</p>
            </div>
            <div>
              <div class="text-4xl mb-3">📐</div>
              <h4 class="font-bold mb-2">Scalable</h4>
              <p class="text-white/60 text-sm">Vector graphics that look crisp at any size</p>
            </div>
            <div>
              <div class="text-4xl mb-3">✨</div>
              <h4 class="font-bold mb-2">Details</h4>
              <p class="text-white/60 text-sm">Highlights, gradients, and animations built-in</p>
            </div>
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
  `]
})
export class SpritesComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  currentColors = signal({
    primary: '#ff6b9d',
    secondary: '#c44cff',
    accent: '#ffe14c',
    blush: '#ffb3d9'
  });

  evolutionStages = signal<SpriteData[]>([]);
  specialStates = signal<SpriteData[]>([]);
  selectedSprite = signal<SpriteData | null>(null);

  private evolutionInfo = [
    { name: 'Egg', path: 'sprites/egg.svg', description: 'A mysterious glowing egg waiting to hatch', ticks: '0-9 ticks' },
    { name: 'Baby', path: 'sprites/baby.svg', description: 'A cute blob with big eyes and an antenna', ticks: '10-49 ticks' },
    { name: 'Child', path: 'sprites/child.svg', description: 'Growing up with ears and whiskers', ticks: '50-149 ticks' },
    { name: 'Teen', path: 'sprites/teen.svg', description: 'Cool stripes and confident attitude', ticks: '150-299 ticks' },
    { name: 'Adult', path: 'sprites/adult.svg', description: 'Majestic creature with flowing mane', ticks: '300+ ticks' },
  ];

  private specialInfo = [
    { name: 'Sleeping', path: 'sprites/sleeping.svg', description: 'Curled up peacefully with floating ZZZs', trigger: 'During rest' },
    { name: 'Sick', path: 'sprites/sick.svg', description: 'Needs medicine and care', trigger: 'Low health' },
    { name: 'Dirty', path: 'sprites/dirty.svg', description: 'Surrounded by poop piles and flies!', trigger: 'Low cleanliness' },
    { name: 'Ghost', path: 'sprites/dead.svg', description: "Don't let this happen!", trigger: 'When deceased' },
  ];

  ngOnInit() {
    this.loadSprites();
  }

  private async loadSprites() {
    // Load evolution stages
    const evolution: SpriteData[] = [];
    for (const info of this.evolutionInfo) {
      const svg = await this.loadSvg(info.path);
      evolution.push({ ...info, svg });
    }
    this.evolutionStages.set(evolution);
    this.selectedSprite.set(evolution[4]); // Default to Adult

    // Load special states
    const special: SpriteData[] = [];
    for (const info of this.specialInfo) {
      const svg = await this.loadSvg(info.path);
      special.push({ ...info, svg });
    }
    this.specialStates.set(special);
  }

  private loadSvg(path: string): Promise<string> {
    return new Promise((resolve) => {
      this.http.get(path, { responseType: 'text' }).subscribe({
        next: (svg) => resolve(svg),
        error: () => resolve('')
      });
    });
  }

  selectSprite(sprite: SpriteData) {
    this.selectedSprite.set(sprite);
  }

  getSanitizedSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
