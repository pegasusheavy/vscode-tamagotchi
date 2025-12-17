import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  blush: string;
}

interface SpriteData {
  name: string;
  path: string;
  svg: string;
}

@Component({
  selector: 'app-colors',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.css'
})
export class ColorsComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  presets: ColorPreset[] = [
    { name: 'Default', primary: '#ff6b9d', secondary: '#c44cff', accent: '#ffe14c', blush: '#ffb3d9' },
    { name: 'Sakura', primary: '#ffb7c5', secondary: '#ff69b4', accent: '#ffd700', blush: '#ffe4e9' },
    { name: 'Ocean', primary: '#00bcd4', secondary: '#0077be', accent: '#7fdbff', blush: '#b3e5fc' },
    { name: 'Sunset', primary: '#ff6b35', secondary: '#f72585', accent: '#ffd23f', blush: '#ffaa85' },
    { name: 'Forest', primary: '#4caf50', secondary: '#2e7d32', accent: '#8bc34a', blush: '#a5d6a7' },
    { name: 'Galaxy', primary: '#9c27b0', secondary: '#673ab7', accent: '#e040fb', blush: '#ce93d8' },
    { name: 'Candy', primary: '#f48fb1', secondary: '#81d4fa', accent: '#fff176', blush: '#f8bbd9' },
    { name: 'Mono', primary: '#9e9e9e', secondary: '#616161', accent: '#e0e0e0', blush: '#bdbdbd' },
  ];

  selectedPreset = signal<ColorPreset | null>(this.presets[0]);

  customColors = {
    primary: '#ff6b9d',
    secondary: '#c44cff',
    accent: '#ffe14c',
    blush: '#ffb3d9'
  };

  currentColors = computed(() => {
    const preset = this.selectedPreset();
    if (preset) {
      return preset;
    }
    return this.customColors;
  });

  settingsJson = computed(() => {
    const colors = this.currentColors();
    return `{
  "tamagotchi.petColors.primary": "${colors.primary}",
  "tamagotchi.petColors.secondary": "${colors.secondary}",
  "tamagotchi.petColors.accent": "${colors.accent}",
  "tamagotchi.petColors.blush": "${colors.blush}"
}`;
  });

  previewSprites = signal<SpriteData[]>([]);
  adultSprite = signal<SpriteData | null>(null);

  private spriteInfo = [
    { name: 'Egg', path: 'sprites/egg.svg' },
    { name: 'Baby', path: 'sprites/baby.svg' },
    { name: 'Child', path: 'sprites/child.svg' },
    { name: 'Teen', path: 'sprites/teen.svg' },
    { name: 'Sleeping', path: 'sprites/sleeping.svg' },
    { name: 'Dirty', path: 'sprites/dirty.svg' },
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
    this.previewSprites.set(sprites);

    // Load adult sprite for main preview
    const adultSvg = await this.loadSvg('sprites/adult.svg');
    this.adultSprite.set({ name: 'Adult', path: 'sprites/adult.svg', svg: adultSvg });
  }

  private loadSvg(path: string): Promise<string> {
    return new Promise((resolve) => {
      this.http.get(path, { responseType: 'text' }).subscribe({
        next: (svg) => resolve(svg),
        error: () => resolve('')
      });
    });
  }

  selectPreset(preset: ColorPreset) {
    this.selectedPreset.set(preset);
    this.customColors = { ...preset };
  }

  updateCustom() {
    this.selectedPreset.set(null);
  }

  getSanitizedSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
