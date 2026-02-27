# popser

Toast notifications for React. Built on Base UI. Sonner-compatible API.
No `!important`. No memory leaks. No hardcoded breakpoints.

## Install

```bash
npm install @vcui/popser @base-ui/react
```

## Quick Start

```tsx
import { toast, Toaster } from "@vcui/popser";
import "@vcui/popser/styles";

function App() {
  return (
    <>
      <button onClick={() => toast.success("It works")}>Toast</button>
      <Toaster />
    </>
  );
}
```

That's it. No Provider wrapper. No theme configuration. It just works.

## API

### `toast()`

Imperative API for creating and managing toasts. Every method returns the toast ID.

```ts
toast("Hello world");
toast("With options", { description: "More detail here" });

toast.success("Saved");
toast.error("Something broke");
toast.info("Heads up");
toast.warning("Careful");
toast.loading("Working...");
```

#### Promise toasts

Automatically transitions through loading, success, and error states.

```ts
toast.promise(fetchData(), {
  loading: "Fetching data...",
  success: "Data loaded",
  error: "Failed to fetch",
});

// Dynamic messages based on the result
toast.promise(saveUser(data), {
  loading: "Saving...",
  success: (user) => `Saved ${user.name}`,
  error: (err) => `Failed: ${err.message}`,
});
```

#### Promise with JSX and conditional skip

Success and error handlers accept `ReactNode` — not just strings:

```ts
toast.promise(saveUser(data), {
  loading: "Saving...",
  success: (user) => <span>Saved <strong>{user.name}</strong></span>,
  error: (err) => `Failed: ${err.message}`,
});
```

Return `undefined` from a callback to dismiss the toast silently:

```ts
toast.promise(fetchData(), {
  loading: "Loading...",
  success: (data) => data.silent ? undefined : "Done!",
  error: (err) => err.name === "AbortError" ? undefined : `Error: ${err.message}`,
});
```

#### Close and update

```ts
const id = toast.loading("Uploading...");

// Update in-place
toast.update(id, { title: "Almost done...", description: "95%" });

// Close a specific toast
toast.close(id);

// Close all toasts
toast.close();
```

#### Deduplication

Prevent duplicate toasts with the same title:

```ts
toast.error("Connection lost", { deduplicate: true });
toast.error("Connection lost", { deduplicate: true }); // no-op, returns existing ID
```

Once the first toast is dismissed, the same title can create a new one.

#### `PopserOptions`

```ts
{
  id?: string;                  // Custom ID (deduplication, updates)
  deduplicate?: boolean;          // Prevent duplicate toasts with same title
  description?: ReactNode;      // Secondary text below the title
  timeout?: number;             // Auto-dismiss in ms. 0 = persistent
  priority?: "low" | "high";   // ARIA live region priority
  icon?: ReactNode | false;    // Custom icon, or false to hide
  action?: {                   // Action button
    label: ReactNode;
    onClick?: (e: MouseEvent) => void;
  };
  cancel?: {                   // Cancel button (renders as Toast.Close)
    label: ReactNode;
    onClick?: (e: MouseEvent) => void;
  };
  onClose?: () => void;        // Called when toast starts closing
  onRemove?: () => void;       // Called when toast is removed from DOM
  className?: string;
  style?: CSSProperties;
  data?: Record<string, unknown>;
}
```

### `<Toaster>`

Drop it anywhere in your tree. One instance is all you need.

```tsx
<Toaster
  position="bottom-right"
  limit={3}
  timeout={5000}
  closeButton="hover"
  richColors
  theme="system"
/>
```

#### `ToasterProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"top-left"` \| `"top-center"` \| `"top-right"` \| `"bottom-left"` \| `"bottom-center"` \| `"bottom-right"` | `"bottom-right"` | Where toasts appear |
| `limit` | `number` | `3` | Max visible toasts |
| `timeout` | `number` | `5000` | Auto-dismiss in ms |
| `closeButton` | `"always"` \| `"hover"` \| `"never"` | `"hover"` | Close button visibility |
| `expand` | `boolean` | `false` | Expand stacked toasts |
| `richColors` | `boolean` | `false` | Colored backgrounds per toast type |
| `theme` | `"light"` \| `"dark"` \| `"system"` | `"system"` | Color scheme |
| `offset` | `number \| string` | `16` | Distance from viewport edge |
| `gap` | `number` | `8` | Space between toasts |
| `mobileBreakpoint` | `number` | `600` | Width (px) for mobile layout |
| `swipeDirection` | `SwipeDirection \| SwipeDirection[]` | `["down", "right"]` | Swipe-to-dismiss direction(s) |
| `icons` | `PopserIcons` | Built-in SVGs | Override icons per toast type |
| `classNames` | `PopserClassNames` | -- | Class names for every slot |
| `style` | `CSSProperties` | -- | Inline styles on the viewport |
| `unstyled` | `boolean` | `false` | Strip all default styles |

