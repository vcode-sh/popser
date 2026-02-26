# Popser vs Base UI Toast

> Comparative analysis. Popser wraps Base UI Toast primitives into a production-ready imperative API with Sonner-compatible DX.

---

## At a Glance

| | **Popser** | **Base UI Toast** |
|---|---|---|
| Type | Library (npm package) | Primitive components (part of @base-ui/react) |
| API style | Imperative (`toast.success()`) | Declarative (React components + hooks) |
| Ready to use | Yes -- import and call | No -- requires assembly |
| Built-in icons | 4 SVGs + CSS spinner | None |
| Built-in styles | Opt-in CSS file | None |
| shadcn/ui registry | Yes | No |
| Close button | Built-in with 3 modes | Bare `<Toast.Close>` |
| Action buttons | `{ label, onClick }` API | `actionProps` config object |
| close all | `toast.close()` | Manual iteration or PR #3979 |
| `update()` | `toast.update(id, opts)` | `manager.update(id, opts)` |
| Promise toasts | `toast.promise()` | `manager.promise()` |
| Priority system | `priority: "high"` | `priority: "high"` |
| Anchored toasts | Planned v0.2 | `Toast.Positioner` + `Toast.Arrow` (stable since v1.0.0) |

---

## Relationship

Popser is **built on** Base UI Toast. Every popser component wraps a Base UI primitive:

```
Popser                  →  Base UI
─────────────────────────────────────
<Toaster>               →  <Toast.Provider> + <Toast.Portal> + <Toast.Viewport>
<PopserToastRoot>       →  <Toast.Root> + <Toast.Content>
<Toast.Title>           →  <Toast.Title>
<Toast.Description>     →  <Toast.Description>
<ToastCloseButton>      →  <Toast.Close>
<ToastActions>          →  <Toast.Action> + <Toast.Close>
toast()                 →  manager.add()
toast.close()           →  manager.close()
toast.update()          →  manager.update()
toast.promise()         →  manager.promise()
getManager()            →  Toast.createToastManager()
useToaster()            →  Toast.useToastManager()
```

Popser adds: imperative API, built-in icons, CSS tokens, classNames, close button modes, mobile responsive, shadcn integration, and the `data-popser-*` attribute system.

---

## What Base UI Provides (and We Use)

### Core Architecture

| Feature | How Popser Uses It |
|---|---|
| `Toast.createToastManager<T>()` | Singleton in `manager.ts`, shared between imperative API and Provider. Generic since Base UI v1.2.0. |
| `Toast.useToastManager()` | Re-exported as `useToaster()` + used in `<ToasterContent>` |
| Reactive store | Drives toast list rendering, no manual subscription |
| Memoized selectors | Prevents unnecessary re-renders |
| `Toast.Provider` | Wraps everything, receives `limit`, `timeout`, `toastManager` |
| `Toast.Portal` | Renders viewport outside DOM tree, no hydration issues |
| `Toast.Viewport` | ARIA landmark region, F6 keyboard target |
| `Toast.Root` | Individual toast wrapper, swipe handling, transitions |
| `Toast.Content` | Inner container, `data-behind` for stacking |
| `Toast.Title` | Semantic `<h2>`, ARIA announcement text |
| `Toast.Description` | Semantic `<p>`, ARIA announcement text |
| `Toast.Close` | Dismiss button, properly removes from store |
| `Toast.Action` | Action button, ARIA-compliant |

### CSS Variables (from Base UI)

| Variable | Purpose | Used in Popser |
|---|---|---|
| `--toast-height` | Measured natural height (px) | Stacking calculation |
| `--toast-index` | Position in list (0 = frontmost) | Z-order, scale, opacity |
| `--toast-offset-y` | Vertical offset when expanded (px) | Expanded layout |
| `--toast-swipe-movement-x` | Horizontal swipe offset | Swipe animation |
| `--toast-swipe-movement-y` | Vertical swipe offset | Swipe animation |
| `--toast-frontmost-height` | Height of front toast | Collapsed uniform height, viewport sizing |

### Data Attributes (from Base UI)

