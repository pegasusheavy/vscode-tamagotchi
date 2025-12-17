# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of VSCode Tamagotchi seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do

- **Report vulnerabilities privately** - Do not create public GitHub issues for security vulnerabilities
- **Provide details** - Include as much information as possible to help us understand the nature and scope of the issue
- **Allow time** - Give us reasonable time to investigate and address the vulnerability before any public disclosure

### How to Report

1. **Email**: Contact the maintainers through GitHub's private vulnerability reporting feature
2. **GitHub Security Advisories**: Use [GitHub's Security Advisory feature](https://github.com/pegasusheavy/vscode-tamagotchi/security/advisories/new)

### What to Include

When reporting a vulnerability, please include:

- Type of vulnerability (e.g., XSS, code injection, data exposure)
- Full paths of source file(s) related to the vulnerability
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment - what an attacker could achieve

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We will keep you informed of our progress
- **Resolution**: We aim to resolve critical vulnerabilities within 7 days
- **Credit**: We will credit you in the release notes (unless you prefer to remain anonymous)

## Security Considerations for This Extension

### Webview Security

VSCode Tamagotchi uses webviews to display the pet interface. We implement the following security measures:

- **Content Security Policy (CSP)**: Strict CSP headers to prevent XSS attacks
- **Nonce-based script execution**: Scripts only execute with valid nonces
- **No remote content**: All content is local to the extension
- **Limited local resource access**: Only necessary files are accessible

### Data Storage

- **Local storage only**: Pet state is stored in VSCode's global state
- **No external communication**: The extension does not make network requests
- **No sensitive data**: Only game state (stats, name, etc.) is stored

### Permissions

This extension requests minimal permissions:
- File system access limited to extension directory
- No network access
- No access to user files or workspace content

## Best Practices for Contributors

When contributing to this project, please:

1. **Never commit secrets** - API keys, tokens, or credentials
2. **Validate all inputs** - Especially in webview message handlers
3. **Use parameterized queries** - If adding any data persistence
4. **Keep dependencies updated** - Run `pnpm audit` regularly
5. **Follow secure coding practices** - Escape HTML, validate data types

## Dependencies

We regularly audit our dependencies for known vulnerabilities:

```bash
pnpm audit
```

If you notice a vulnerable dependency, please report it using the process above or submit a PR to update it.

---

Thank you for helping keep VSCode Tamagotchi and its users safe! 🥚🔒

