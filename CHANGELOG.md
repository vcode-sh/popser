# Changelog

All notable changes to this project will be documented in this file.

The format tries to be useful. No "chore: bump deps" padding. If it didn't change what you ship, it's not here.

---

## [1.1.2] - 2026-02-28

The shadcn registry actually works now. Also fixed some docs that were lying about import names.

### Added
- shadcn registry served from docs site at `popser.vcui.dev/r/popser.json`. Direct URL install: `npx shadcn add https://popser.vcui.dev/r/popser.json`.
- Namespace install instructions: configure `@vcode-sh` registry in `components.json`, then `npx shadcn add @vcode-sh/popser`.
- `/llms.txt` route: concise index of all docs pages with titles, URLs, and descriptions.
- `/llms-full.txt` route: full documentation concatenated into one plain text file. JSX demo components stripped. Changelog excluded.

### Fixed
- shadcn docs referenced `<Popser>` but the registry component exports `<Toaster>`. Fixed across all docs.
- README CSS examples used HSL values. The actual token system is OKLCH. Examples now match reality.
- "7 files via @import" → 6. The actual `popser.css` has 6 `@import` directives.
- "5 inline SVGs + CSS spinner. 40 lines" → dropped the line count. `toast-icon.tsx` is 129 lines.
- "In early 2026, shipped @base-ui/react v1.0" → late 2025. Base UI v1.0.0 shipped Dec 11, 2025.
- "Sonner has 6 classNames slots" → Sonner has more properties (element + per-type). Removed specific count.
- "update() API: Sonner = None" → Sonner re-calls `toast()` with same ID (full replace). Not nothing.
- Sonner CSS described as "bundled inline as JS side-effect" → "auto-imported with JS". More accurate for v2.
- Migration example showed `dismiss → close` rename as required. `toast.dismiss()` is already an alias in popser.
- Colm Tuite "liability" quote removed — unverifiable. Replaced with factual statement about him joining Base UI.
- Sonner #376 described as "open 2+ years" → "open since March 2024".

### Changed
- Registry homepage updated from GitHub to `popser.vcui.dev`.

### No code changes

Zero changes to `src/`. Same build output as 1.1.0.

---

## [1.1.1] - 2026-02-28

The paperwork patch. No code changed. The docs got a promotion.

