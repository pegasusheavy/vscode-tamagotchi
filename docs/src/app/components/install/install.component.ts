import { Component } from '@angular/core';

@Component({
  selector: 'app-install',
  standalone: true,
  templateUrl: './install.component.html',
  styleUrl: './install.component.css'
})
export class InstallComponent {
  steps = [
    {
      number: 1,
      title: 'Clone the Repository',
      gradient: 'linear-gradient(135deg, var(--tama-pink), var(--tama-purple))',
      code: ['<span class="text-[var(--tama-mint)]">git clone</span> <span class="text-white/80">https://github.com/pegasusheavy/vscode-tamagotchi.git</span>']
    },
    {
      number: 2,
      title: 'Install & Build',
      gradient: 'linear-gradient(135deg, var(--tama-purple), var(--tama-blue))',
      code: [
        '<span class="text-[var(--tama-mint)]">cd</span> vscode-tamagotchi',
        '<span class="text-[var(--tama-mint)]">pnpm</span> install',
        '<span class="text-[var(--tama-mint)]">pnpm</span> run compile'
      ]
    },
    {
      number: 3,
      title: 'Package the Extension',
      gradient: 'linear-gradient(135deg, var(--tama-blue), var(--tama-mint))',
      code: ['<span class="text-[var(--tama-mint)]">pnpm</span> run package']
    },
    {
      number: 4,
      title: 'Install in VSCode/Cursor',
      gradient: 'linear-gradient(135deg, var(--tama-mint), var(--tama-yellow))',
      description: 'Open VSCode, go to Extensions → ⋯ → Install from VSIX and select the generated .vsix file. Or use the command line:',
      code: ['<span class="text-[var(--tama-mint)]">code</span> --install-extension vscode-tamagotchi-0.1.0.vsix']
    },
    {
      number: 5,
      title: 'Meet Your Pet!',
      gradient: 'linear-gradient(135deg, var(--tama-yellow), var(--tama-coral))',
      description: 'Open the Command Palette (Ctrl+Shift+P) and run "Tamagotchi: Show Tamagotchi" 🎉'
    }
  ];
}
