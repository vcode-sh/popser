# Anchored Toasts (Toast.Positioner) — Implementation Plan

> Feature for Popser v0.3. Allows toasts to be positioned relative to a DOM element.

---

## Key Discovery

Base UI already supports anchored toasts as a **first-class feature**:

1. `positionerProps` is a native field on `ToastObject` (passed via `manager.add()`)
2. `Toast.Root` auto-disables swipe when `toast.positionerProps?.anchor` is set (line 91-95 in ToastRoot.js)
3. `Toast.Positioner` wraps toast content inside `Toast.Root` for Floating UI positioning
4. `Toast.Arrow` reads from `ToastPositionerContext` (must be child of Positioner)

This means implementation is primarily **plumbing** — piping user options through to Base UI.

---

## API Design

### User-facing API

```typescript
// Basic anchored toast
toast("Copied!", { anchor: buttonRef.current });

// With positioning options
toast.success("Saved", {
  anchor: buttonRef.current,
  anchorSide: "bottom",
  anchorAlign: "center",
  anchorOffset: 8,
});

// With arrow
toast("Field required", {
  anchor: inputRef.current,
  anchorSide: "bottom",
  anchorAlign: "start",
  anchorOffset: 4,
  arrow: true,
});

// All typed variants work
toast.error("Invalid", { anchor: el });
toast.warning("Caution", { anchor: el, anchorSide: "top" });
toast.custom((id) => <MyToast />, { anchor: el });
```

### New Options on `PopserOptions`

```typescript
/** Element to position the toast against. When set, toast is anchored. */
anchor?: Element | null;
/** Which side of the anchor to place the toast. @default "bottom" */
anchorSide?: "top" | "bottom" | "left" | "right" | "inline-end" | "inline-start";
/** Alignment along the anchor edge. @default "center" */
anchorAlign?: "start" | "center" | "end";
/** Distance from anchor in pixels. @default 8 */
anchorOffset?: number;
/** Alignment axis offset in pixels. @default 0 */
anchorAlignOffset?: number;
/** Whether to show an arrow pointing at the anchor. @default false */
arrow?: boolean;
/** Padding around arrow from toast edges. @default 5 */
arrowPadding?: number;
/** CSS position method. @default "absolute" */
anchorPositionMethod?: "absolute" | "fixed";
/** Keep toast visible when anchor scrolls out of view. @default false */
anchorSticky?: boolean;
/** Collision boundary for auto-flip. @default "clipping-ancestors" */
anchorCollisionBoundary?: "clipping-ancestors" | Element | Element[];
/** Padding from collision boundary. @default 5 */
anchorCollisionPadding?: number;
```

---

## Implementation Steps

### 1. types.ts — Add anchor options

Add to `PopserOptions`:
- All anchor-related fields listed above
- Keep them optional with sensible defaults

Add to `PopserInternalData`:
- `arrow?: boolean` — stored in `__popser` namespace for rendering

No new interfaces needed — Base UI's `ToastManagerPositionerProps` handles the rest.

### 2. toast-mapper.ts — Map options to positionerProps

In `toManagerOptions()`:
- Destructure new anchor options from `PopserOptions`
- When `anchor` is set, construct `positionerProps` object:
  ```typescript
  const positionerProps = anchor ? {
    anchor,
    side: anchorSide ?? "bottom",
    sideOffset: anchorOffset ?? 8,
    align: anchorAlign ?? "center",
    alignOffset: anchorAlignOffset ?? 0,
    positionMethod: anchorPositionMethod,
    sticky: anchorSticky,
    collisionBoundary: anchorCollisionBoundary,
    collisionPadding: anchorCollisionPadding,
    arrowPadding,
  } : undefined;
  ```
- Add `positionerProps` to the returned manager options object
- Store `arrow` in `__popser` namespace

In `toManagerUpdateOptions()`:
- Same pattern for update path (anchor options can be updated)

### 3. toast-root.tsx — Conditional Positioner rendering

Detect anchored toast: `const isAnchored = !!toastData.positionerProps?.anchor;`

When anchored, wrap content with `Toast.Positioner`:

```tsx
// Inside PopserToastRoot, after the existing Toast.Root
<Toast.Root ...>
  {isAnchored ? (
    <Toast.Positioner toast={toastData} {...toastData.positionerProps}>
      {popser.arrow && <Toast.Arrow className={mergedClassNames?.arrow} data-popser-arrow />}
      <Toast.Content ...>
        {/* existing content structure */}
      </Toast.Content>
    </Toast.Positioner>
  ) : (
    <Toast.Content ...>
      {/* existing content structure */}
    </Toast.Content>
  )}
</Toast.Root>
```