### Added
- Documentation site: [popser.vcui.dev](https://popser.vcui.dev) — full docs, interactive demos, changelog.
- [Why I built this](https://popser.vcui.dev/why) — the honest version of the README's "Why" section.
- [Why Base UI, not Radix](https://popser.vcui.dev/why-base-ui) — the technical argument for headless primitives in 2026.
- [Collaborate](https://popser.vcui.dev/collaborate) — contribution guide with actual context, not just a checklist.
- Interactive toast demos in docs pages (types, anchored, custom, styling).
- Open Graph images and sitemap for the documentation site.

### Changed
- `README.md` rewritten: bundle size table, docs site links, Base UI positioning, contributing section.
- `CONTRIBUTING.md` rewritten: architecture reference, human tone, actual guidance on what needs help.
- `package.json` homepage now points to [popser.vcui.dev](https://popser.vcui.dev) instead of GitHub.
- GitHub repo description and homepage updated.
- `docs/popser-sonner.md` updated with v1.1.0 bundle sizes and `styles/min` export.
- `docs/popser-toast.md` updated with `styles/min` import path.

### No code changes

Zero changes to `src/`. Same build output as 1.1.0. If you're already on 1.1.0, this is just metadata.

---

## [1.1.0] - 2026-02-28

The diet patch. Same features, half the calories.

### The numbers

JS bundle:

| | Raw | Gzipped |
|---|---|---|
| 1.0.0 | 29.0 KB | 6.6 KB |
| 1.1.0 | 13.4 KB | 4.8 KB |
| | **-54%** | **-27%** |

CSS bundle (via `@vcui/popser/styles/min`):

| | Raw | Gzipped |
|---|---|---|
| 1.0.0 | 24.9 KB | 5.4 KB |
| 1.1.0 | 14.3 KB | 2.6 KB |
| | **-43%** | **-52%** |

Total: 7.4 KB gzipped. Sonner ships ~17 KB. We're less than half.

### Added
- `@vcui/popser/styles/min` export: single inlined, minified CSS file. No more 6 HTTP requests for CDN users. Modular imports (`@vcui/popser/styles`) still available.

### Changed
- JS minification enabled in tsup. The dist was shipping formatted, readable JavaScript. Lovely for education. Terrible for bandwidth.
- Promise handler deduplication: `successHandler` and `errorHandler` in `toast.promise()` were near-identical ~100-line blocks. Extracted into shared `buildPromiseHandler()` factory.
- Spinner bars array hoisted to module scope. No more per-render allocation for 12 static `<div>` elements.

### Removed
- Dead constants: `DEFAULT_EXPAND`, `DEFAULT_RICH_COLORS`, `DEFAULT_THEME`. Exported but never imported anywhere. tsup tree-shook them anyway, but dead code in source is still dead code.

---

## [1.0.0] - 2026-02-27

The "we're not prefixing everything with 0. anymore" release. Same library, bigger number, calmer energy.

### Added
- Close buttons now visible on all toasts when stack is expanded (hover mode). Previously only the front toast showed its close button on hover. Now when you expand the stack, every toast gets one. Revolutionary, I know.
- Full documentation rewrite. Modular docs for every feature: API, Toaster, styling, promise toasts, anchored toasts, custom toasts, shadcn, testing. Plus updated comparison docs against Sonner and Base UI Toast. The README is no longer a wall of text pretending to be documentation.

### Changed
- Version number. That's the breaking change. The API is identical to 0.4.0. If your code worked yesterday, it works today.

---

## [0.4.0] - 2026-02-27

The "everything should have been smooth from the start" release. Theme detection actually works now, animations don't jank, and the expand/collapse transition stops looking like a PowerPoint slide from 2003.

### Added
- `theme="system"` now resolves to actual `"light"` or `"dark"` via `matchMedia("prefers-color-scheme")`. Previously it just passed `"system"` as a string to `data-theme` and hoped your CSS would figure it out. Now it does the work.
- Anchored toast enter/exit: dedicated `scale(0.95)` fade animation instead of inheriting the viewport slide.
- Expanded close buttons: hover-mode close buttons show at `opacity: 0.5` when the stack is expanded. Mobile close button opacity bumped from 0.5 to 0.7.

### Changed
- **Expanded stack layout completely rewritten.** Toasts stay `position: absolute` in both collapsed and expanded states. Expand/collapse is now a smooth animated transition using `--toast-offset-y` offsets instead of the old flex-column layout swap that caused a jarring jump. This is the big one.
- Mobile forces `bottom-center` position regardless of the `position` prop. Because top-right toasts on a 375px screen is a crime.
- Mouse handlers moved from individual `<Toast.Root>` elements to the viewport. Fewer event listeners, same behavior.
- Exit animations: toasts now slide back in the direction they entered (bottom toasts slide down to exit, top toasts slide up). Previously they slid in the opposite direction, which looked wrong.
- All stacking transitions use `cubic-bezier(0.32, 0.72, 0, 1)` easing. The old linear 400ms felt like moving furniture.
- Arrow CSS rewritten: proper per-side positioning with border triangles. Each `data-side` gets its own transform, border pair, and edge pinning. The old "rotate 45deg and hope" approach is gone.
- Spinner: `contain: content` replaces `will-change: opacity`. Less GPU layer promotion, same visual.
- Action button hover: `filter: brightness(1.15)` replaces `opacity: 0.9`. Looks better on colored backgrounds.
- `will-change: transform, opacity` added to stacking transitions for GPU acceleration.
- Expanded viewport uses `::before` pseudo-element to extend hover area instead of changing layout. Prevents Floating UI coordinate breakage for anchored toasts.
- Gap-filling `::after` pseudo-elements on expanded toasts prevent mouseLeave when moving between stacked items.

### Removed
- `onMouseEnter`/`onMouseLeave` props from `PopserToastRoot`. Mouse tracking is viewport-level now.

---

## [0.3.1] - 2026-02-27

### Changed
- Package renamed from `popser` to `@vcui/popser`. Scoped under the `@vcui` org because npm naming is a land grab and I arrived late.
- All imports, docs, and registry references updated to `@vcui/popser`.

---

## [0.3.0] - 2026-02-27

Anchored toasts. Pin a toast to a button, a click event, or arbitrary coordinates. Think tooltips but for notifications.

### Added
- **Anchored toasts** via `anchor` prop. Accepts `Element`, `MouseEvent`, or `{x, y}` coordinates.
- `anchorSide`: `"top"` | `"bottom"` | `"left"` | `"right"` | `"inline-start"` | `"inline-end"` (default: `"bottom"`)
- `anchorAlign`: `"start"` | `"center"` | `"end"` (default: `"center"`)
- `anchorOffset`: distance from anchor in px (default: 8)
- `anchorAlignOffset`: alignment offset in px
- `anchorPositionMethod`: `"absolute"` | `"fixed"`
- `anchorSticky`: keep toast visible when anchor scrolls
- `anchorCollisionBoundary`: viewport or element collision detection
- `anchorCollisionPadding`: collision padding in px
- `arrow`: show arrow pointing at anchor (default: false)
- `arrowPadding`: arrow edge padding in px
- `anchor-resolver.ts`: resolves `MouseEvent` and `{x, y}` to synthetic DOM elements with automatic cleanup
- `buildPositionerProps()` in toast-mapper for Base UI `Toast.Positioner` integration
- Only one anchored toast visible at a time. New one closes the previous.
- Arrow styles with `data-popser-arrow` and `data-side` attributes
- Anchored toasts excluded from viewport stacking (no collapse/expand)
- `PopserAnchor` type exported
- `data-anchored` attribute on anchored toast roots

### Changed
- Sourcemaps disabled in build output. Your bundle debugger was never going to trace through Base UI anyway.

---

## [0.2.0] - 2026-02-26

The real first release. 0.1.x was a series of increasingly frantic patches that should have been one version. This is the one where it actually works properly.

### Added
- `toast.custom((id) => jsx)`: render arbitrary JSX, bypass default layout. Renders with `data-type="custom"`.
- `toast.message()`: explicit default-type toast. Sonner compatibility.
- `toast.dismiss()`: alias for `toast.close()`. Sonner compatibility.
- `toast.getToasts()`: returns array of active toast IDs.
- `duration` option: alias for `timeout`. Because Sonner users shouldn't have to read a migration guide for a timer prop.
- `onAutoClose(id)` callback: fires when toast auto-dismisses by timeout.
- `onDismiss(id)` callback: fires when user manually dismisses.
- `deduplicate` option: prevents duplicate toasts with the same string title. Uses internal `activeToastTitles` Map.
- Per-toast `dismissible` prop: control swipe/close per toast.
- `ariaLabel` prop on `<Toaster>`: custom ARIA label for the viewport.
- Promise handlers accept `ReactNode` (JSX), not just strings.
- Promise extended results: return `{ title, description, timeout, icon, action }` from success/error handlers.
- Promise conditional skip: return `undefined` to dismiss silently.
- Promise `finally` handler.
- Promise lazy evaluation: pass `() => promise` to delay execution.
- Per-toast `classNames` with 3-level merge (Toaster > toastOptions > per-toast).
- Action and cancel accept both `PopserAction` objects and raw `ReactNode`.
- All callbacks (`onClose`, `onAutoClose`, `onDismiss`) receive toast ID as argument.
- Internal toast data stored under `data.__popser` namespace to prevent collision with user data.
- `data-popser-id` attribute on every toast root for E2E test targeting.
- `isPopserAction()` and `isExtendedResult()` type guards.
- CSS: `prefers-reduced-motion` disables all animations.
- CSS: swipe-direction-specific exit animations.
- `toast-tracker.ts`: centralized tracking for active toasts, dedup, manual close flags.
- `toast-mapper.ts`: converts popser options to Base UI manager format.
- `PopserInternalData` interface for type-safe internal fields.

### Changed
- Stacking rewritten: absolute positioning with CSS variables (`--toast-index`, `--toast-frontmost-height`) instead of flex layout. No more layout thrashing.
- Expanded state: flex column-reverse with `overflow-y: auto` for scrollable toast lists.
- Mouse handlers added to individual toast roots for hover-to-expand.
- Close button hover mode shows on toast hover, always visible on mobile.
- `toast.update()` properly tracks callbacks and resets internal state.
- Promise toast: `queueMicrotask(() => getManager().close(id))` when handler returns `undefined`.

### Fixed
- Content behind non-front toasts properly hidden with `opacity: 0` transition.
- Reduced motion: all transitions disabled, not just animations.

---

## [0.1.0] - 2026-02-26

First release. Everything is new. Nothing is battle-tested. Ship it.

### Added
- Imperative toast API: `toast()`, `.success()`, `.error()`, `.info()`, `.warning()`, `.loading()`
- Promise toasts: `toast.promise()` with loading/success/error states
- Toast management: `toast.close()`, `toast.update()`
- `<Toaster>` component with configurable position, limit, timeout, theme
- Built-in SVG icons for all toast types + CSS spinner for loading
- Action and cancel buttons per toast
- Close button with always/hover/never visibility modes
- Rich colors support (opt-in via `richColors` prop)
- CSS custom properties for full theming control (`--popser-*` prefix)
- Light and dark mode token sets (OKLCH color space)
- Mobile responsive behavior with configurable `mobileBreakpoint` prop
- Swipe to dismiss with configurable direction(s)
- `useToaster()` hook for React context consumers
- shadcn registry support (`npx shadcn add @vcode-sh/popser`)
- Default styles via `import "@vcui/popser/styles"`
- Separate token import via `import "@vcui/popser/tokens"`
- Unstyled mode for full CSS control
- Stacking with expand-on-hover
- Per-toast `className`, `style`, `onClose`, `onRemove` overrides
- ARIA live regions with configurable priority
- F6 keyboard navigation to toast viewport
- `data-popser-*` attributes on every element for stable CSS/test selectors
- ESM + CJS dual output with TypeScript declarations
- Singleton toast manager with proper cleanup (no memory leaks)
- Error boundary in Toaster (one broken toast doesn't crash the viewport)
