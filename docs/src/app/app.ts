import { Component } from '@angular/core';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { SpritesComponent } from './components/sprites/sprites.component';
import { ColorsComponent } from './components/colors/colors.component';
import { DemoComponent } from './components/demo/demo.component';
import { InstallComponent } from './components/install/install.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    HeroComponent,
    FeaturesComponent,
    SpritesComponent,
    ColorsComponent,
    DemoComponent,
    InstallComponent,
    FooterComponent,
  ],
  template: `
    <!-- Background decorations -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <!-- Floating emojis -->
      <div class="floating-emoji" style="top: 10%; left: 5%; animation-delay: 0s;">🥚</div>
      <div class="floating-emoji" style="top: 20%; right: 10%; animation-delay: 1s;">🐣</div>
      <div class="floating-emoji" style="top: 60%; left: 8%; animation-delay: 2s;">🎮</div>
      <div class="floating-emoji" style="top: 70%; right: 5%; animation-delay: 3s;">💖</div>
      <div class="floating-emoji" style="top: 40%; left: 3%; animation-delay: 4s;">✨</div>
      <div class="floating-emoji" style="top: 85%; right: 15%; animation-delay: 5s;">🦁</div>
      <div class="floating-emoji" style="top: 15%; left: 85%; animation-delay: 1.5s;">🍖</div>
      <div class="floating-emoji" style="top: 50%; right: 3%; animation-delay: 2.5s;">💤</div>

      <!-- Stars -->
      @for (star of stars; track star.id) {
        <div class="star" [style.top]="star.top" [style.left]="star.left" [style.animation-delay]="star.delay"></div>
      }
    </div>

    <!-- Main content -->
    <div class="relative z-10">
      <app-nav />
      <app-hero />
      <app-features />
      <app-sprites />
      <app-colors />
      <app-demo />
      <app-install />
      <app-footer />
    </div>
  `,
  styles: []
})
export class App {
  stars = [
    { id: 1, top: '5%', left: '20%', delay: '0.2s' },
    { id: 2, top: '15%', left: '70%', delay: '0.8s' },
    { id: 3, top: '25%', left: '40%', delay: '1.4s' },
    { id: 4, top: '35%', left: '90%', delay: '0.6s' },
    { id: 5, top: '55%', left: '15%', delay: '1.2s' },
    { id: 6, top: '65%', left: '60%', delay: '0.4s' },
    { id: 7, top: '75%', left: '35%', delay: '1s' },
    { id: 8, top: '85%', left: '80%', delay: '0.3s' },
    { id: 9, top: '45%', left: '50%', delay: '1.6s' },
    { id: 10, top: '92%', left: '25%', delay: '0.9s' },
  ];
}
