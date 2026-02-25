# popser

Toast notifications for React. Built on Base UI Toast primitives. Sonner-compatible imperative API. Published as `popser` on npm.

## Architecture

Single entry point:

- **`src/index.ts`** -> `popser` -- Public barrel export (toast, Toaster, useToaster, types)

Core modules:

- **`src/toast.ts`** -- Imperative API: `toast()`, `.success()`, `.error()`, `.info()`, `.warning()`, `.loading()`, `.promise()`, `.close()`, `.update()`
- **`src/manager.ts`** -- Singleton wrapper over Base UI `Toast.createToastManager()`
- **`src/types.ts`** -- All TypeScript interfaces (PopserOptions, PopserType, PopserConfig, ToasterProps)
- **`src/constants.ts`** -- Default values (timeout, limit, position, swipeDirection)

Components:

- **`src/toaster.tsx`** -- `<Toaster>` wrapping Base UI Provider + Portal + Viewport
- **`src/toast-root.tsx`** -- Individual toast renderer (Root + Content + slots)
- **`src/toast-icon.tsx`** -- 5 inline SVGs + CSS spinner (~40 LOC, zero external deps)
- **`src/toast-action.tsx`** -- Action + Cancel button wrapper
- **`src/toast-close.tsx`** -- Close button with hover/always/never modes
- **`src/use-toaster.ts`** -- React hook wrapper for consuming manager

Styles:

- **`src/styles/popser.css`** -- Default styles (opt-in import via `popser/styles`)
- **`src/styles/tokens.css`** -- CSS custom properties (color tokens, sizes)

## Code Style

- **Biome** via ultracite
- **lint-staged** runs `ultracite fix` on pre-commit
- ES modules, `verbatimModuleSyntax`, strict null checks, `noUncheckedIndexedAccess`
- Double quotes, semicolons, trailing commas
- 2-space indent, LF line endings

## Testing

- **Vitest** with `happy-dom` environment
- Tests co-located in `src/` (`*.test.ts`, `*.test.tsx`)
- Coverage: v8 provider, thresholds -- 90% lines/statements/branches, 80% functions

## Commands

```bash
npm run build          # tsup (ESM + CJS + .d.ts)
npm run dev            # tsup --watch
npm run type-check     # tsc --noEmit
npm run test           # vitest run
npm run test:watch     # vitest (watch mode)
npm run test:coverage  # vitest run --coverage
npm run lint           # ultracite check
npm run lint:fix       # ultracite fix
```

## Dependencies

**Runtime (peer):** `react` (^18 || ^19), `react-dom` (^18 || ^19), `@base-ui/react` (^1.2.0)

**Build external:** `react`, `react-dom`, `@base-ui/react` (tsup external)

**Dev:** Biome, ultracite, tsup, TypeScript 5.9, Vitest 4, happy-dom

**Node:** >= 22.0.0

## Key Design Principles

- **Zero-config works:** Built-in SVG icons, default CSS tokens. No setup required.
- **Full override:** Icons, styles, classNames overridable at every level.
- **No `!important`:** Headless Base UI primitives. Your styles always win.
- **Sonner-compatible API:** Drop-in replacement. `toast.success()`, `toast.error()`, etc.
- **Accessible:** ARIA live regions, priority system, F6 keyboard navigation.

## Review Guidelines

- Toast manager is a singleton. Ensure no memory leaks on close/cleanup.
- Icons use `currentColor` for fill/stroke. Colors come from CSS variables.
- All Base UI Toast primitives must be used correctly (Provider > Portal > Viewport > Root > Content).
- CSS custom properties prefixed with `--popser-*` to avoid collisions.
- Coverage thresholds enforced in CI. New code needs tests.
