# Popser vs Sonner

> Comparative analysis. Popser is built to be a drop-in replacement for Sonner with zero compromises.

---

## At a Glance

| | **Popser** | **Sonner** |
|---|---|---|
| Foundation | Base UI Toast primitives | Custom implementation (singleton Observer) |
| Version | 0.1.2 | 2.0.7 |
| React | 18 + 19 | 18+ |
| TypeScript | Strict, `verbatimModuleSyntax` | TypeScript (loose) |
| Bundle (ESM) | ~12.6 KB (unminified) | ~2-3 KB (minified+gzip) |
| CSS | Opt-in file, OKLCH tokens | Bundled inline, HSL gray scale |
| Dependencies | `@base-ui/react` (peer) | Zero runtime deps |
| Source files | 10 modules + 2 CSS | 6 files (`index.tsx`, `state.ts`, `types.ts`, `hooks.tsx`, `assets.tsx`, `styles.css`) |
| npm downloads | New | ~10.9M/week |
| Stars | New | 12K+ |
| Open issues | 0 | 65 |
| Last push | Active | Dec 2025 (7+ months stale) |
| shadcn/ui | Registry-ready | Official integration |
| License | MIT | MIT |

---

## API Comparison

### Imperative API

| Method | **Popser** | **Sonner** |
|---|---|---|
| `toast("msg")` | `toast("msg")` | `toast("msg")` |
| `toast.success()` | `toast.success()` | `toast.success()` |
| `toast.error()` | `toast.error()` | `toast.error()` |
| `toast.info()` | `toast.info()` | `toast.info()` |
| `toast.warning()` | `toast.warning()` | `toast.warning()` |
| `toast.loading()` | `toast.loading()` | `toast.loading()` |
| `toast.promise()` | `toast.promise()` | `toast.promise()` |
| `toast.close(id)` | `toast.close(id)` | `toast.dismiss(id)` |
| `toast.close()` (all) | `toast.close()` | `toast.dismiss()` |
| `toast.update(id, opts)` | `toast.update(id, opts)` | Not available |
| `toast.custom(jsx)` | Not yet (planned) | `toast.custom(jsx)` |
| Returns | `string` (toast ID) | `string \| number` |

### Migration from Sonner

```diff
- import { toast } from "sonner";
+ import { toast } from "popser";

- toast.dismiss(id);
+ toast.close(id);

- toast("msg", { duration: 3000 });
+ toast("msg", { timeout: 3000 });

- toast("msg", { duration: Infinity });
+ toast("msg", { timeout: 0 });
```

95% of callsites need zero changes. The remaining 5% is mechanical rename.

---

## Toast Options

| Option | **Popser** | **Sonner** | Notes |
|---|---|---|---|
| `description` | `ReactNode` | `ReactNode` | Same |
| `timeout` / `duration` | `timeout: number` | `duration: number` | Renamed for clarity |
| `id` | `string` | `string \| number` | Popser is string-only (Base UI) |
| `icon` | `ReactNode \| false` | `ReactNode` | `false` explicitly hides icon |
| `action` | `{ label, onClick }` | `{ label, onClick }` | Same shape |
| `cancel` | `{ label, onClick }` | `{ label, onClick }` | Same shape |
| `type` | `PopserType \| string` | Internal only | Popser exposes custom types |
| `priority` | `"low" \| "high"` | Not available | Screen reader urgency (ARIA) |
| `onClose` | `() => void` | `onDismiss` | Renamed |
| `onRemove` | `() => void` | `onAutoClose` | Called after exit animation |
| `className` | `string` | Via `classNames` | Per-toast class |
| `style` | `CSSProperties` | `style` | Same |
| `data` | `Record<string, unknown>` | Not available | Custom data bag |
| `dismissible` | Controlled via CSS/swipe | `boolean` | Popser uses `swipeDirection` |
| `invert` | Not needed | `boolean` | Popser uses `theme` prop |
| `testId` | `data-popser-root` always | `testId` prop | Stable selectors by default |
| `position` | On `<Toaster>` only | Per-toast override | Architectural choice |

---

## Toaster Props

