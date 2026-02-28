# Popser vs Base UI Toast

Popser wraps Base UI Toast primitives into a production-ready imperative API with Sonner-compatible DX. This doc maps what comes from Base UI, what popser adds, and where the boundaries are.

---

## At a Glance

| | **Popser** | **Base UI Toast** |
|---|---|---|
| Type | Library (npm package) | Primitive components (part of @base-ui/react) |
| API style | Imperative (`toast.success()`) | Declarative (React components + hooks) |
| Ready to use | Yes -- import and call | No -- requires assembly |
| Built-in icons | 5 SVGs + CSS spinner | None |
| Built-in styles | Opt-in CSS file | None |
| shadcn/ui registry | Yes | No |
| Close button | Built-in with 3 modes | Bare `<Toast.Close>` |
| Action buttons | `{ label, onClick }` API | `actionProps` config object |
| Close all | `toast.close()` | Manual iteration or PR #3979 |
| `update()` | `toast.update(id, opts)` | `manager.update(id, opts)` |
| Promise toasts | `toast.promise()` | `manager.promise()` |
| Priority system | `priority: "high"` | `priority: "high"` |
| Anchored toasts | `anchor` prop with full positioning options | `Toast.Positioner` + `Toast.Arrow` |

---

## Relationship

Popser is **built on** Base UI Toast. Every popser component wraps a Base UI primitive:

```
Popser                  →  Base UI
─────────────────────────────────────
<Toaster>               →  <Toast.Provider> + <Toast.Portal> + <Toast.Viewport>
<PopserToastRoot>       →  <Toast.Root> + <Toast.Content>
  (anchored)            →  + <Toast.Positioner> + <Toast.Arrow>
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

Popser adds: imperative API, built-in icons, CSS tokens, classNames, close button modes, mobile responsive, anchored toast configuration, shadcn integration, and the `data-popser-*` attribute system.

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
| `Toast.Positioner` | Floating UI anchor positioning for anchored toasts |
| `Toast.Arrow` | Arrow element pointing at anchor |
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
import { toast } from "@vcui/popser";

toast.success("Photo uploaded", {
  description: "12 photos added.",
  icon: <CheckIcon />,
});
```

### 2. Built-in Icons

Base UI renders no icons. You must provide everything.

Popser includes 5 inline SVGs (success, error, info, warning, close) + a CSS spinner (loading). Zero external dependencies. All use `currentColor` for theming.

Override chain: `toast.icon` > `Toaster.icons[type]` > built-in SVG > null.

### 3. Built-in CSS Tokens + Styles

Base UI ships zero CSS. You style from scratch.

Popser ships three opt-in CSS imports:

```ts
import "@vcui/popser/styles";      // Modular (7 files via @import)
import "@vcui/popser/styles/min";  // Flat, minified, single file
import "@vcui/popser/tokens";      // Just CSS custom properties
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
    arrow: "fill-popover",
  }}
/>
```

12 named slots. Applied globally. Per-toast `className` merges with global.

### 5. Close Button Component

Base UI provides a bare `<Toast.Close>` element. No icon, no visibility modes.

Popser wraps it into `<ToastCloseButton>` with:
- Built-in X icon (stroke SVG, 14x14)
- Three modes: `"always"` | `"hover"` | `"never"`
- Hover mode: hidden by default, visible on toast hover/focus
- Mobile: hover-mode buttons are always visible (no hover on touch)
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

### 7. Anchored Toast Configuration

Base UI provides `Toast.Positioner` and `Toast.Arrow` as raw components that need manual wiring.

Popser wraps this into a declarative `anchor` prop:

```ts
toast.success("Copied!", {
  anchor: buttonRef.current,  // Element, MouseEvent, or {x, y}
  anchorSide: "top",
  anchorAlign: "center",
  anchorOffset: 8,
  arrow: true,
  arrowPadding: 5,
  anchorCollisionBoundary: "clipping-ancestors",
  anchorCollisionPadding: 5,
  anchorPositionMethod: "absolute",
  anchorSticky: false,
});
```

For `MouseEvent` and `{x, y}` anchors, popser creates a temporary fixed-position element at those coordinates and cleans it up on toast close. Only one anchored toast is visible at a time.

### 8. Data Attributes System

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
| `data-popser-arrow` | Anchor arrow | When anchored + arrow |
| `data-popser-spinner` | Loading spinner | When loading |
| `data-popser-spinner-bar` | Spinner bar (x12) | When loading |
| `data-position` | Viewport | Yes |
| `data-theme` | Viewport | Yes |
| `data-rich-colors` | Viewport | When enabled |
| `data-expanded` | Viewport | When expanded |
| `data-mobile` | Viewport | When below mobileBreakpoint |
| `data-close-button` | Close button | Yes (mode value) |
| `data-anchored` | Toast root | When anchored |

### 9. Mobile Responsive

Base UI provides no mobile handling.

Popser detects mobile via JS `window.matchMedia` and sets a `data-mobile` attribute on the viewport:
- `mobileBreakpoint` prop (default: 600px) drives `matchMedia` listener
- `mobileOffset` prop for separate mobile offset
- `data-mobile` attribute enables mobile CSS: full-width toasts, bottom positioning, always-visible close buttons
- Toast width: `calc(100vw - 2 * var(--popser-offset, 16px))`

### 10. Hover-to-Expand with Debounce

Base UI provides `data-expanded` attribute but relies on CSS `:hover` or manual state.

