import { Component, signal, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

interface SpriteData {
  name: string;
  path: string;
  description: string;
  ticks?: string;
  trigger?: string;
  svg: string;
}

@Component({
  selector: 'app-sprites',
  standalone: true,
  templateUrl: './sprites.component.html',
  styleUrl: './sprites.component.css'
})
export class SpritesComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  currentColors = signal({
    primary: '#ff6b9d',
    secondary: '#c44cff',
    accent: '#ffe14c',
    blush: '#ffb3d9'
  });

  evolutionStages = signal<SpriteData[]>([]);
  specialStates = signal<SpriteData[]>([]);
  selectedSprite = signal<SpriteData | null>(null);

  private evolutionInfo = [
    { name: 'Egg', path: 'sprites/egg.svg', description: 'A mysterious glowing egg waiting to hatch', ticks: '0-9 ticks' },
    { name: 'Baby', path: 'sprites/baby.svg', description: 'A cute blob with big eyes and an antenna', ticks: '10-49 ticks' },
    { name: 'Child', path: 'sprites/child.svg', description: 'Growing up with ears and whiskers', ticks: '50-149 ticks' },
    { name: 'Teen', path: 'sprites/teen.svg', description: 'Cool stripes and confident attitude', ticks: '150-299 ticks' },
    { name: 'Adult', path: 'sprites/adult.svg', description: 'Majestic creature with flowing mane', ticks: '300+ ticks' },
  ];

  private specialInfo = [
    { name: 'Sleeping', path: 'sprites/sleeping.svg', description: 'Curled up peacefully with floating ZZZs', trigger: 'During rest' },
    { name: 'Sick', path: 'sprites/sick.svg', description: 'Needs medicine and care', trigger: 'Low health' },
    { name: 'Dirty', path: 'sprites/dirty.svg', description: 'Surrounded by poop piles and flies!', trigger: 'Low cleanliness' },
    { name: 'Ghost', path: 'sprites/dead.svg', description: "Don't let this happen!", trigger: 'When deceased' },
  ];

  ngOnInit() {
    this.loadSprites();
  }

  private async loadSprites() {
    // Load evolution stages
    const evolution: SpriteData[] = [];
    for (const info of this.evolutionInfo) {
      const svg = await this.loadSvg(info.path);
      evolution.push({ ...info, svg });
    }
    this.evolutionStages.set(evolution);
    this.selectedSprite.set(evolution[4]); // Default to Adult

    // Load special states
    const special: SpriteData[] = [];
    for (const info of this.specialInfo) {
      const svg = await this.loadSvg(info.path);
      special.push({ ...info, svg });
    }
    this.specialStates.set(special);
  }

  private loadSvg(path: string): Promise<string> {
    return new Promise((resolve) => {
      this.http.get(path, { responseType: 'text' }).subscribe({
        next: (svg) => resolve(svg),
        error: () => resolve('')
      });
    });
  }

  selectSprite(sprite: SpriteData) {
    this.selectedSprite.set(sprite);
  }

  getSanitizedSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