| Prop | **Popser** | **Sonner** | Notes |
|---|---|---|---|
| `position` | 6 positions | 6 positions | Same |
| `limit` | `number` (default: 3) | `visibleToasts` (default: 3) | Same behavior, better name |
| `timeout` | `number` (default: 5000) | `toastOptions.duration` (default: 4000) | Top-level prop |
| `closeButton` | `"always" \| "hover" \| "never"` | `boolean` | 3 modes vs on/off |
| `expand` | `boolean` | `boolean` | Same |
| `richColors` | `boolean` | `boolean` | Same |
| `theme` | `"light" \| "dark" \| "system"` | `"light" \| "dark" \| "system"` | Same |
| `offset` | `number \| string` | `string \| number \| object` | Simpler |
| `gap` | `number` | `number` | Same |
| `mobileBreakpoint` | `number` (default: 600) | Hardcoded 600px | Configurable! |
| `swipeDirection` | `string \| string[]` | `string[]` | Same |
| `icons` | `PopserIcons` | `object` | Same concept |
| `classNames` | `PopserClassNames` (11 slots) | 6 slots | More granular |
| `style` | `CSSProperties` | Not available | Viewport inline styles |
| `unstyled` | `boolean` | `boolean` | Same |
| `mobileOffset` | Via CSS variable | `string \| number \| object` | CSS > JS |
| `dir` | Not needed | `"ltr" \| "rtl"` | Base UI handles this |
| `hotkey` | F6 (Base UI built-in) | `Alt+T` | F6 is ARIA standard |
| `invert` | Not needed | `boolean` | Use `theme` instead |
| `toastOptions` | Not needed | `object` | Props are top-level |
| `toasterId` | Not needed | `string` | Single manager pattern |

---

## What We Do Differently

### 1. No Memory Leaks

**Sonner #729, #605:** Dismissed toasts are never evicted from the internal `this.toasts` array. Over time, the array grows unbounded. DOM nodes are leaked too.

**Popser:** Base UI's reactive store properly cleans up on close. Our `activeToasts` Set removes IDs on close. No leaks.

### 2. Proper `update()` API

