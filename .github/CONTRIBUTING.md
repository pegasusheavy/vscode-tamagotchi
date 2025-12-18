# Contributing to VSCode Tamagotchi 🥚

First off, thank you for considering contributing to VSCode Tamagotchi! It's people like you that make this project such a fun and delightful extension.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/) (v9 or higher)
- [VSCode](https://code.visualstudio.com/) or [Cursor](https://cursor.sh/)
- [Git](https://git-scm.com/)

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/vscode-tamagotchi.git
   cd vscode-tamagotchi
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/pegasusheavy/vscode-tamagotchi.git
   ```

4. **Install dependencies**:

   ```bash
   pnpm install
   ```

   This will also set up Husky git hooks automatically.

5. **Compile the extension**:

   ```bash
   pnpm run compile
   ```

6. **Open in VSCode**:

   ```bash
   code .
   ```

7. **Launch Extension Development Host**:
   - Press `F5` or go to Run > Start Debugging
   - A new VSCode window will open with your extension loaded

## Project Structure

```
vscode-tamagotchi/
├── .github/              # GitHub workflows and templates
├── .husky/               # Git hooks (pre-commit, pre-push, commit-msg)
├── docs/                 # GitHub Pages documentation site (Angular)
├── media/
│   ├── icon.svg          # Extension icon
│   └── sprites/          # SVG pet sprites (egg, baby, child, etc.)
├── out/                  # Compiled JavaScript (generated)
├── src/
│   ├── extension.ts      # Extension entry point
│   ├── tamagotchi.ts     # Core game logic
│   ├── tamagotchiPanel.ts    # Webview panel implementation
│   ├── sidebarProvider.ts    # Sidebar webview provider
│   └── webviewContent.ts     # HTML/CSS/JS for the UI
├── eslint.config.mjs     # ESLint 9 flat config
├── commitlint.config.mjs # Commit message linting rules
├── vitest.config.mts     # Test configuration
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
├── CHANGELOG.md          # Version history
└── README.md             # Project documentation
```

## Making Changes

### Branch Naming

Create a branch with a descriptive name:

- `feature/add-new-pet-type` - For new features
- `fix/hunger-not-updating` - For bug fixes
- `docs/update-readme` - For documentation
- `refactor/clean-up-stats` - For code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(pet): add sleeping animation
fix(stats): correct hunger decay rate
docs(readme): update installation instructions
```

### Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to enforce quality standards:

| Hook           | What it does                                          |
| -------------- | ----------------------------------------------------- |
| **pre-commit** | Runs lint-staged (ESLint + Prettier on staged files)  |
| **pre-push**   | Compiles TypeScript, runs linter, and runs tests      |
| **commit-msg** | Validates commit messages follow Conventional Commits |

If a hook fails, fix the issues before committing/pushing. To bypass hooks in emergencies (not recommended):

```bash
git commit --no-verify -m "message"
git push --no-verify
```

## Coding Guidelines

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use explicit type annotations for function parameters and return types
- Use interfaces for object shapes
- Avoid `any` type - use `unknown` if type is truly unknown

### Code Style

- Use 2-space indentation
- Use single quotes for strings
- Add trailing commas in multi-line arrays/objects
- Maximum line length: 100 characters

### Naming Conventions

- **Files**: `camelCase.ts` or `PascalCase.ts` for classes
- **Classes/Interfaces/Types**: `PascalCase`
- **Functions/Variables**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **CSS Classes**: `kebab-case`

### Documentation

- Add JSDoc comments for public functions and classes
- Include parameter descriptions and return types
- Add inline comments for complex logic

```typescript
/**
 * Feeds the Tamagotchi pet.
 * @param amount - The amount of food to give (1-100)
 * @returns Result object with success status and message
 */
feed(amount: number): FeedResult {
  // Implementation
}
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage
```

### Writing Tests

- Place test files next to the source files with `.test.ts` extension
- Use descriptive test names
- Test both success and failure cases
- Mock VSCode API when necessary

```typescript
import { describe, it, expect } from "vitest";
import { Tamagotchi } from "./tamagotchi";

describe("Tamagotchi", () => {
  it("should increase hunger when fed", () => {
    // Test implementation
  });
});
```

## Submitting Changes

1. **Update your fork**:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**:

   ```bash
   git push origin your-branch-name
   ```

3. **Create a Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template completely
   - Link any related issues

4. **Address Review Comments**:
   - Make requested changes
   - Push additional commits
   - Re-request review when ready

### PR Requirements

- [ ] All CI checks pass
- [ ] Code follows project style guidelines
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] No merge conflicts with main

## Issue Guidelines

### Reporting Bugs

- Use the bug report template
- Include steps to reproduce
- Provide system information
- Attach screenshots if helpful

### Requesting Features

- Use the feature request template
- Explain the problem you're trying to solve
- Describe your proposed solution
- Consider alternatives

### Questions

- Use the question template
- Check existing issues and documentation first
- Be specific about what you need help with

## Recognition

Contributors will be recognized in the following ways:

- Listed in release notes for their contributions
- Added to the Contributors section in README

---

## Need Help?

- 💬 Open a [Discussion](https://github.com/pegasusheavy/vscode-tamagotchi/discussions)
- 📖 Check the [Documentation](https://pegasusheavy.github.io/vscode-tamagotchi/)
- 🐛 File an [Issue](https://github.com/pegasusheavy/vscode-tamagotchi/issues)

Thank you for helping make VSCode Tamagotchi better! 🦁