| Attribute | Element | Purpose |
|---|---|---|
| `data-starting-style` | Root | Entry animation trigger |
| `data-ending-style` | Root | Exit animation trigger |
| `data-expanded` | Viewport, Root | Expanded state |
| `data-limited` | Root | Removed due to limit |
| `data-swiping` | Root | Active swipe gesture |
| `data-swipe-direction` | Root | Direction being swiped |
| `data-behind` | Content | Behind frontmost toast |
| `data-type` | Root, Title, Description, Action, Close | Toast type value |

### Accessibility (from Base UI)

| Feature | Implementation |
|---|---|
| ARIA live region | Viewport announces new toasts to screen readers |
| Priority system | `"high"` = assertive announcement, `"low"` = polite |
| F6 keyboard navigation | Focus jumps to viewport landmark |
| Heading hierarchy | `<Toast.Title>` renders as `<h2>` |
| Swipe handling | Touch-accessible, `data-swipe-ignore` for interactive content |

---

## What Popser Adds on Top

### 1. Imperative API (Sonner DX)

Base UI requires React hooks and components:

```tsx
// Base UI (raw) -- requires React component context
function MyComponent() {
  const { add } = Toast.useToastManager();
  const handleClick = () => {
    add({
      title: "Photo uploaded",
      description: "12 photos added.",
      type: "success",
      data: { icon: <CheckIcon /> },
    });
  };
  return <button onClick={handleClick}>Upload</button>;
}
```

Popser provides an imperative API callable from anywhere:

```ts
// Popser -- works outside React
import { toast } from "popser";

toast.success("Photo uploaded", {
  description: "12 photos added.",
  icon: <CheckIcon />,
});
```

### 2. Built-in Icons

Base UI renders no icons. You must provide everything.

Popser includes 4 inline SVGs (success, error, info, warning) + a CSS spinner (loading). Zero external dependencies. All use `currentColor` for theming.

Override chain: `toast.icon` > `Toaster.icons[type]` > built-in SVG > null.

### 3. Built-in CSS Tokens + Styles

Base UI ships zero CSS. You style from scratch.

Popser ships two opt-in CSS files:

```ts
import "popser/styles";  // Full default styles (~9 KB)
import "popser/tokens";  // Just CSS custom properties (~2 KB)
```

OKLCH color space. Light + dark themes. Rich color variants for all 5 types. Loading spinner animation. Mobile responsive. Position variants. Enter/exit transitions.

### 4. classNames System

Base UI uses `className` (string or function) on each component individually.

Popser adds a `classNames` prop on `<Toaster>` that cascades to all toast elements:

```tsx
<Toaster
  classNames={{
    viewport: "fixed bottom-4 right-4",
    root: "rounded-lg bg-popover border p-4",
    title: "text-sm font-medium",
    description: "text-sm text-muted-foreground",
    actionButton: "bg-primary text-primary-foreground",
    cancelButton: "border",
    closeButton: "opacity-50 hover:opacity-100",
    icon: "mr-2",
    header: "flex gap-3",
    content: "flex flex-col",
    actions: "flex gap-2 mt-3",
  }}
/>
```

11 named slots. Applied globally. Per-toast `className` merges with global.

### 5. Close Button Component

Base UI provides a bare `<Toast.Close>` element. No icon, no visibility modes.

Popser wraps it into `<ToastCloseButton>` with:
- Built-in X icon (stroke SVG, 14x14)
- Three modes: `"always"` | `"hover"` | `"never"`
- Hover mode: hidden by default, visible on toast hover/focus
- Mobile: hover-mode buttons always visible (no hover on touch)
- `aria-label="Close notification"`
- Custom icon override via `icons.close`

### 6. Action Button Wrapper

Base UI uses `actionProps` -- a config object passed to `Toast.Action`:

```tsx
// Base UI (raw)
manager.add({
  title: "Deleted",
  actionProps: { children: "Undo", onClick: handleUndo },
});
```

Popser uses `{ label, onClick }` -- simpler, Sonner-compatible:

```ts
// Popser
toast.error("Deleted", {
  action: { label: "Undo", onClick: handleUndo },
  cancel: { label: "Dismiss" },
});
```

Cancel button wraps `Toast.Close` (auto-dismisses).

### 7. Data Attributes System

Base UI provides `data-type`, `data-starting-style`, etc.