Key: Extract the content rendering into a variable to avoid duplication:

```tsx
const toastContent = (
  <Toast.Content className={mergedClassNames?.content} data-popser-content>
    {/* header, icon, title, description, close button, actions */}
  </Toast.Content>
);

// Then in return:
<Toast.Root ... data-anchored={isAnchored || undefined}>
  {isAnchored ? (
    <Toast.Positioner toast={toastData}>
      {popser.arrow && <Toast.Arrow data-popser-arrow />}
      {toastContent}
    </Toast.Positioner>
  ) : (
    toastContent
  )}
</Toast.Root>
```

Same pattern for custom JSX toasts — wrap `popser.jsx(toastData.id)` in Positioner when anchored.

### 4. types.ts — Add arrow classNames slot

Add `arrow?: string` to `PopserClassNames` interface.
Update `mergeClassNames()` slots array to include `"arrow"`.

### 5. CSS — Anchored toast styles

Add to `src/styles/popser.css`:

```css
/* Anchored toasts — skip viewport stacking transforms */
[data-popser-root][data-anchored] {
  /* Let Positioner handle positioning */
}

/* Arrow styling */
[data-popser-arrow] {
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  background: var(--popser-bg, oklch(1 0 0));
}

[data-popser-viewport][data-theme="dark"] [data-popser-arrow] {
  background: var(--popser-bg, oklch(0.269 0 0));
}
```

### 6. No changes needed to

- `toast.ts` — `createToast()` passes all options to `toManagerOptions()`, so anchor options flow through automatically
- `manager.ts` — Singleton wrapper, no changes
- `toaster.tsx` — `Toast.Root` handles anchored detection internally

---

## Backward Compatibility

| Concern | Status |
|---------|--------|
| Existing toasts without `anchor` | Unchanged — `positionerProps` is `undefined`, no Positioner rendered |
| Swipe behavior | Auto-disabled by Base UI when anchored — no code needed |
| ClassNames merging | Existing slots unaffected, `arrow` slot is additive |
| Custom toasts (`toast.custom()`) | Work with anchor — Positioner wraps the JSX |
| Promise toasts | Work with anchor — positionerProps persists through state transitions |
| Deduplication | Works — dedup is title-based, independent of positioning |
| `dismissible: false` | Still works — Popser's close button logic is independent |
| `unstyled` mode | Works — `data-unstyled` still applied, Positioner styling is separate |

---

## Test Plan

### Unit tests (toast-mapper.ts)
1. `toManagerOptions()` returns `positionerProps` when `anchor` is set
2. `positionerProps` is `undefined` when no `anchor`
3. Default values: side="bottom", sideOffset=8, align="center"
4. All positioning options pass through correctly
5. `arrow: true` stored in `__popser.arrow`
6. `toManagerUpdateOptions()` handles anchor options

### Integration tests (toast-root rendering)
7. Anchored toast renders `Toast.Positioner` in DOM
8. Non-anchored toast does NOT render Positioner
9. `data-anchored` attribute present on anchored toast root
10. `data-popser-arrow` rendered when `arrow: true`
11. Arrow NOT rendered when `arrow: false` or unset
12. Anchored custom toast wraps JSX in Positioner
13. ClassNames merge includes arrow slot
14. Anchored toast with `richColors` and `unstyled` options

### Edge cases
15. `anchor: null` — treated as non-anchored (no Positioner)
16. Anchored + `dismissible: false` — close button hidden, no swipe
17. Multiple anchored toasts to same element
18. Anchored toast with promise state transitions
19. `toast.update()` with anchor options

### Not tested (Base UI responsibility)
- Floating UI position calculations
- Collision avoidance behavior
- Anchor tracking / resize
- Swipe auto-disable for anchored toasts

---

## File Change Summary

| File | Changes |
|------|---------|
| `src/types.ts` | Add anchor options to `PopserOptions`, `arrow` to `PopserInternalData`, `arrow` slot to `PopserClassNames` |
| `src/toast-mapper.ts` | Map anchor options → `positionerProps`, store `arrow` in `__popser` |
| `src/toast-root.tsx` | Conditional `Toast.Positioner` + `Toast.Arrow` wrapping, extract content variable |
| `src/styles/popser.css` | Arrow base styles, anchored toast CSS |
| New: `src/toast-positioner.test.tsx` | ~20 test cases for anchored toasts |

**Estimated:** ~120 lines source + ~200 lines tests
