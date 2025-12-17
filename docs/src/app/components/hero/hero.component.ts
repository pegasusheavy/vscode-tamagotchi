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
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
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
