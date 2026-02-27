# Toaster Component

The `<Toaster>` component renders the toast viewport. Drop it once in your app. Anywhere in the tree is fine — it portals to `document.body`.

```tsx
import { Toaster } from "@vcui/popser";

function App() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  );
}
```

No Provider wrapper needed. The Toaster handles Provider, Portal, and Viewport internally.

## Props

### Layout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `PopserPosition` | `"bottom-right"` | Where toasts appear |
| `limit` | `number` | `3` | Max visible toasts at once |
| `offset` | `number \| string` | `16` | Distance from viewport edge (px or CSS value) |
| `mobileOffset` | `number \| string` | Falls back to `offset` | Distance from edge on mobile |
| `gap` | `number` | `8` | Space between toasts when expanded (px) |
| `mobileBreakpoint` | `number` | `600` | Width in px that triggers mobile layout |
| `expand` | `boolean` | `false` | Always show toasts in expanded column |

### Behavior

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `timeout` | `number` | `4000` | Global auto-dismiss in ms |
| `closeButton` | `"always" \| "hover" \| "never"` | `"hover"` | Close button visibility mode |
| `swipeDirection` | `SwipeDirection \| SwipeDirection[]` | `["down", "right"]` | Swipe-to-dismiss direction(s) |

### Appearance

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `"light" \| "dark" \| "system"` | `"system"` | Color scheme |
| `richColors` | `boolean` | `false` | Colored backgrounds per toast type |
| `unstyled` | `boolean` | `false` | Strip all default styles |
| `icons` | `PopserIcons` | Built-in SVGs | Override icons per type |
| `classNames` | `PopserClassNames` | — | Class names for every slot |
| `style` | `CSSProperties` | — | Inline styles on the viewport |

### Advanced

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toastOptions` | `Partial<PopserOptions>` | — | Default options applied to every toast |
| `ariaLabel` | `string` | — | Custom ARIA label for the viewport |

## Positions

Six positions. Pick one.

```
top-left       top-center       top-right

bottom-left    bottom-center    bottom-right
```

```tsx
<Toaster position="top-center" />
```

## Theme

`"system"` (default) detects via `prefers-color-scheme` media query. Or lock it:

```tsx
<Toaster theme="dark" />
```

Theme is applied as `data-theme="light"` or `data-theme="dark"` on the viewport element. If you're using `next-themes` or any system that sets `.dark` on an ancestor, popser picks that up automatically via CSS.

## Mobile Layout

Below the `mobileBreakpoint` (default 600px), toasts switch to:

- Full viewport width
- Close button always visible
- Offset from `mobileOffset` (falls back to `offset`)
- `data-mobile` attribute on the viewport

No hardcoded media queries in your code. Just a prop.

```tsx
<Toaster mobileBreakpoint={768} mobileOffset="24px" />
```

## Stack Behavior

By default, toasts collapse into a stack with a peek effect. Hover to expand. Set `expand` to always show the full list:

```tsx
<Toaster expand />
```

Stack state is exposed via `data-expanded` on the viewport. The collapse has a 100ms debounce on mouse leave to prevent flicker.

## Close Button Modes

```tsx
<Toaster closeButton="always" />   {/* Always visible */}
<Toaster closeButton="hover" />    {/* Shown on toast hover (default) */}
<Toaster closeButton="never" />    {/* No close button */}
```

## Custom Icons

Override any or all icons globally:

```tsx
<Toaster
  icons={{
    success: <MyCheckIcon />,
    error: <MyXIcon />,
    info: <MyInfoIcon />,
    warning: <MyAlertIcon />,
    loading: <MySpinner />,
    close: <MyCloseIcon />,
  }}
/>
```

Built-in icons are inline SVGs with `currentColor` — they inherit your text color automatically.

## Default Toast Options

Apply options to every toast via `toastOptions`:

```tsx
<Toaster
  toastOptions={{
    timeout: 8000,
    richColors: true,
    classNames: {
      root: "my-toast",
      title: "my-toast-title",
    },
  }}
/>
```

Per-toast options override `toastOptions`. Per-toast overrides Toaster. Always.

## ClassNames

Target every slot globally:

```tsx
<Toaster
  classNames={{
    viewport: "my-viewport",
    root: "my-toast",
    content: "my-content",
    header: "my-header",
    title: "my-title",
    description: "my-description",
    icon: "my-icon",
    actions: "my-actions",
    actionButton: "my-action",
    cancelButton: "my-cancel",
    closeButton: "my-close",
    arrow: "my-arrow",
  }}
/>
```

Class names are merged across three levels:
1. Toaster `classNames`
2. `toastOptions.classNames`
3. Per-toast `classNames`

All three concatenate. Nothing gets replaced.

## Swipe Direction

Control which directions dismiss a toast:

```tsx
<Toaster swipeDirection="right" />
<Toaster swipeDirection={["down", "left"]} />
```

Options: `"up"`, `"down"`, `"left"`, `"right"`. Accepts a single direction or an array.

## Error Boundary

The Toaster includes a built-in error boundary. If one toast throws during render, the rest keep working. Errors are logged to console. Your app doesn't crash because someone passed a bad icon.
