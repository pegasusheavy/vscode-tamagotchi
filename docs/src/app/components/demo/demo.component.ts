import { Component, signal, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

interface SpriteData {
  name: string;
  path: string;
  svg: string;
  ticks: string;
}

@Component({
  selector: 'app-demo',
  standalone: true,
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  hunger = signal(80);
  happiness = signal(80);
  energy = signal(80);
  stageIndex = signal(1);
  mood = signal('Happy and fed!');
  codeAction = signal('feed');
  codeComment = signal('// Yummy! 🍖');
  isAnimating = signal(false);

  stages = signal<SpriteData[]>([]);
  currentSprite = signal<SpriteData | null>(null);
  stageName = signal('Baby');

  colors = signal({
    primary: '#ff6b9d',
    secondary: '#c44cff',
    accent: '#ffe14c',
    blush: '#ffb3d9'
  });

  private spriteInfo = [
    { name: 'Egg', path: 'sprites/egg.svg', ticks: '0 ticks' },
    { name: 'Baby', path: 'sprites/baby.svg', ticks: '10 ticks' },
    { name: 'Child', path: 'sprites/child.svg', ticks: '50 ticks' },
    { name: 'Teen', path: 'sprites/teen.svg', ticks: '150 ticks' },
    { name: 'Adult', path: 'sprites/adult.svg', ticks: '300 ticks' },
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
    this.stages.set(sprites);
    // Start at Baby (index 1)
    this.currentSprite.set(sprites[1]);
    this.stageName.set(sprites[1].name);
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

  feed() {
    this.animate();
    this.hunger.update(v => Math.min(100, v + 20));
    this.happiness.update(v => Math.min(100, v + 5));
    this.mood.set('Yummy! 🍖');
    this.codeAction.set('feed');
    this.codeComment.set('// Yummy! 🍖');
    this.checkEvolution();
    this.resetMood();
  }

  play() {
    if (this.energy() < 20) {
      this.mood.set('Too tired to play!');
      this.resetMood();
      return;
    }
    this.animate();
    this.happiness.update(v => Math.min(100, v + 25));
    this.energy.update(v => Math.max(0, v - 15));
    this.mood.set('So fun! 🎾');
    this.codeAction.set('play');
    this.codeComment.set('// So fun! 🎾');
    this.checkEvolution();
    this.resetMood();
  }

  sleep() {
    this.animate();
    this.energy.update(v => Math.min(100, v + 30));
    this.mood.set('Zzz... 💤');
    this.codeAction.set('sleep');
    this.codeComment.set('// Zzz... 💤');
    setTimeout(() => {
      this.mood.set('Wide awake! ☀️');
    }, 1500);
    this.resetMood(3000);
  }

  private animate() {
    this.isAnimating.set(true);
    setTimeout(() => this.isAnimating.set(false), 500);
  }

  private checkEvolution() {
    const avg = (this.hunger() + this.happiness() + this.energy()) / 3;
    const stagesList = this.stages();
    if (avg > 85 && this.stageIndex() < stagesList.length - 1) {
      this.stageIndex.update(v => v + 1);
      const newStage = stagesList[this.stageIndex()];
      if (newStage) {
        this.currentSprite.set(newStage);
        this.stageName.set(newStage.name);
      }
      this.mood.set('✨ Evolved! ✨');
    }
  }

  private resetMood(delay = 2000) {
    setTimeout(() => {
      this.mood.set('Happy and fed!');
    }, delay);
  }
}