**Sonner:** No `update()` method. To change a toast, you re-call `toast()` with the same ID, replacing the entire toast. Loading state bleeds through (#401, 10 comments). Action buttons persist on future toasts (#692).

**Popser:** `toast.update(id, partialOptions)` -- partial updates via Base UI's `manager.update()`. Only changed fields are updated. Type, icon, action all reset cleanly.

### 3. Close Button Modes

**Sonner #654, #705:** Close button is either always visible or hidden. No hover-to-show behavior (was removed, users want it back).

**Popser:** Three modes: `"always"`, `"hover"`, `"never"`. Hover is the default. On mobile, hover-mode buttons are always visible (touch has no hover).

### 4. Configurable Mobile Breakpoint

**Sonner #376 (open 2+ years, 7 upvotes):** Mobile breakpoint is hardcoded to 600px in CSS `@media (max-width: 600px)`. No way to change it.

**Popser:** `mobileBreakpoint` prop. Uses `window.matchMedia` to detect mobile and sets `data-mobile` attribute on viewport. CSS targets `[data-popser-viewport][data-mobile]` instead of a fixed media query. Fully configurable at runtime.

### 5. Height Recalculation

**Sonner #719, #715:** When a toast is updated with different content length, the height allocation doesn't change. Causes rendering bugs.

**Popser:** Base UI recalculates `--toast-height` on content change (PR #3359). CSS-driven, no JS measurement lag.

### 6. No Hydration Errors

**Sonner #528 (8 comments):** `<section>` rendered as child of `<html>` causes React hydration mismatch in Next.js.

**Popser:** Uses `Toast.Portal` which renders after mount. No SSR mismatch. No `setTimeout` workarounds needed.

### 7. No `!important` Required for User Styles

**Sonner #632, #633 (5 upvotes each):** Critical styling is gated behind `data-styled="true"` selector. Custom styles require `!important` to override.

**Popser:** Headless Base UI primitives. CSS is opt-in (`import "popser/styles"`). Your styles always win. OKLCH tokens via CSS variables -- override with a single `:root` block. The only `!important` usage is internal: enter/exit animations (`data-starting-style`/`data-ending-style`) use `!important` to override the collapsed stacking transforms. User-facing styles never need it.

### 8. Tailwind v4 Compatible

**Sonner #602:** Broken with Tailwind v4 due to internal CSS conflicts.

**Popser:** All tokens use OKLCH (Tailwind v4 native color space). Every element has `data-popser-*` attributes for Tailwind selectors. No internal CSS to fight.

### 9. Z-index / Dialog Layering

**Sonner #667 (5 upvotes), shadcn/ui #2401:** Toast appears above Radix UI dialogs but swipe doesn't work. Or appears below dialog backdrop.

**Popser:** `Toast.Portal` renders through proper React portal. Z-index managed via `data-popser-viewport` selector. Works with any dialog library.

### 10. Toast Queued Before Mount

**Sonner #723:** If `toast()` is called before `<Toaster>` mounts, the toast is silently dropped.

**Popser:** `createToastManager()` singleton queues toasts independently of React. When `<Toast.Provider>` mounts with the same manager, queued toasts flush automatically.

### 11. Promise Toast Icon Duplication

**Sonner #718:** Icon is rendered twice in promise toasts.

**Popser:** Single icon render path. `ToastIcon` component has a clear priority chain: per-toast icon > global icon > type-specific built-in. No duplication.

### 12. Accessibility First

**Sonner #713, #732:** SVG icons have no accessible names. No ARIA labels.

**Popser:**
- All icons have `role="img"` + `aria-label`
- Close button has `aria-label="Close notification"`
- `priority: "high"` maps to assertive ARIA live region
- F6 keyboard navigation (ARIA standard, vs Sonner's `Alt+T`)
- Viewport has `role="region"` + `aria-label="Notifications"`

### 13. Stable Test Selectors

**Sonner #714, #742:** No stable data attributes for testing. `data-testid` requires per-toast configuration.

**Popser:** Every element has a stable `data-popser-*` attribute: `data-popser-viewport`, `data-popser-root`, `data-popser-title`, `data-popser-description`, `data-popser-close`, `data-popser-action`, `data-popser-cancel`, `data-popser-icon`. Always present, zero config.

### 14. Width Not Constrained

**Sonner #678, #683, #684 (multiple issues):** Toast content restricted to text width. `w-auto` doesn't work. Custom toasts don't get proper width.

**Popser:** Width controlled by `--popser-width` CSS variable (default `356px`). Override globally with `:root { --popser-width: 400px; }` or per-toast with `classNames.root`. No `--width` constraint fighting.

### 15. Sonner-quality Stacking with CSS Variables

**Sonner:** Collapsed stacking via JS height measurement (`getBoundingClientRect`) + manual offset calculation. Layout thrashing on every toast add/remove.

**Popser:** Collapsed stacking via Base UI CSS variables (`--toast-index`, `--toast-frontmost-height`). Toasts are `position: absolute`, layered with `z-index: calc(100 - var(--toast-index))`, scaled down with `scale(1 - index * 0.05)`, and faded with progressive opacity. Content behind the front toast is hidden with `overflow: hidden` + `opacity: 0`. The `--popser-visible-count` CSS variable (from `limit` prop) cuts off toasts beyond the visible count. Expand on hover switches the viewport to `display: flex` with `overflow-y: auto` for scrollable toast lists -- fully CSS-driven layout shift, no JS measurement.

---

## What Sonner Does That We Don't (Yet)

| Feature | Status | Notes |
|---|---|---|
| `toast.custom(jsx)` | Planned v0.2 | Full JSX render via Base UI `render` prop |
| `toast.message()` | Not needed | Same as `toast()` |
| `toast.getHistory()` | Not planned | Sonner never cleans up, so it can return all past toasts |
| `toast.getToasts()` | Not planned | Use `useToaster()` hook for active toasts |
| `useSonner()` hook | `useToaster()` | Same concept, different name |
| `invert` prop | Not planned | Use `theme` instead |
| `dir` (RTL) | Base UI handles | No prop needed |
| `hotkey` customization | Base UI default (F6) | F6 is the ARIA standard |
| `toasterId` (multiple Toasters) | Not planned | Single manager pattern |
| `containerAriaLabel` | Hardcoded | Future: make configurable |
| `dismissible: false` | Via `swipeDirection={[]}` | Different approach |
| `mobileOffset` | Via CSS variable | `--popser-offset` |
| `testId` per toast | Not needed | `data-popser-root` is always present |
| `descriptionClassName` | Via `classNames.description` | More consistent API |
| `cancelButtonStyle` / `actionButtonStyle` | Via `classNames` | CSS > inline styles |
| Headless/custom render | Planned | Via Base UI `render` prop |
| Multi-toaster (`id` prop) | Not planned | Single manager is simpler |

---

## Architecture Comparison

### Sonner

```
Global ToastState (singleton Observer class)
  └── this.toasts: Array<ToastT>        (never shrinks! memory leak)
  └── this.subscribers: Array<callback>  (pub/sub to React)
  └── this.dismissedToasts: Set<id>
  └── ID generation: auto-incrementing integer counter

<Toaster>
  └── useEffect subscriber (not useLayoutEffect -- toasts can be lost)
  └── setTimeout(() => flushSync(() => setToasts(...)))  ← "temp solution"
  └── Renders <section aria-live="polite"> directly (hydration risk)
  └── <ol> per position
  └──   <li> per toast
  └──     getBoundingClientRect() for height measurement (layout thrashing)
  └──     Manual pointer events for swipe (velocity threshold: 0.11)
  └──     setTimeout for dismiss animation (200ms TIME_BEFORE_UNMOUNT)
```

**Problems:**
- Mutable `toasts` array grows forever -- JSX-heavy toasts leak 10-50KB each (#729, #605)
- Dual state: Observer has its own array AND React `useState` has a copy -- sync issues
- `setTimeout` + `flushSync` is a documented "temp solution" causing race conditions (#725, #730, #592)
- `useEffect` subscription misses toasts created in sibling `useEffect`/`useLayoutEffect` (#723)
- Height tracking via `getBoundingClientRect()` -- layout thrashing on every toast
- Animation system is imperative (JS timeouts, not CSS-driven)
- Swipe handling is custom pointer events (not accessible, sticks to cursor #733)
- `<section>` root causes SSR hydration mismatch (#528)

### Popser

```
Toast.createToastManager() (Base UI singleton)
  └── Reactive store with memoized selectors
  └── Proper cleanup on close
  └── Generic types: ToastObject<PopserToastData>

<Toast.Provider toastManager={manager} limit={N} timeout={ms}>
  └── <ToasterContent>
  │     └── useState(isHovering) + debounced mouse handlers (100ms)
  │     └── useState(isMobile) + matchMedia listener
  │     └── isExpanded = expand || isHovering
  └── <Toast.Portal> (proper React portal)
    └── <Toast.Viewport data-expanded data-mobile data-position data-theme>
    │     └── CSS vars: --popser-offset, --popser-gap, --popser-visible-count
    └── <Toast.Root> per toast (onMouseEnter/Leave forwarded)
          └── CSS vars: --toast-index, --toast-height, --toast-frontmost-height
          └── Collapsed: position:absolute, stacking via transforms + z-index
          └── Expanded: position:relative, flex flow, scrollable overflow
          └── data-starting-style / data-ending-style for enter/exit
          └── Native swipe handling (accessible, Base UI)
```

**Advantages:**
- Reactive store replaces mutable array -- no memory leaks
- CSS variables for collapsed stacking (no JS height measurement)
- JS-driven expansion with debounce (prevents mouseEnter/Leave flicker loops)
- JS-driven mobile detection via `matchMedia` (configurable breakpoint prop)
- `data-starting-style` / `data-ending-style` for enter/exit (CSS transitions)
- Base UI handles swipe, ARIA, keyboard, height recalculation
- Portal renders after mount (no hydration mismatch)
- `--popser-visible-count` CSS variable for opacity cutoff beyond visible limit

---

## CSS Architecture Comparison

### Sonner

- CSS bundled inline in the JS package
- Uses `data-styled="true"` to gate default styles
- HSL color values
- `!important` required for overrides
- Hardcoded `600px` mobile breakpoint
- `--width` CSS variable constrains toast width
- Custom properties not documented
- No opt-out mechanism

### Popser

- CSS is a separate opt-in file (`import "popser/styles"`)
- OKLCH color space (Tailwind v4 native)
- CSS custom properties documented and prefixed (`--popser-*`)
- Token file importable separately (`import "popser/tokens"`)
- User styles never need `!important` (internal `!important` only on enter/exit to override stacking)
- `mobileBreakpoint` prop drives JS `matchMedia` + `data-mobile` attribute
- `unstyled` mode for zero default styles
- `classNames` prop with 11 target slots
- Dark mode via `[data-theme="dark"]` or `.dark` class
- Collapsed stacking: `position: absolute` with `--toast-index` z-ordering, scale, opacity cutoff
- Expanded state: `display: flex` + `overflow-y: auto` (scrollable)
- `--popser-width` variable for toast width (default 356px)
- `--popser-visible-count` variable for collapsed visibility cutoff
- Transition timing: 400ms (matching Sonner) for collapsed transforms

---

## classNames Slots

| Slot | **Popser** | **Sonner** |
|---|---|---|
| `viewport` | `classNames.viewport` | Not available |
| `root` / `toast` | `classNames.root` | `classNames.toast` |
| `content` | `classNames.content` | Not available |
| `header` | `classNames.header` | Not available |
| `title` | `classNames.title` | `classNames.title` |
| `description` | `classNames.description` | `classNames.description` |
| `icon` | `classNames.icon` | Not available |
| `actionButton` | `classNames.actionButton` | `classNames.actionButton` |
| `cancelButton` | `classNames.cancelButton` | `classNames.cancelButton` |
| `closeButton` | `classNames.closeButton` | `classNames.closeButton` |
| `actions` | `classNames.actions` | Not available |
| `default` | Per-type via `data-type` | `classNames.default` (buggy #744) |

Popser: **11 slots**. Sonner: **6 slots** (and `default` is broken).

---

## Sonner Open Issues We Address

### Bugs (Fixed by Architecture)

| # | Issue | Popser Fix |
|---|---|---|
| #729 | Memory leak -- dismissed toasts never cleaned up | Base UI reactive store with proper cleanup |
| #605 | Toast DOM nodes are leaked | `onRemove` callback + store eviction |
| #719 | Height not recalculated on content update | `--toast-height` CSS variable, auto-recalc |
| #715 | Height from shorter toast preserved | Same as above |
| #692 | Action button persists on future toasts | Fresh data per toast, no shared state |
| #401 | Loading state not cleared with same ID | `update()` properly resets type |
| #718 | Icon rendered twice in promise | Single render path in `ToastIcon` |
| #528 | Hydration error (`<section>` in `<html>`) | `Toast.Portal` renders after mount |
| #723 | Toast dropped if called before mount | Manager queues independently |
| #730 | Update during dismiss animation skipped | Base UI handles state transitions |
| #725 | Re-creation after dismissal prevents re-render | Clean ID lifecycle |
| #592 | Dismissing toast timing desync | CSS transitions, not JS timeouts |
| #667 | Toast above dialogs but can't swipe | Proper portal + z-index management |
| #733 | Toast sticks to cursor when swiping | Base UI native swipe handling |

### Styling (Fixed by CSS Architecture)

| # | Issue | Popser Fix |
|---|---|---|
| #744 | `classNames.default` applies to all types | Type-based `data-type` attribute |
| #633 | Styling gated behind `data-styled="true"` | No gating -- CSS is opt-in import |
| #632 | Challenges customizing sonner | Headless primitives, no `!important` |
| #630 | Custom toast width misleading | `width: 356px` in default CSS, overridable |
| #683 | Toast content restricted to text width | Natural content sizing |
| #678 | Toast not centered with `w-auto` | CSS flexbox layout |
| #684 | Custom toast not getting width | Inherits from `[data-popser-root]` |
| #696 | Description color in light theme | OKLCH tokens, `opacity: 0.75` |
| #685 | CSS variables for icon hover | `data-type` on icon for styling |
| #682 | Headless centering broken | `data-position` with CSS selectors |
| #602 | Broken with Tailwind v4 | OKLCH native, no CSS conflicts |

### Features (Implemented)

| # | Issue | Popser Implementation |
|---|---|---|
| #376 | Custom mobile breakpoint | `mobileBreakpoint` prop |
| #654 | `closeButtonPosition` | `closeButton: "always" \| "hover" \| "never"` |
| #705 | Restore hover-to-show close | Default mode in popser |
| #714 | `data-toast-id` stable attribute | `data-popser-root` + `data-type` |
| #741 | Stable attribute on toaster | `data-popser-viewport` |
| #713 | SVG accessibility (aria-hidden) | `role="img"` + `aria-label` on all icons |
| #732 | Fix SVG accessibility | Same as above |
| #666 | Update toast and change ID | `toast.update(id, opts)` |
| #734 | `clearHistory` method | `toast.close()` closes all |

### Features Requested (Not Yet in Popser)

| # | Issue | Status |
|---|---|---|
| #740 | Vibration for duplicate toasts | Not planned |
| #674 | Persistent toasts via localStorage | Not planned |
| #681 | Abortable promise with AbortSignal | Planned |
| #655 | Popover API support | Not planned |
| #716 | Vanilla (non-React) support | Not planned (React-only) |
| #671 | `enterFrom` direction prop | Via CSS `data-starting-style` |

---

## Popser Pros

1. **Zero memory leaks** -- Base UI's reactive store with proper cleanup
2. **No `!important`** -- headless primitives, opt-in CSS
3. **OKLCH colors** -- Tailwind v4 native, modern color space
4. **`update()` API** -- partial updates, not full replacement
5. **3-mode close button** -- always / hover / never
6. **Configurable mobile breakpoint** -- prop, not hardcoded
7. **CSS-driven animations** -- `data-starting-style` / `data-ending-style`, direction-aware enter/exit
8. **CSS-driven stacking** -- `--toast-index`, `--toast-frontmost-height`, `--popser-visible-count`, no JS layout
9. **JS-driven expansion** -- debounced hover with 100ms timeout, prevents flicker loops
10. **ARIA-first accessibility** -- F6 nav, priority system, assertive announcements
11. **Stable test selectors** -- `data-popser-*` on every element
12. **11 classNames slots** -- vs Sonner's 6 (one broken)
13. **No hydration errors** -- proper portal rendering
14. **shadcn registry** -- `npx shadcn add @vcode-sh/popser`
15. **Clean architecture** -- Base UI primitives, thin wrapper, no state hacks

## Popser Cons

1. **Peer dependency on `@base-ui/react`** -- additional install
2. **Larger install footprint** -- Base UI adds to node_modules
3. **No `toast.custom()` yet** -- planned for v0.2
4. **New library** -- no production track record, no community yet
5. **No vanilla JS support** -- React-only
6. **No `invert` prop** -- intentional (use `theme` instead)
7. **IDs are strings only** -- Base UI constraint (sonner allows numbers)
8. **No multiple Toaster instances** -- single manager pattern

---

## Bundle Size Context

Sonner is very small (~2-3 KB gzipped) because it's a single self-contained file with no dependencies. Popser's JS is ~12.6 KB (unminified ESM) but:

1. `@base-ui/react` is tree-shakable -- only Toast primitives are included
2. The CSS is a separate file (not bundled in JS)
3. Icons are inline SVGs (no icon library dependency)
4. Total shipped CSS: ~11 KB (tokens + styles)

For apps already using `@base-ui/react` (shadcn v2 direction), the marginal cost of popser is minimal.

---

## shadcn/ui Integration

### Sonner (current)

```tsx
// components/ui/sonner.tsx (shadcn ships this)
import { Toaster as Sonner } from "sonner";

function Toaster(props) {
  const { theme } = useTheme();
  return <Sonner theme={theme} className="toaster group" {...props} />;
}
```

### Popser (drop-in replacement)

```tsx
// components/ui/popser.tsx (via npx shadcn add @vcode-sh/popser)
import { Toaster as PopserToaster } from "popser";

function Toaster(props) {
  const { theme } = useTheme();
  return (
    <PopserToaster
      theme={theme}
      richColors
      style={{
        "--popser-bg": "var(--popover)",
        "--popser-fg": "var(--popover-foreground)",
        "--popser-border": "var(--border)",
        "--popser-radius": "var(--radius)",
      }}
      {...props}
    />
  );
}
```

CSS variables bridge shadcn's design tokens to popser's token system. No theme file hacking.