Popser adds a parallel `data-popser-*` system for stable CSS targeting:

| Attribute | Element | Always Present |
|---|---|---|
| `data-popser-viewport` | Viewport | Yes |
| `data-popser-root` | Toast root | Yes |
| `data-popser-content` | Content wrapper | Yes |
| `data-popser-header` | Header row | Yes |
| `data-popser-text` | Text wrapper | Yes |
| `data-popser-title` | Title | Yes |
| `data-popser-description` | Description | When present |
| `data-popser-icon` | Icon wrapper | When present |
| `data-popser-close` | Close button | When present |
| `data-popser-actions` | Actions container | When present |
| `data-popser-action` | Action button | When present |
| `data-popser-cancel` | Cancel button | When present |
| `data-popser-spinner` | Loading spinner | When loading |
| `data-popser-spinner-bar` | Spinner bar (x12) | When loading |
| `data-position` | Viewport | Yes |
| `data-theme` | Viewport | Yes |
| `data-rich-colors` | Viewport | When enabled |
| `data-expanded` | Viewport | When expanded (hover or prop) |
| `data-mobile` | Viewport | When below mobileBreakpoint |
| `data-close-button` | Close button | Yes (mode value) |

### 8. Mobile Responsive

Base UI provides no mobile handling.

Popser detects mobile via JS `window.matchMedia` and sets a `data-mobile` attribute on the viewport:
- `mobileBreakpoint` prop (default: 600px) drives `matchMedia` listener
- `data-mobile` attribute enables mobile CSS: full-width toasts, bottom positioning, always-visible close buttons
- Toast width: `calc(100vw - 2 * var(--popser-offset, 16px))`
- This approach (JS + data attribute) allows the breakpoint to be configurable at runtime, unlike CSS `@media` which requires a compile-time value

### 9. Hover-to-Expand with Debounce

Base UI provides `data-expanded` attribute but relies on CSS `:hover` or manual state.

Popser implements JS-driven expansion in `<ToasterContent>`:
- `isHovering` React state with `handleMouseEnter`/`handleMouseLeave` callbacks
- 100ms debounce timeout on `mouseLeave` to prevent flicker when moving between toasts
- Mouse handlers attached to individual `<Toast.Root>` elements (via `onMouseEnter`/`onMouseLeave` passthrough)
- `mouseLeave` on the viewport as fallback when cursor exits the stack entirely
- `isExpanded = expand || isHovering` drives `data-expanded` on viewport
- This JS approach avoids CSS `:has()` feedback loops where layout changes cause mouseLeave→collapse→mouseEnter→expand cycles

### 10. Collapsed Stacking CSS

Base UI provides `--toast-index` and `--toast-frontmost-height` but no default stacking styles.

Popser implements a full collapsed card stack:
- Toasts are `position: absolute`, anchored to the bottom (or top) of the viewport
- `z-index: calc(100 - var(--toast-index, 0))` for front-to-back layering
- `height: var(--toast-frontmost-height, auto)` + `overflow: hidden` for uniform card height
- `transform: translateY(-index * gap) scale(1 - index * 0.05)` for peek + shrink effect
- `opacity: clamp(0, visibleCount - index, 1) * (1 - index * 0.1)` for fade + visibility cutoff
- Content of non-front toasts hidden with `opacity: 0`
- Expanded state: viewport switches to `display: flex` + `column-reverse` with `overflow-y: auto`, toasts become `position: relative` flow items
- Transitions only on collapsed mode (400ms) to avoid jarring layout shift during expand/collapse

### 11. shadcn Registry

Base UI has no registry integration.

Popser ships as `npx shadcn add @vcode-sh/popser`:
- Pre-configured wrapper with `next-themes` integration
- CSS variable bridge to shadcn design tokens
- Drop-in replacement for shadcn's sonner component

### 12. Rich Colors

Base UI sets `data-type` but ships no color system.

Popser ships full rich color tokens for all 5 types (success, error, info, warning, loading) in both light and dark themes. Enabled via `richColors` prop. OKLCH color space.

---

## Base UI Issues We Address

### Base UI Issues We Address

