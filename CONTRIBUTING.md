# Contributing to popser

Thanks for wanting to help. Here's how to do it without anyone losing their mind.

## Setup

```bash
git clone https://github.com/vcode-sh/popser.git
cd popser
npm install
npm run dev
```

## Development

```bash
npm run dev            # Watch mode (rebuilds on change)
npm run test:watch     # Tests in watch mode
npm run type-check     # TypeScript check
npm run lint           # Lint check
npm run lint:fix       # Auto-fix lint issues
```

## Before Submitting

1. `npm run type-check` passes
2. `npm run test` passes
3. `npm run lint` passes
4. `npm run build` produces clean output
5. New code has tests (coverage thresholds are enforced)

## PR Guidelines

- One thing per PR. Bug fix? One PR. New feature? One PR. Refactor? One PR.
- Write a clear description of what changed and why.
- If it touches the public API, update the README.
- Tests are not optional for non-trivial changes.

## Code Style

Biome via ultracite handles formatting. Don't fight it. Run `npm run lint:fix` and move on.

## Reporting Issues

Open an issue. Include:
- What you expected
- What happened instead
- Minimal reproduction (CodeSandbox, repo link, or code snippet)
- Browser/Node version if relevant

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
