import { Component, signal, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

interface SpriteData {
  name: string;
  path: string;
  svg: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="min-h-screen flex items-center justify-center pt-20 px-6">
      <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div class="text-center lg:text-left animate-slide-up">
          <div class="inline-block px-4 py-2 rounded-full glass text-sm mb-6 animate-pulse-glow">
            ✨ Now with Custom SVG Sprites & Color Customization
          </div>
          <h1 class="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Meet Your New <span class="gradient-text">Coding Companion</span>
          </h1>
          <p class="text-xl text-white/70 mb-8 max-w-lg mx-auto lg:mx-0">
            A delightful virtual pet that lives in your editor. Feed it, play with it, and watch it evolve as you code!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="#install" class="btn-glow bg-gradient-to-r from-[var(--tama-pink)] to-[var(--tama-purple)] px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg">
              🎮 Get Started Free
            </a>
            <a href="#demo" class="btn-glow glass px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
              👀 See Demo
            </a>
          </div>
        </div>

        <!-- Animated Pet Display with Real SVG -->
        <div class="pet-container flex justify-center">
          <div class="pet-screen glass rounded-3xl p-8 w-80 animate-pulse-glow">
            <div class="text-center mb-4">
              <div class="text-2xl font-bold gradient-text">{{ petName() }}</div>
              <div class="text-sm text-white/50 uppercase tracking-widest">{{ stage() }} Stage</div>
            </div>

            <div class="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-8 mb-6">
              @if (currentSprite()) {
                <div class="w-24 h-24 mx-auto cursor-pointer hover:scale-110 transition-transform sprite-container"
                     [class.animate-bounce-slow]="!isAnimating()"
                     [class.animate-wiggle]="isAnimating()"
                     [innerHTML]="getSanitizedSvg(currentSprite()!.svg)"
                     [style.--pet-primary]="colors().primary"
                     [style.--pet-secondary]="colors().secondary"
                     [style.--pet-accent]="colors().accent"
                     [style.--pet-blush]="colors().blush"
                     (click)="cyclePet()">
                </div>
              } @else {
                <div class="text-8xl text-center animate-bounce-slow cursor-pointer" (click)="cyclePet()">
                  {{ fallbackEmoji() }}
                </div>
              }
              <div class="text-center mt-4 text-white/60">{{ mood() }}</div>
            </div>

            <div class="space-y-3">
              @for (stat of stats(); track stat.name) {
                <div class="flex items-center gap-3">
                  <span class="w-8">{{ stat.icon }}</span>
                  <div class="stat-bar flex-1 h-3">
                    <div class="stat-fill transition-all duration-300" [style.width.%]="stat.value"
                         [style.background]="stat.gradient"></div>
                  </div>
                  <span class="text-sm text-white/60 w-10">{{ stat.value }}%</span>
                </div>
              }
            </div>

            <div class="grid grid-cols-4 gap-2 mt-6">
              <button (click)="feed()" class="btn-glow bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-all hover:scale-110">🍖</button>
              <button (click)="play()" class="btn-glow bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-all hover:scale-110">🎾</button>
              <button (click)="sleep()" class="btn-glow bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-all hover:scale-110">💤</button>
              <button (click)="clean()" class="btn-glow bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-all hover:scale-110">🛁</button>
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
export class HeroComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  petName = signal('Tama');
  stage = signal('Adult');
  mood = signal('Feeling happy!');
  isAnimating = signal(false);
  fallbackEmoji = signal('🦁');

  colors = signal({
    primary: '#ff6b9d',
    secondary: '#c44cff',
    accent: '#ffe14c',
    blush: '#ffb3d9'
  });

  private petIndex = 4;
  private sprites: SpriteData[] = [];
  currentSprite = signal<SpriteData | null>(null);

  private spriteInfo = [
    { name: 'Egg', path: 'sprites/egg.svg', stage: 'Egg' },
    { name: 'Baby', path: 'sprites/baby.svg', stage: 'Baby' },
    { name: 'Child', path: 'sprites/child.svg', stage: 'Child' },
    { name: 'Teen', path: 'sprites/teen.svg', stage: 'Teen' },
    { name: 'Adult', path: 'sprites/adult.svg', stage: 'Adult' },
  ];

  private fallbackEmojis = ['🥚', '🐣', '🐱', '🐯', '🦁'];

  stats = signal([
    { name: 'hunger', icon: '🍖', value: 85, gradient: 'linear-gradient(90deg, #ff6b6b, #ff6b9d)' },
    { name: 'happiness', icon: '😊', value: 92, gradient: 'linear-gradient(90deg, #ffe14c, #ff6b6b)' },
    { name: 'energy', icon: '⚡', value: 78, gradient: 'linear-gradient(90deg, #4cc9ff, #4cffc4)' },
    { name: 'health', icon: '❤️', value: 95, gradient: 'linear-gradient(90deg, #ff6b9d, #c44cff)' },
  ]);

  ngOnInit() {
    this.loadSprites();
  }

  private async loadSprites() {
    for (const info of this.spriteInfo) {
      const svg = await this.loadSvg(info.path);
      this.sprites.push({ name: info.name, path: info.path, svg });
    }
    // Set initial sprite to Adult
    this.currentSprite.set(this.sprites[4]);
  }

  private loadSvg(path: string): Promise<string> {
    return new Promise((resolve) => {
      this.http.get(path, { responseType: 'text' }).subscribe({
        next: (svg) => resolve(svg),
        error: () => resolve('')
      });
    });
  }

  getSanitizedSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  cyclePet() {
    this.petIndex = (this.petIndex + 1) % this.sprites.length;
    if (this.sprites[this.petIndex]) {
      this.currentSprite.set(this.sprites[this.petIndex]);
      this.stage.set(this.spriteInfo[this.petIndex].stage);
    }
    this.fallbackEmoji.set(this.fallbackEmojis[this.petIndex]);
    this.animate();
  }

  feed() {
    this.animate();
    this.mood.set('Yummy! 🍖');
    this.updateStat('hunger', 15);
    setTimeout(() => this.mood.set('Feeling happy!'), 1500);
  }

  play() {
    this.animate();
    this.mood.set('So fun! 🎾');
    this.updateStat('happiness', 20);
    this.updateStat('energy', -10);
    setTimeout(() => this.mood.set('Feeling happy!'), 1500);
  }

  sleep() {
    this.animate();
    this.mood.set('Zzz... 💤');
    this.updateStat('energy', 25);
    setTimeout(() => this.mood.set('Wide awake! ☀️'), 2000);
  }

  clean() {
    this.animate();
    this.mood.set('Sparkly clean! ✨');
    this.updateStat('health', 10);
    setTimeout(() => this.mood.set('Feeling happy!'), 1500);
  }

  private animate() {
    this.isAnimating.set(true);
    setTimeout(() => this.isAnimating.set(false), 500);
  }

  private updateStat(name: string, delta: number) {
    this.stats.update(stats =>
      stats.map(s =>
        s.name === name ? { ...s, value: Math.min(100, Math.max(0, s.value + delta)) } : s
      )
    );
  }
}
