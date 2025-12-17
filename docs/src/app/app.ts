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
  templateUrl: './app.html',
  styleUrl: './app.css'
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
