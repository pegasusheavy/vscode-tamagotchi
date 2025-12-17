# VSCode Tamagotchi 🥚

A virtual Tamagotchi pet that lives in your VSCode/Cursor editor! Take care of your digital companion while you code.

## Features

- 🥚 **Raise your pet from an egg** - Watch it evolve through 5 stages: Egg → Baby → Child → Teen → Adult
- 🍖 **Feed your Tamagotchi** - Keep hunger levels up to maintain health
- 🎾 **Play with your pet** - Keep happiness high but watch the energy!
- 💤 **Rest time** - Put your pet to sleep to restore energy
- 🛁 **Stay clean** - Regular cleaning keeps your pet healthy
- ❤️ **Health system** - Neglect your pet and its health will decline
- 🎨 **Multiple themes** - Classic, Neon, Pastel, and Dark themes
- 📍 **Configurable position** - Show in panel, sidebar, or as an editor tab
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

### Settings

Configure your Tamagotchi in VSCode settings:

| Setting | Description | Default |
|---------|-------------|---------|
| `tamagotchi.position` | Window position: `panel`, `sidebar`, or `editor` | `panel` |
| `tamagotchi.petName` | Your pet's name | `Tama` |
| `tamagotchi.autoStart` | Show Tamagotchi when VSCode starts | `true` |
| `tamagotchi.updateInterval` | How often stats decrease (ms) | `30000` |
| `tamagotchi.theme` | Visual theme: `classic`, `neon`, `pastel`, `dark` | `classic` |

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

## License

MIT License - Copyright (c) 2025 Pegasus Heavy Industries LLC

See [LICENSE](LICENSE) for details.

