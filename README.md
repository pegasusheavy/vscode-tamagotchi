# VSCode Tamagotchi 🥚

[![CI](https://github.com/pegasusheavy/vscode-tamagotchi/actions/workflows/ci.yml/badge.svg)](https://github.com/pegasusheavy/vscode-tamagotchi/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/pegasusheavy/vscode-tamagotchi/blob/main/.github/CONTRIBUTING.md)

A virtual Tamagotchi pet that lives in your VSCode/Cursor editor! Take care of your digital companion while you code.

**[📖 Documentation](https://pegasusheavy.github.io/vscode-tamagotchi/)** · **[🐛 Report Bug](https://github.com/pegasusheavy/vscode-tamagotchi/issues/new?template=bug_report.yml)** · **[✨ Request Feature](https://github.com/pegasusheavy/vscode-tamagotchi/issues/new?template=feature_request.yml)**

## Features

- 🥚 **Raise your pet from an egg** - Watch it evolve through 5 stages: Egg → Baby → Child → Teen → Adult
- 🎨 **Custom SVG sprites** - Beautiful, colorful pixel-art style characters
- 🌈 **Fully customizable colors** - Pick your own colors or use presets
- 🍖 **Feed your Tamagotchi** - Keep hunger levels up to maintain health
- 🎾 **Play with your pet** - Keep happiness high but watch the energy!
- 💤 **Rest time** - Put your pet to sleep to restore energy
- 🛁 **Stay clean** - Regular cleaning keeps your pet healthy
- ❤️ **Health system** - Neglect your pet and its health will decline
- 🎨 **Multiple themes** - Classic, Neon, Pastel, and Dark themes
- 📍 **Configurable position** - Show in left sidebar, right sidebar, panel, or as an editor tab
- 💾 **Persistent state** - Your pet remembers its stats even when VSCode is closed

## Installation

### From VSIX (Local)

1. Clone this repository
2. Run `pnpm install`
3. Run `pnpm run compile`
4. Run `pnpm run package` to create a `.vsix` file
5. In VSCode, go to Extensions → ⋯ → Install from VSIX

### From Marketplace (Coming Soon)

Search for "VSCode Tamagotchi" in the Extensions marketplace.

## Usage

### Commands

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for:

- `Tamagotchi: Show Tamagotchi` - Open the Tamagotchi window
- `Tamagotchi: Feed Tamagotchi` - Feed your pet
- `Tamagotchi: Play with Tamagotchi` - Play with your pet
- `Tamagotchi: Put Tamagotchi to Sleep` - Toggle sleep mode
- `Tamagotchi: Clean Tamagotchi` - Clean your pet
- `Tamagotchi: Reset Tamagotchi` - Start over with a new egg
- `Tamagotchi: Move to Left Sidebar` - Move your pet to the left sidebar
- `Tamagotchi: Move to Right Sidebar` - Move your pet to the right sidebar

### Settings

Configure your Tamagotchi in VSCode settings:

#### General Settings

| Setting                     | Description                                                            | Default        |
| --------------------------- | ---------------------------------------------------------------------- | -------------- |
| `tamagotchi.position`       | Window position: `sidebar-left`, `sidebar-right`, `panel`, or `editor` | `sidebar-left` |
| `tamagotchi.petName`        | Your pet's name                                                        | `Tama`         |
| `tamagotchi.autoStart`      | Show Tamagotchi when VSCode starts                                     | `true`         |
| `tamagotchi.updateInterval` | How often stats decrease (ms)                                          | `30000`        |
| `tamagotchi.theme`          | Visual theme: `classic`, `neon`, `pastel`, `dark`                      | `classic`      |

#### Sprite & Color Settings

| Setting                          | Description                                | Default   |
| -------------------------------- | ------------------------------------------ | --------- |
| `tamagotchi.useCustomSprites`    | Use custom SVG sprites (disable for emoji) | `true`    |
| `tamagotchi.colorPreset`         | Quick color preset for your pet            | `custom`  |
| `tamagotchi.petColors.primary`   | Primary body color                         | `#ff6b9d` |
| `tamagotchi.petColors.secondary` | Secondary/paw color                        | `#c44cff` |
| `tamagotchi.petColors.accent`    | Accent/highlight color                     | `#ffe14c` |
| `tamagotchi.petColors.blush`     | Cheek blush color                          | `#ffb3d9` |

#### Color Presets

Choose from these ready-made color schemes:

| Preset       | Description                       |
| ------------ | --------------------------------- |
| `custom`     | Use your custom color settings    |
| `sakura`     | Soft pink cherry blossom theme 🌸 |
| `ocean`      | Cool blue ocean depths 🌊         |
| `sunset`     | Warm orange and red sunset 🌅     |
| `forest`     | Fresh green forest vibes 🌲       |
| `galaxy`     | Deep purple space colors 🌌       |
| `candy`      | Sweet pastel candy colors 🍬      |
| `monochrome` | Elegant grayscale look ⬜         |

## Pet Stats

- **🍖 Hunger** - Decreases over time. Feed your pet to restore.
- **😊 Happiness** - Decreases slowly. Play to make your pet happy!
- **⚡ Energy** - Decreases from activities. Sleep to restore.
- **🧼 Cleanliness** - Decreases over time. Clean regularly!
- **❤️ Health** - Affected by all other stats. Keep everything balanced!

## Evolution Stages

Your pet evolves based on age (measured in "ticks"):

1. **🥚 Egg** (0-9 ticks) - Just hatched!
2. **🐣 Baby** (10-49 ticks) - Needs lots of care
3. **🐱 Child** (50-149 ticks) - Growing up!
4. **🐯 Teen** (150-299 ticks) - Almost there
5. **🦁 Adult** (300+ ticks) - Fully grown!

## Custom Sprites

VSCode Tamagotchi features hand-crafted SVG sprites for each evolution stage:

- **Egg** - A mysterious glowing egg with cracks
- **Baby** - A cute blob with an antenna
- **Child** - An adorable creature with ears and whiskers
- **Teen** - A cool striped pet with pointed ears
- **Adult** - A majestic creature with a flowing mane

Plus special states:

- **Sleeping** - Curled up with ZZZs
- **Sick** - With thermometer and sweat drops
- **Ghost** - When your pet passes away (don't let this happen!)

All sprites support custom colors via CSS variables, so you can create your own unique pet!

## Development

```bash
# Install dependencies
pnpm install

# Compile TypeScript
pnpm run compile

# Watch for changes
pnpm run watch

# Run tests
pnpm test

# Package extension
pnpm run package
```

## Tips

- Don't let any stat drop below 20% or your pet's health will suffer
- Balance playtime with rest - too much playing exhausts your pet
- Stats continue to decay (slowly) even when VSCode is closed
- If your pet dies, use the Reset command to hatch a new egg
- Try different color presets to find your favorite look!
- Mix themes and colors for unique combinations

## Contributing

Contributions are welcome! Please read our [Contributing Guide](.github/CONTRIBUTING.md) before submitting a Pull Request.

- 🍴 Fork the repository
- 🔧 Make your changes
- ✅ Ensure tests pass (`pnpm test`)
- 📝 Follow [Conventional Commits](https://www.conventionalcommits.org/)
- 🚀 Submit a Pull Request

## Support

- 💬 [GitHub Discussions](https://github.com/pegasusheavy/vscode-tamagotchi/discussions) - Ask questions, share ideas
- 🐛 [GitHub Issues](https://github.com/pegasusheavy/vscode-tamagotchi/issues) - Report bugs, request features
- 📖 [Documentation](https://pegasusheavy.github.io/vscode-tamagotchi/) - Browse the docs site

## Sponsor

If you enjoy this extension, consider supporting development:

[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://www.patreon.com/c/PegasusHeavyIndustries)

## License

MIT License - Copyright (c) 2025 Pegasus Heavy Industries LLC

See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/pegasusheavy">Pegasus Heavy Industries</a>
</p>