Popser implements JS-driven expansion in `<ToasterContent>`:
- `isHovering` React state with `handleMouseEnter`/`handleMouseLeave` callbacks
- 100ms debounce timeout on `mouseLeave` to prevent flicker when moving between toasts
- Mouse handlers attached to individual `<Toast.Root>` elements
- `isExpanded = expand || isHovering` drives `data-expanded` on viewport

### 11. Collapsed Stacking CSS

Base UI provides `--toast-index` and `--toast-frontmost-height` but no default stacking styles.

Popser implements a full collapsed card stack:
- Toasts are `position: absolute`, anchored to the bottom (or top) of the viewport
- `z-index: calc(100 - var(--toast-index, 0))` for front-to-back layering
- `height: var(--toast-frontmost-height, auto)` + `overflow: hidden` for uniform card height
- `transform: translateY(-index * gap) scale(1 - index * 0.05)` for peek + shrink effect
- Content of non-front toasts hidden with `opacity: 0`
- Expanded state: viewport switches to `display: flex` + `column-reverse` with `overflow-y: auto`

### 12. shadcn Registry

Base UI has no registry integration.

Popser ships as `npx shadcn add @vcode-sh/popser`:
- Pre-configured wrapper with `next-themes` integration
- CSS variable bridge to shadcn design tokens
- Drop-in replacement for shadcn's sonner component

### 13. Rich Colors

Base UI sets `data-type` but ships no color system.

Popser ships full rich color tokens for all 5 types (success, error, info, warning, loading) in both light and dark themes. Enabled via `richColors` prop. OKLCH color space.

---

## Base UI Issues We Address

| # | Issue | Status | Popser Solution |
|---|---|---|---|
| #2809 | `Toast.Description` doesn't render with `render` prop | Open | We use standard `children`, not `render` prop for Description |
| #3335 | `actionProps` is config-object, not ReactNode | Open | Wrapped in `{ label, onClick }` object, rendered as `<Toast.Action>` children |
| #3437 | Type augmentation needed for custom types | Open | `type?: PopserType \| (string & {})` allows any string while providing autocomplete |
| #3952 | Module augmentation for type extension | Open | Same solution -- union type with string escape hatch |
| #3979 | Close all toasts | Open | `toast.close()` without args iterates `activeToasts` Set |
| #3026 | Anchor toast to an element | **Shipped** | Implemented via `anchor` prop with full positioning options |

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
| #3096 | Anchored toast support (`Toast.Positioner`) | Foundation for anchored toasts |
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
| `<PopserToastRoot>` | Root, Content, Positioner, Arrow | classNames merging, data-popser attributes, anchor configuration, mouse handler passthrough |
| `<ToastIcon>` | None | 5 SVGs, spinner, icon override chain |
| `<ToastActions>` | Action, Close | `{ label, onClick }` API, cancel auto-dismisses |
| `<ToastCloseButton>` | Close | 3 visibility modes, built-in icon, aria-label |
| `useToaster()` | `useToastManager()` | Thin re-export |
| `getManager()` / `resetManager()` / `clearManager()` | `createToastManager()` | Singleton lifecycle (lazy init, reset, clear for tests) |

---

## What Base UI Provides That We Don't Expose

| Feature | Base UI | Popser Status |
|---|---|---|
| `render` prop | Custom element rendering | Not exposed (use `toast.custom()` instead) |
| `data-limited` | Alternate exit animation | CSS available, not styled yet |
| `data-swipe-direction` on exit | Direction-specific exit | CSS available, not styled yet |

---

## Popser Pros (vs Raw Base UI)

1. **Zero assembly** -- import, render `<Toaster>`, call `toast()`. Done.
2. **Imperative API** -- works outside React components, event handlers, async code
3. **Built-in icons** -- 5 SVGs + spinner, zero deps, full override
4. **Built-in CSS** -- OKLCH tokens, light/dark, rich colors, responsive, animations
5. **Sonner-compatible DX** -- familiar API for millions of developers
6. **classNames system** -- 12 named slots, cascading from Toaster
7. **Close button modes** -- 3 modes with mobile awareness
8. **Stable selectors** -- `data-popser-*` on every element
9. **shadcn registry** -- one-command install
10. **Mobile responsive** -- built-in, configurable breakpoint
11. **Rich colors** -- type-specific color tokens, opt-in
12. **Anchored toasts** -- declarative anchor prop wrapping Positioner + Arrow

## Popser Cons (vs Raw Base UI)

1. **Opinionated DOM structure** -- fixed layout (icon + text + close in header, actions below)
2. **Less flexible rendering** -- no `render` prop access (use `toast.custom()` for full control)
3. **String IDs only** -- Base UI constraint passed through
4. **Single manager** -- one toast stack, not multiple
5. **Fixed component hierarchy** -- can't rearrange toast internals
6. **Additional abstraction layer** -- thin but present

---

## When to Use Base UI Toast Directly

- You need fully custom toast rendering (no default structure)
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
- You want anchored toasts with a simple API

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
│  │                      ├── Toast.Positioner │       │
│  │                      │     └── Toast.Arrow│       │
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
│  │  toast-icon.tsx    (5 SVGs + spinner)     │       │
│  │  toast-close.tsx   (3 modes)              │       │
│  │  toast-action.tsx  ({ label, onClick })   │       │
│  │  toast-root.tsx    (assembly + classNames) │       │
│  │  anchor-resolver   (Element/Event/{x,y})  │       │
│  │  styles/           (OKLCH tokens + CSS)   │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```