#### `PopserClassNames`

Target every part of the toast:

```ts
{
  viewport?: string;
  root?: string;
  content?: string;
  header?: string;
  title?: string;
  description?: string;
  icon?: string;
  actions?: string;
  actionButton?: string;
  cancelButton?: string;
  closeButton?: string;
}
```

### `useToaster()`

React hook that returns the Base UI toast manager context. Use it when you need direct access to the toast list or manager methods inside a component.

```tsx
import { useToaster } from "@vcui/popser";

function ToastCount() {
  const { toasts } = useToaster();
  return <span>{toasts.length} active</span>;
}
```

Must be rendered inside a `<Toaster>` (which provides the Base UI `Toast.Provider`).

## Styling

### Default styles

Import the built-in stylesheet for a working setup out of the box:

```ts
import "@vcui/popser/styles";
```

This includes layout, animations, and light/dark token defaults. You can also import tokens separately:

```ts
import "@vcui/popser/tokens";
```

### CSS custom properties

All visual tokens use `--popser-*` custom properties. Override them to match your design system:

```css
:root {
  --popser-bg: #fff;
  --popser-fg: hsl(0 0% 9%);
  --popser-border: hsl(0 0% 90%);
  --popser-radius: 8px;
  --popser-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --popser-offset: 16px;
  --popser-gap: 8px;
}
```

Rich color tokens follow the pattern `--popser-{type}-bg`, `--popser-{type}-border`, `--popser-{type}-fg` for each toast type (success, error, info, warning, loading).

### Dark mode

Dark tokens activate automatically via `[data-theme="dark"]` or `.dark` on any ancestor. Or set `theme="dark"` on `<Toaster>`:

```tsx
<Toaster theme="dark" />
```

### Tailwind / classNames

Pass class names to any slot. Works with Tailwind, CSS modules, or any class-based system:

```tsx
<Toaster
  classNames={{
    root: "rounded-lg border shadow-lg",
    title: "font-semibold text-sm",
    description: "text-muted-foreground text-xs",
    actionButton: "bg-primary text-primary-foreground",
  }}
/>
```

Per-toast class names work too:

```ts
toast.success("Saved", { className: "border-green-500" });
```

### Unstyled mode

Strip all default styles and build from scratch:

```tsx
<Toaster unstyled />
```

Every element exposes `data-popser-*` attributes for targeting:

```css
[data-popser-viewport] { /* viewport */ }
[data-popser-root] { /* individual toast */ }
[data-popser-root][data-popser-id="my-id"] { /* target by toast ID */ }
[data-popser-content] { /* content wrapper */ }
[data-popser-actions] { /* action bar */ }
[data-popser-close] { /* close button */ }
```

### Rich colors

Opt in to colored backgrounds that match the toast type:

```tsx
<Toaster richColors />
```

Success toasts get green backgrounds, errors get red, and so on. All driven by CSS custom properties, so you can override any color.

## shadcn

Add popser to your shadcn project via the registry:

```bash
npx shadcn add @vcode-sh/popser
```

## Why popser?

Built on [Base UI](https://base-ui.com) Toast primitives instead of rolling custom DOM.

- **No `!important` overrides.** Base UI renders headless primitives. Your styles always win.
- **No memory leaks.** Singleton toast manager with proper cleanup. Toasts are tracked and removed.
- **No hardcoded breakpoints.** Mobile breakpoint is a prop. Responsive behavior is CSS-driven.
- **E2E test friendly.** Every toast renders `data-popser-id` in the DOM. Select by ID in Playwright or Cypress.
- **Accessible by default.** ARIA live regions with configurable priority. F6 keyboard navigation to the toast viewport.
- **Sonner-compatible API.** Same `toast.success()` / `toast.error()` / `toast.promise()` interface. Drop-in replacement.
- **Tiny footprint.** Zero icon dependencies. Five inline SVGs and a CSS spinner.

## License

MIT
