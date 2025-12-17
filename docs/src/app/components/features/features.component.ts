import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  standalone: true,
  template: `
    <section id="features" class="py-32 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold mb-4">Why You'll <span class="gradient-text">Love</span> It</h2>
          <p class="text-xl text-white/60 max-w-2xl mx-auto">Everything you need to raise the perfect coding companion</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (feature of features; track feature.title) {
            <div class="glow-card rounded-2xl p-8">
              <div class="text-5xl mb-4 animate-float" [style.animation-delay]="feature.delay">
                {{ feature.icon }}
              </div>
              <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
              <p class="text-white/60">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class FeaturesComponent {
  features = [
    {
      icon: '🎨',
      title: 'Custom SVG Sprites',
      description: 'Beautiful hand-crafted pixel-art style sprites for every evolution stage and mood.',
      delay: '0s'
    },
    {
      icon: '🌈',
      title: 'Full Color Customization',
      description: 'Choose from 7 color presets or create your own unique pet with custom colors.',
      delay: '0.5s'
    },
    {
      icon: '🥚',
      title: '5 Evolution Stages',
      description: 'Watch your pet grow from an egg to a majestic adult through baby, child, and teen stages.',
      delay: '1s'
    },
    {
      icon: '📊',
      title: '5 Stats to Manage',
      description: 'Balance hunger, happiness, energy, cleanliness, and health to keep your pet thriving.',
      delay: '1.5s'
    },
    {
      icon: '🎨',
      title: '4 Beautiful Themes',
      description: 'Classic, Neon, Pastel, and Dark themes to match your VSCode setup perfectly.',
      delay: '2s'
    },
    {
      icon: '📍',
      title: 'Flexible Positioning',
      description: 'Show your pet in the left sidebar, right sidebar, bottom panel, or as an editor tab.',
      delay: '2.5s'
    },
    {
      icon: '💾',
      title: 'Persistent State',
      description: 'Your pet remembers everything, even when VSCode is closed. Time still passes!',
      delay: '0.3s'
    },
    {
      icon: '✏️',
      title: 'Custom Pet Names',
      description: 'Name your pet whatever you want and watch it respond to its new identity.',
      delay: '0.8s'
    },
    {
      icon: '⚡',
      title: 'Lightweight',
      description: 'Zero impact on your coding performance. Your pet runs efficiently in the background.',
      delay: '1.3s'
    },
  ];
}

