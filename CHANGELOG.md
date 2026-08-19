# Changelog

All notable changes to VSCode Tamagotchi will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-12-18

### Added

- 🥚 **Core Tamagotchi gameplay** - Raise your virtual pet from egg to adult
- 🎨 **Custom SVG sprites** - 9 unique hand-crafted sprites for each life stage
  - Egg, Baby, Child, Teen, Adult
  - Special states: Sleeping, Sick, Dirty, Dead
- 🌈 **Color customization** - Full control over pet colors with CSS variables
  - Primary, secondary, accent, and blush colors
  - 7 built-in color presets: Sakura, Ocean, Sunset, Forest, Galaxy, Candy, Monochrome
- 📍 **Flexible positioning** - Display your pet anywhere in VS Code
  - Left sidebar (default)
  - Right sidebar (auxiliary bar)
  - Bottom panel
  - Editor tab
- 🍖 **Pet care actions** - Feed, play, sleep, and clean commands
- ❤️ **Health system** - 5 stats that affect your pet's wellbeing
  - Hunger, Happiness, Energy, Cleanliness, Health
- 💾 **Persistent state** - Your pet remembers its stats between sessions
- 🔄 **Restart button** - Start fresh with a new egg when your pet passes away
- 📝 **Custom naming** - Give your Tamagotchi a unique name
- 🎭 **Theme support** - Classic, Neon, Pastel, and Dark themes

### Developer Experience

- GitHub Actions CI/CD pipeline
- GitHub Pages documentation site
- Husky git hooks with:
  - Pre-commit: lint-staged (ESLint + Prettier)
  - Pre-push: compile, lint, and test
  - Commit-msg: conventional commit validation
- ESLint 9 with flat config
- Vitest for testing
- Comprehensive GitHub templates (issues, PRs, security policy)

[Unreleased]: https://github.com/quinnjr/vscode-tamagotchi/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/quinnjr/vscode-tamagotchi/releases/tag/v0.1.0
