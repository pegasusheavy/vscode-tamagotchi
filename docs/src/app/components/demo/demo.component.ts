import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
  hunger = signal(80);
  happiness = signal(80);
  energy = signal(80);
  stageIndex = signal(1);
  mood = signal('Happy and fed!');
  codeAction = signal('feed');
  codeComment = signal('// Yummy! 🍖');
  isAnimating = signal(false);

  stages = [
    { name: 'Egg', emoji: '🥚', ticks: '0 ticks' },
    { name: 'Baby', emoji: '🐣', ticks: '10 ticks' },
    { name: 'Child', emoji: '🐱', ticks: '50 ticks' },
    { name: 'Teen', emoji: '🐯', ticks: '150 ticks' },
    { name: 'Adult', emoji: '🦁', ticks: '300 ticks' },
  ];

  currentPet = signal('🐣');
  stageName = signal('Baby');

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
    if (avg > 85 && this.stageIndex() < this.stages.length - 1) {
      this.stageIndex.update(v => v + 1);
      this.currentPet.set(this.stages[this.stageIndex()].emoji);
      this.stageName.set(this.stages[this.stageIndex()].name);
      this.mood.set('✨ Evolved! ✨');
    }
  }

  private resetMood(delay = 2000) {
    setTimeout(() => {
      this.mood.set('Happy and fed!');
    }, delay);
  }
}
