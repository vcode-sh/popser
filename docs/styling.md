# Styling

popser ships with default styles that work out of the box. Import them, override what you want, or throw them away entirely. No `!important` anywhere.

## Default Styles

```ts
import "@vcui/popser/styles";
```

This includes layout, animations, light/dark tokens, and the spinner. One import, done.

If you only want the color tokens without layout:

```ts
import "@vcui/popser/tokens";
```

## CSS Custom Properties

All visual tokens use `--popser-*` custom properties. Override them anywhere — `:root`, a wrapper div, inline styles, whatever your system uses.

### Core Tokens

```css
:root {
  --popser-bg: oklch(1 0 0);              /* Toast background */
  --popser-fg: oklch(0.145 0 0);          /* Text color */
  --popser-border: oklch(0.922 0 0);      /* Border color */
  --popser-radius: 8px;                    /* Border radius */
  --popser-shadow: 0 4px 12px oklch(0 0 0 / 0.1);  /* Box shadow */
  --popser-offset: 16px;                   /* Distance from viewport edge */
  --popser-gap: 8px;                       /* Space between expanded toasts */
  --popser-width: 356px;                   /* Toast width */
  --popser-stack-peek: 14px;               /* Peek distance in collapsed stack */
  --popser-hover-bg: oklch(0 0 0 / 0.05); /* Button hover background */
}
```

### Dark Mode Tokens

Dark tokens activate automatically via `[data-theme="dark"]` or `.dark` on any ancestor:

```css
[data-theme="dark"],
.dark {
  --popser-bg: oklch(0.205 0 0);
  --popser-fg: oklch(0.96 0 0);
  --popser-border: oklch(0.3 0 0);
  --popser-shadow: 0 4px 12px oklch(0 0 0 / 0.4);
  --popser-hover-bg: oklch(1 0 0 / 0.1);
}
```

Or set the theme on the Toaster:

```tsx
<Toaster theme="dark" />
```

### Rich Color Tokens

When `richColors` is enabled, each toast type gets its own background, border, and text color:

```css
/* Light mode */
--popser-success-bg     --popser-success-border     --popser-success-fg
--popser-error-bg       --popser-error-border       --popser-error-fg
--popser-info-bg        --popser-info-border        --popser-info-fg
--popser-warning-bg     --popser-warning-border     --popser-warning-fg
--popser-loading-bg     --popser-loading-border     --popser-loading-fg
```

Override any of them to match your design system.

## ClassNames

Target every part of the toast. Works with Tailwind, CSS modules, or any class-based system.

### Global (Toaster level)

```tsx
<Toaster
  classNames={{
    viewport: "...",
    root: "...",
    content: "...",
    header: "...",
    title: "...",
    description: "...",
    icon: "...",
    actions: "...",
    actionButton: "...",
    cancelButton: "...",
    closeButton: "...",
    arrow: "...",
  }}
/>
```

### Per-toast

```ts
toast.success("Saved", {
  className: "border-green-500",
  classNames: {
    title: "font-bold",
    description: "text-sm",
  },
});
```

### Merge order

Class names merge across three levels. Nothing gets replaced:

1. Toaster `classNames`
2. Toaster `toastOptions.classNames`
3. Per-toast `classNames` / `className`

Result: all three concatenated with spaces.

## Tailwind

Tailwind works out of the box via `classNames`:

```tsx
<Toaster
  classNames={{
    root: "rounded-lg border shadow-lg",
    title: "font-semibold text-sm",
    description: "text-muted-foreground text-xs",
    actionButton: "bg-primary text-primary-foreground",
    cancelButton: "border border-input",
  }}
/>
```

Per-toast Tailwind:

```ts
toast.success("Saved", { className: "border-green-500" });
```

## Unstyled Mode

Strip all default styles and start from zero:

```tsx
<Toaster unstyled />
```

Or per-toast:

```ts
toast("Raw", { unstyled: true });
```

In unstyled mode, use `data-popser-*` attributes to target elements in your CSS:

```css
[data-popser-viewport] { /* viewport container */ }
[data-popser-root] { /* individual toast */ }
[data-popser-content] { /* content wrapper */ }
[data-popser-header] { /* header row */ }
[data-popser-title] { /* title text */ }
[data-popser-description] { /* description text */ }
[data-popser-icon] { /* icon wrapper */ }
[data-popser-actions] { /* action bar */ }
[data-popser-action] { /* action button */ }
[data-popser-cancel] { /* cancel button */ }
[data-popser-close] { /* close button */ }
[data-popser-arrow] { /* anchor arrow */ }
```

## Data Attributes for Conditional Styling

### Viewport

```css
[data-popser-viewport] { }
[data-popser-viewport][data-position="top-center"] { }
[data-popser-viewport][data-theme="dark"] { }
[data-popser-viewport][data-rich-colors] { }
[data-popser-viewport][data-expanded] { }
[data-popser-viewport][data-mobile] { }
```

### Toast Root

```css
[data-popser-root] { }
[data-popser-root][data-type="success"] { }
[data-popser-root][data-type="error"] { }
[data-popser-root][data-type="custom"] { }
[data-popser-root][data-rich-colors] { }
[data-popser-root][data-unstyled] { }
[data-popser-root][data-anchored] { }
[data-popser-root][data-popser-id="my-id"] { }
```

### Close Button

```css
[data-popser-close][data-close-button="hover"] { }
[data-popser-close][data-close-button="always"] { }
```

### Arrow

```css
[data-popser-arrow][data-side="top"] { }
[data-popser-arrow][data-side="bottom"] { }
```

## Animations

Default styles include enter/exit animations:

- **Enter:** Fade in + scale from 0.95 + slide from edge
- **Exit:** Fade out + slide toward edge
- **Swipe:** Slide in swipe direction
- **Reduced motion:** Animations disabled via `prefers-reduced-motion: reduce`

Entry/exit direction depends on position:
- Bottom positions: slide up on enter, slide down on exit
- Top positions: slide down on enter, slide up on exit

Uses `data-starting-style` and `data-ending-style` attributes from Base UI for CSS-only transitions.

## CSS Variables Set at Runtime

These are computed by popser and available for your CSS:

```css
--toast-index              /* 0 = newest, 1 = next, etc. */
--toast-offset-y           /* Cumulative height offset (px) */
--toast-height             /* Measured height of this toast (px) */
--toast-frontmost-height   /* Height of the front toast (px) */
--popser-visible-count     /* Number of visible toasts */
```
