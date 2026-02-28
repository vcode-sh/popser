# Contributing to popser

You want to help build a toast library. I respect that. Genuinely. Most people wouldn't voluntarily spend a Saturday debugging CSS transitions for notification popups, but here you are. Welcome.

## The short version

1. Fork it, clone it, branch it
2. Make it work, make it pass, make it clean
3. Open a PR. Explain what and why.
4. I'll review it. We'll ship it.

## Setup

```bash
git clone https://github.com/vcode-sh/popser.git
cd popser
npm install
npm run dev
```

That gives you a watch build. For the docs site:

```bash
npm run web:dev
```

## Development commands

```bash
npm run dev            # Watch mode (rebuilds on change)
npm run test:watch     # Tests in watch mode
npm run type-check     # TypeScript check
npm run lint           # Lint check (Biome via ultracite)
npm run lint:fix       # Auto-fix lint issues
npm run build          # Full build (ESM + CJS + types)
npm run test:coverage  # Coverage report (90% thresholds enforced)
```

## Before you submit

Run this. All of it. If any step fails, fix it before opening the PR.

```bash
npm run type-check && npm run test && npm run lint && npm run build
```

## What makes a good PR

- **One thing.** Bug fix? One PR. New feature? One PR. Refactor? One PR. "I cleaned up six files while fixing a typo" is not one thing.
- **Tests.** New code needs tests. Coverage thresholds are enforced in CI. If you skip them, the build will yell at you and I'll agree with the build.
- **Explanation.** Tell me what changed and why. "Fixed bug" is not a description. "Close button opacity was 0 on mobile because hover mode assumed pointer events exist on touchscreens" is.
- **Public API changes.** If you touched anything exported, update the relevant docs in `docs/`. The README too.

## What we actually need help with

Not a wishlist — these are real things that would make popser better:

- **Bug fixes.** Found one? Fix it. Or at least open an issue with a reproduction.
- **Accessibility.** Screen reader testing, keyboard navigation edge cases, ARIA improvements. This matters more than most features.
- **Performance.** Bundle size wins, render optimisation, CSS improvements. Every byte counts when you're shipping to millions of browsers.
- **Testing.** More edge cases, more coverage, more confidence. The test suite is solid but there's always more to break.
- **Documentation.** Typos, unclear explanations, missing examples. If you had to read something twice, it's a docs bug.
- **CSS.** Better defaults, more themes, token improvements. CSS is the hardest part of any component library and I'm not above admitting that.
- **Framework integrations.** Next.js edge cases, Remix, Astro, whatever you're using. If popser doesn't work there, tell me.

## Code style

Biome via ultracite handles formatting. Don't fight it.

```bash
npm run lint:fix
```

That's it. Double quotes, semicolons, trailing commas, 2-space indent. The linter is not optional and it doesn't care about your preferences. Neither do I. This is liberating.

## Reporting issues

Open an issue on [GitHub](https://github.com/vcode-sh/popser/issues). Include:

- What you expected to happen
- What actually happened
- A minimal reproduction (CodeSandbox, repo link, or code snippet)
- Browser and Node version if it's a rendering or build issue

"It doesn't work" is not a bug report. "Toast.promise() shows the loading spinner indefinitely when the promise resolves with undefined in Firefox 125 on macOS" is.

## Architecture quick reference

Before you dive in, know where things live:

```
src/
├── toast.ts           # Imperative API (toast.success, etc.)
├── manager.ts         # Singleton Base UI toast manager
├── toaster.tsx        # <Toaster> component
├── toast-root.tsx     # Individual toast renderer
├── toast-icon.tsx     # 5 SVGs + CSS spinner
├── toast-action.tsx   # Action + Cancel buttons
├── toast-close.tsx    # Close button (3 modes)
├── toast-mapper.ts    # Popser options → Base UI format
├── toast-tracker.ts   # Active toast tracking + dedup
├── anchor-resolver.ts # Element/MouseEvent/{x,y} → DOM anchor
├── use-toaster.ts     # React hook wrapper
├── types.ts           # All TypeScript interfaces
├── constants.ts       # Default values
└── styles/            # CSS tokens + styles (6 files + popser.css bundle)

docs/                  # Package documentation (markdown)
web/                   # Documentation site (Next.js + fumadocs)
```

## The foundation

popser is built on [Base UI](https://base-ui.com) Toast primitives. If you're not familiar with Base UI, spend 10 minutes reading their docs. It'll save you hours of confusion about why things are structured the way they are.

Base UI is where headless React components are heading. Built by the teams behind Radix, Floating UI, and MUI. Popser wraps their toast primitives in a developer-friendly API. If you understand that relationship, you understand the architecture.

## License

By contributing, you agree that your contributions will be licensed under the MIT License. No surprises.

---

Questions? Open an issue or check the [docs](https://popser.vcui.dev/docs). I read everything.
