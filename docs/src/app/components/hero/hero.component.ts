import { Component, signal } from '@angular/core';

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

        <!-- Animated Pet Display -->
        <div class="pet-container flex justify-center">
          <div class="pet-screen glass rounded-3xl p-8 w-80 animate-pulse-glow">
            <div class="text-center mb-4">
              <div class="text-2xl font-bold gradient-text">{{ petName() }}</div>
              <div class="text-sm text-white/50 uppercase tracking-widest">{{ stage() }} Stage</div>
            </div>

            <div class="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-8 mb-6">
              <div class="text-8xl text-center animate-bounce-slow cursor-pointer hover:animate-wiggle transition-all"
                   (click)="cyclePet()">
                {{ currentEmoji() }}
              </div>
              <div class="text-center mt-4 text-white/60">{{ mood() }}</div>
            </div>

            <div class="space-y-3">
              @for (stat of stats(); track stat.name) {
                <div class="flex items-center gap-3">
                  <span class="w-8">{{ stat.icon }}</span>
                  <div class="stat-bar flex-1 h-3">
                    <div class="stat-fill" [style.width.%]="stat.value"
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
  styles: []
})
export class HeroComponent {
  petName = signal('Tama');
  stage = signal('Adult');
  mood = signal('Feeling happy!');
  currentEmoji = signal('🦁');

  private petIndex = 4;
  private pets = ['🥚', '🐣', '🐱', '🐯', '🦁'];
  private stages = ['Egg', 'Baby', 'Child', 'Teen', 'Adult'];

  stats = signal([
    { name: 'hunger', icon: '🍖', value: 85, gradient: 'linear-gradient(90deg, #ff6b6b, #ff6b9d)' },
    { name: 'happiness', icon: '😊', value: 92, gradient: 'linear-gradient(90deg, #ffe14c, #ff6b6b)' },
    { name: 'energy', icon: '⚡', value: 78, gradient: 'linear-gradient(90deg, #4cc9ff, #4cffc4)' },
    { name: 'health', icon: '❤️', value: 95, gradient: 'linear-gradient(90deg, #ff6b9d, #c44cff)' },
  ]);

  cyclePet() {
    this.petIndex = (this.petIndex + 1) % this.pets.length;
    this.currentEmoji.set(this.pets[this.petIndex]);
    this.stage.set(this.stages[this.petIndex]);
  }

  feed() {
    this.mood.set('Yummy! 🍖');
    this.updateStat('hunger', 15);
    setTimeout(() => this.mood.set('Feeling happy!'), 1500);
  }

  play() {
    this.mood.set('So fun! 🎾');
    this.updateStat('happiness', 20);
    this.updateStat('energy', -10);
    setTimeout(() => this.mood.set('Feeling happy!'), 1500);
  }

  sleep() {
    this.mood.set('Zzz... 💤');
    this.updateStat('energy', 25);
    setTimeout(() => this.mood.set('Wide awake! ☀️'), 2000);
  }

  clean() {
    this.mood.set('Sparkly clean! ✨');
    this.updateStat('health', 10);
    setTimeout(() => this.mood.set('Feeling happy!'), 1500);
  }

  private updateStat(name: string, delta: number) {
    this.stats.update(stats =>
      stats.map(s =>
        s.name === name ? { ...s, value: Math.min(100, Math.max(0, s.value + delta)) } : s
      )
    );
  }
}

