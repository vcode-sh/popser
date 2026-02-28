# Toast API

Imperative API for creating and managing toasts. Import `toast` from `@vcui/popser` and call it anywhere — inside components, event handlers, server actions, wherever. No hooks required.

Every method returns the toast ID as a `string`. Use it for updates, close, and tracking.

```ts
import { toast } from "@vcui/popser";
```

## Methods

### `toast(title, options?)`

Create a default toast.

```ts
toast("Hello world");
toast("With description", { description: "More detail here" });
```

### `toast.success(title, options?)`

```ts
toast.success("Saved");
```

### `toast.error(title, options?)`

```ts
toast.error("Something broke");
```

### `toast.info(title, options?)`

```ts
toast.info("Heads up");
```

### `toast.warning(title, options?)`

```ts
toast.warning("Careful");
```

### `toast.loading(title, options?)`

Creates a persistent toast (no auto-dismiss). Stays until you close or update it.

```ts
const id = toast.loading("Uploading...");
// later
toast.close(id);
```

### `toast.message(title, options?)`

Explicit "default" type. Same as `toast()`. Exists for Sonner compatibility.

### `toast.custom(jsx, options?)`

Render arbitrary JSX. Bypasses the default toast structure entirely.

```ts
toast.custom((id) => (
  <div className="my-toast">
    <p>Custom content</p>
    <button onClick={() => toast.close(id)}>Close</button>
  </div>
));
```

The render function receives the toast `id` as its only argument. You're responsible for layout and close behavior.

Custom toasts render with `data-type="custom"` on the root. See [custom.md](custom.md) for details.

### `toast.promise(promiseOrFn, options)`

Supports `signal`, `aborted`, and `onAbort` for AbortSignal integration. See [promise.md](promise.md) for the full guide.

### `toast.update(id, options)`

Update an existing toast in-place. Any option can be changed.

```ts
const id = toast.loading("Uploading...");
toast.update(id, {
  title: "Upload complete",
  description: "file.pdf",
  type: "success",
  timeout: 3000,
});
```

### `toast.close(id?)`

Close a specific toast or all toasts.

```ts
toast.close("my-id");  // close one
toast.close();         // close all
```

### `toast.dismiss(id?)`

Alias for `toast.close()`. Sonner compatibility.

### `toast.getToasts()`

Returns an array of active toast IDs.

```ts
const ids = toast.getToasts(); // ["abc", "def"]
```

### `toast.getHistory()`

Returns a readonly array of all toast history entries. Requires `historyLength` on `<Toaster>` to be set (disabled by default).

```ts
const history = toast.getHistory();
// [{ id: "abc", title: "Saved", type: "success", createdAt: 1709..., closedAt: 1709..., closedBy: "auto" }]
```

Each entry is a `ToastHistoryEntry`:

```ts
{
  id: string;
  title: string;
  type?: PopserType;
  createdAt: number;
  closedAt?: number;
  closedBy?: "auto" | "manual" | "limit";
}
```

### `toast.clearHistory()`

Clears all toast history entries.

```ts
toast.clearHistory();
```

## Options

All toast creation methods accept these options as a second argument.

```ts
toast.success("Saved", {
  description: "Your changes are live",
  timeout: 3000,
  icon: <CheckIcon />,
});
```

### Content

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `description` | `ReactNode` | — | Secondary text below the title |
| `icon` | `ReactNode \| false` | Auto per type | Custom icon, or `false` to hide |
| `type` | `PopserType` | Method-dependent | `"success"` \| `"error"` \| `"info"` \| `"warning"` \| `"loading"` |

### Behavior

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `string` | Auto-generated | Custom toast ID for updates and targeting |
| `timeout` | `number` | `4000` | Auto-dismiss in ms. `0` = persistent |
| `duration` | `number` | — | Alias for `timeout` (Sonner compatibility) |
| `deduplicate` | `boolean` | `false` | Block duplicate toasts with same string title |
| `dismissible` | `boolean` | `true` | Allow swipe/close button dismissal |
| `priority` | `"low" \| "high"` | — | ARIA live region priority |
| `enterFrom` | `"top" \| "bottom" \| "left" \| "right"` | Position-dependent | Override entry/exit animation direction |
| `closeButtonPosition` | `"header" \| "corner"` | Inherits from Toaster | Close button placement for this toast |
| `data` | `Record<string, unknown>` | — | Custom data attached to the toast |