| # | Issue | Status | Popser Solution |
|---|---|---|---|
| #2809 | `Toast.Description` doesn't render with `render` prop | Open | We use standard `children`, not `render` prop for Description |
| #3335 | `actionProps` is config-object, not ReactNode | Open | Wrapped in `{ label, onClick }` object, rendered as `<Toast.Action>` children |
| #3437 | Type augmentation needed for custom types | Open | `type?: PopserType \| (string & {})` allows any string while providing autocomplete |
| #3952 | Module augmentation for type extension | Open | Same solution -- union type with string escape hatch |
| #3979 | Close all toasts | Open | `toast.close()` without args iterates `activeToasts` Set |
| #2287 | Toast error with react-router v7 SSR | **Fixed** in Base UI | No action needed — resolved upstream |
| #2291 | `toast.promise` ignores `success.timeout` / `error.timeout` | **Fixed** in Base UI | No action needed — resolved upstream (PR #2294) |
| #3026 | Anchor toast to an element | **Shipped** as `Toast.Positioner` | Planned for Popser v0.2 |

### Merged PRs We Benefit From

| # | PR | Benefit |
|---|---|---|
| #3464 | Reactive store refactor | Foundation for our manager singleton |
| #3882 | Generic `useToastManager<T>` and `createToastManager<T>` | Type-safe custom data access (v1.2.0) |
| #3359 | Height recalculation on layout change | Content updates work correctly |
| #4040 | Prevent dismissed promise toast from reopening | Promise transitions are clean |
| #3469 | Fix `<Toast.Close>` aria-hidden warning | Close button accessibility |
| #3564 | Fix timers not rescheduled on update | `toast.update()` resets timeout |
| #3443 | Fix `flushSync` dev error | Clean React 19 compatibility |
| #3392 | Fix multiple swipe directions on same axis | Multi-direction swipe works |
| #3096 | Anchored toast support (`Toast.Positioner`) | Foundation for v0.2 anchored toasts |
| #2929 | `ReactNode` for title/description | Rich content in toasts |
| #2742 | Variable height stacking | Mixed-height toasts stack correctly |
| #2770 | Reduce stickiness of expanded state | Better hover expand/collapse |
| #2769 | Freeze toast transform during swipe | Smooth swipe animations |
| #2246 | Viewport as announce container | ARIA live region for screen readers |

---

## API Mapping

### Manager Methods

| Popser | Base UI | Notes |
|---|---|---|
| `toast("title", opts)` | `manager.add({ title, ...opts })` | Wraps in `toManagerOptions()` |
| `toast.success("title")` | `manager.add({ title, type: "success" })` | Convenience method |
| `toast.close(id)` | `manager.close(id)` | Also removes from `activeToasts` |
| `toast.close()` | Loop `manager.close(id)` | Iterates all active IDs |
| `toast.update(id, opts)` | `manager.update(id, opts)` | Converts to Base UI shape |
| `toast.promise(p, opts)` | `manager.promise(p, opts)` | Converts string/fn success/error handlers |

### Component Mapping

| Popser Component | Base UI Components Used | What's Added |
|---|---|---|
| `<Toaster>` | Provider, Portal, Viewport | `limit`, `timeout`, manager injection, data attributes, CSS vars |
| `<ToasterContent>` | Viewport (renders inside Provider) | `isHovering` + debounce, `isMobile` via matchMedia, mouse handlers |
| `<PopserToastRoot>` | Root, Content | classNames merging, data-popser attributes, mouse handler passthrough, typed `ToastObject<PopserToastData>` |
| `<ToastIcon>` | None | 4 SVGs, spinner, icon override chain |
| `<ToastActions>` | Action, Close | `{ label, onClick }` API, cancel auto-dismisses |
| `<ToastCloseButton>` | Close | 3 visibility modes, built-in icon, aria-label |
| `useToaster()` | `useToastManager()` | Thin re-export |
| `getManager()` / `resetManager()` / `clearManager()` | `createToastManager()` | Singleton lifecycle (lazy init, reset, clear for tests) |

---

## What Base UI Provides That We Don't Expose (Yet)

