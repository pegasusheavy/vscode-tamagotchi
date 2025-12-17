import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <section id="demo" class="py-32 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold mb-4">See It In <span class="gradient-text">Action</span></h2>
          <p class="text-xl text-white/60">Try the interactive demo below!</p>
        </div>

        <div class="glass rounded-3xl p-8 max-w-2xl mx-auto">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="ml-4 text-sm text-white/40 font-mono">tamagotchi-demo.tsx</span>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <!-- Code Side -->
            <div class="bg-black/30 rounded-xl p-4 font-mono text-sm">
              <div class="text-purple-400">const</div>
              <div class="ml-4 text-blue-300">pet = <span class="text-yellow-300">useTamagotchi</span>();</div>
              <br>
              <div class="text-gray-500">// Your pet evolves as you code!</div>
              <div class="text-purple-400">useEffect</div>
              <div class="text-white">(() =&gt; {{ '{' }}</div>
              <div class="ml-4 text-blue-300">pet.<span class="text-yellow-300">{{ codeAction() }}</span>();</div>
              <div class="ml-4 text-gray-500">{{ codeComment() }}</div>
              <div class="text-white">{{ '}' }}, []);</div>
            </div>

            <!-- Pet Side -->
            <div class="flex flex-col items-center justify-center">
              <div class="text-xs uppercase tracking-widest text-white/40 mb-2">{{ stageName() }}</div>
              <div class="text-7xl mb-4 animate-bounce-slow transition-all duration-300"
                   [class.animate-wiggle]="isAnimating()">
                {{ currentPet() }}
              </div>
              <div class="text-white/60 mb-4">{{ mood() }}</div>

              <div class="w-full space-y-2 mb-4">
                <div class="flex items-center gap-2">
                  <span class="text-xs w-6">🍖</span>
                  <div class="stat-bar flex-1 h-2">
                    <div class="stat-fill bg-gradient-to-r from-[var(--tama-coral)] to-[var(--tama-pink)] transition-all duration-500"
                         [style.width.%]="hunger()"></div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs w-6">😊</span>
                  <div class="stat-bar flex-1 h-2">
                    <div class="stat-fill bg-gradient-to-r from-[var(--tama-yellow)] to-[var(--tama-coral)] transition-all duration-500"
                         [style.width.%]="happiness()"></div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs w-6">⚡</span>
                  <div class="stat-bar flex-1 h-2">
                    <div class="stat-fill bg-gradient-to-r from-[var(--tama-blue)] to-[var(--tama-mint)] transition-all duration-500"
                         [style.width.%]="energy()"></div>
                  </div>
                </div>
              </div>

              <div class="flex gap-2">
                <button (click)="feed()" class="btn-glow bg-gradient-to-r from-[var(--tama-coral)] to-[var(--tama-pink)] px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform">
                  Feed 🍖
                </button>
                <button (click)="play()" class="btn-glow bg-gradient-to-r from-[var(--tama-yellow)] to-[var(--tama-coral)] px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform">
                  Play 🎾
                </button>
                <button (click)="sleep()" class="btn-glow bg-gradient-to-r from-[var(--tama-blue)] to-[var(--tama-purple)] px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform">
                  Sleep 💤
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Evolution Timeline -->
        <div class="mt-24">
          <h3 class="text-2xl font-bold text-center mb-12">The <span class="gradient-text">Evolution</span> Journey</h3>
          <div class="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            @for (stage of stages; track stage.name; let i = $index) {
              <div class="text-center">
                <div class="text-6xl mb-2 animate-float" [style.animation-delay]="(i * 0.5) + 's'">
                  {{ stage.emoji }}
                </div>
                <div class="text-sm font-bold">{{ stage.name }}</div>
                <div class="text-xs text-white/40">{{ stage.ticks }}</div>
              </div>
              @if (i < stages.length - 1) {
                <div class="text-3xl text-white/30">→</div>
              }
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
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