### Actions

| Option | Type | Description |
|--------|------|-------------|
| `action` | `PopserAction \| ReactNode` | Primary action button |
| `cancel` | `PopserAction \| ReactNode` | Secondary cancel button (renders as close trigger) |

`PopserAction` shape:

```ts
{
  label: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

Both `action` and `cancel` accept either a `PopserAction` object or raw `ReactNode` for static display.

```ts
// Object form (clickable)
toast.success("File uploaded", {
  action: {
    label: "View",
    onClick: () => router.push("/files"),
  },
  cancel: {
    label: "Undo",
    onClick: () => undoUpload(),
  },
});

// ReactNode form (display only)
toast.info("Tip", { action: <span>Learn more →</span> });
```

### Anchoring

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `anchor` | `Element \| MouseEvent \| {x, y} \| null` | — | Anchor element or coordinates |
| `anchorSide` | `"top" \| "bottom" \| "left" \| "right" \| "inline-end" \| "inline-start"` | `"bottom"` | Which side of the anchor |
| `anchorAlign` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the anchor side |
| `anchorOffset` | `number` | `8` | Distance from anchor in px |
| `anchorAlignOffset` | `number` | `0` | Alignment offset in px |
| `anchorPositionMethod` | `"absolute" \| "fixed"` | `"absolute"` | CSS positioning method |
| `anchorSticky` | `boolean` | `false` | Stay visible when anchor scrolls |
| `anchorCollisionBoundary` | `"clipping-ancestors" \| Element \| Element[]` | `"clipping-ancestors"` | Collision boundary |
| `anchorCollisionPadding` | `number` | `5` | Collision padding in px |
| `arrow` | `boolean` | `false` | Show arrow pointing at anchor |
| `arrowPadding` | `number` | `5` | Arrow edge padding in px |

See [anchored.md](anchored.md) for the full guide.

### Styling (per-toast)

| Option | Type | Description |
|--------|------|-------------|
| `className` | `string` | Class name on the toast root |
| `classNames` | `Partial<PopserClassNames>` | Per-slot class names |
| `style` | `CSSProperties` | Inline styles on the toast root |
| `richColors` | `boolean` | Colored background for this toast |
| `unstyled` | `boolean` | Strip default styles for this toast |

### Callbacks

All callbacks receive the toast `id` as their argument.

| Callback | When it fires |
|----------|---------------|
| `onClose(id)` | Toast starts closing (always fires) |
| `onAutoClose(id)` | Toast was auto-dismissed by timeout |
| `onDismiss(id)` | Toast was manually dismissed (swipe, close button, `toast.close(id)`) |
| `onRemove()` | Toast removed from DOM after exit animation |

**Firing order:**

Manual dismiss: `onDismiss` → `onClose` → *(animation)* → `onRemove`

Auto dismiss: `onAutoClose` → `onClose` → *(animation)* → `onRemove`

## Deduplication

When `deduplicate: true`, popser tracks active toasts by their string title. If a toast with the same title is already visible, the duplicate call returns the existing toast's ID instead of creating a new one.

```ts
const id1 = toast.error("Connection lost", { deduplicate: true });
const id2 = toast.error("Connection lost", { deduplicate: true });
// id1 === id2, only one toast on screen
```

Once the original toast is dismissed, the title is released and a new toast can be created.

Only works with string titles. ReactNode titles are never deduplicated.

## TypeScript

All types are exported from `@vcui/popser`:

```ts
import type {
  PopserOptions,
  PopserUpdateOptions,
  PopserAction,
  PopserType,
  PopserPosition,
  PopserClassNames,
  PopserIcons,
  PopserSwipeDirection,
  PopserPromiseOptions,
  PopserPromiseExtendedResult,
  ToasterProps,
  ToastHistoryEntry,
} from "@vcui/popser";
```