| Feature | Base UI | Popser Status |
|---|---|---|
| `Toast.Positioner` | Anchor to DOM element (stable since v1.0.0) | Planned v0.2 |
| `Toast.Arrow` | Arrow pointing at anchor (stable since v1.0.0) | Planned v0.2 |
| `render` prop | Custom element rendering | Planned v0.2 (for `toast.custom()`) |
| `collisionAvoidance` | Flip/shift strategies (via Floating UI) | Planned v0.2 (via Positioner) |
| `positionMethod` | `"absolute"` \| `"fixed"` | Planned v0.2 |
| `disableAnchorTracking` | Stop following anchor (renamed from `trackAnchor` in beta.5) | Planned v0.2 |
| `data-limited` | Alternate exit animation | CSS available, not styled yet |
| `data-swipe-direction` on exit | Direction-specific exit | CSS available, not styled yet |

---

## Popser Pros (vs Raw Base UI)

1. **Zero assembly** -- import, render `<Toaster>`, call `toast()`. Done.
2. **Imperative API** -- works outside React components, event handlers, async code
3. **Built-in icons** -- 4 SVGs + spinner, zero deps, full override
4. **Built-in CSS** -- OKLCH tokens, light/dark, rich colors, responsive, animations
5. **Sonner-compatible DX** -- familiar API for millions of developers
6. **classNames system** -- 11 named slots, cascading from Toaster
7. **Close button modes** -- 3 modes with mobile awareness
8. **Stable selectors** -- `data-popser-*` on every element
9. **shadcn registry** -- one-command install
10. **Mobile responsive** -- built-in, configurable breakpoint
11. **Rich colors** -- type-specific color tokens, opt-in

## Popser Cons (vs Raw Base UI)

1. **Opinionated DOM structure** -- fixed layout (icon + text + close in header, actions below)
2. **Less flexible rendering** -- no `render` prop access (yet)
3. **String IDs only** -- Base UI constraint passed through
4. **Single manager** -- one toast stack, not multiple
5. **Fixed component hierarchy** -- can't rearrange toast internals
6. **Additional abstraction layer** -- thin but present

---

## When to Use Base UI Toast Directly

- You need fully custom toast rendering (no default structure)
- You want anchored toasts now (v0.2 will add this)
- You need multiple independent toast stacks
- You're already building a design system and want maximum control
- You don't want any imperative API pattern

## When to Use Popser

- You want Sonner DX with Base UI foundations
- You're migrating from Sonner
- You want built-in icons, styles, and accessibility
- You're using shadcn/ui
- You need `toast.success()` callable from anywhere
- You want production-ready out of the box

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│  Your App                                           │
│                                                     │
│  toast.success("Done!")     <Toaster position="...">│
│       │                           │                 │
│       ▼                           ▼                 │
│  ┌─────────┐              ┌──────────────┐          │
│  │ toast.ts │──────┐      │ toaster.tsx   │          │
│  │ (API)    │      │      │ (Component)   │          │
│  └─────────┘      │      └──────────────┘          │
│                    │             │                   │
│                    ▼             ▼                   │
│            ┌─────────────────────────┐              │
│            │     manager.ts          │              │
│            │  (Singleton)            │              │
│            │                         │              │
│            │  Toast.createToastManager()  ◄── Base UI│
│            └─────────────────────────┘              │
│                         │                           │
│                         ▼                           │
│  ┌──────────────────────────────────────────┐       │
│  │  Base UI Primitives                       │       │
│  │                                           │       │
│  │  Toast.Provider                           │       │
│  │    └── Toast.Portal                       │       │
│  │          └── Toast.Viewport               │       │
│  │                └── Toast.Root (per toast)  │       │
│  │                      └── Toast.Content    │       │
│  │                            ├── Toast.Title│       │
│  │                            ├── Toast.Description  │
│  │                            ├── Toast.Close│       │
│  │                            └── Toast.Action       │
│  └──────────────────────────────────────────┘       │
│                         │                           │
│                         ▼                           │
│  ┌──────────────────────────────────────────┐       │
│  │  Popser Additions                         │       │
│  │                                           │       │
│  │  toast-icon.tsx    (4 SVGs + spinner)     │       │
│  │  toast-close.tsx   (3 modes)              │       │
│  │  toast-action.tsx  ({ label, onClick })   │       │
│  │  toast-root.tsx    (assembly + classNames) │       │
│  │  styles/           (OKLCH tokens + CSS)   │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```
