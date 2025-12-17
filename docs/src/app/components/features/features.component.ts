import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  standalone: true,
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
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
