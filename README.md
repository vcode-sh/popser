# popser

[![npm version](https://img.shields.io/npm/v/@vcui/popser)](https://www.npmjs.com/package/@vcui/popser)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6)](https://www.typescriptlang.org/)

Toast notifications for React. Built on [Base UI](https://base-ui.com) Toast primitives — headless components done right. Sonner-compatible API. **8.3 KB gzipped total.** No `!important`. No memory leaks. Your styles actually win for once.

**[Documentation](https://popser.vcui.dev/docs)** · **[Why I built this](https://popser.vcui.dev/why)** · **[Why Base UI](https://popser.vcui.dev/why-base-ui)** · **[Changelog](https://popser.vcui.dev/docs/changelog)**

## Install

```bash
npm install @vcui/popser @base-ui/react
```

Peer deps: `react` (18 or 19), `react-dom`, `@base-ui/react` (^1.2.0). You probably have the first two already.

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

No Provider wrapper. No theme config. No 47-step Medium article. It just works.

## Toast API

Every method returns the toast ID. Use it to update, close, or track toasts.

```ts
toast("Hello world");
toast.success("Saved");
toast.error("Something broke");
toast.info("Heads up");
toast.warning("Careful");
toast.loading("Working...");
```

### Promise toasts

Transitions through loading → success → error automatically.

```ts
toast.promise(fetchData(), {
  loading: "Fetching...",
  success: (data) => `Loaded ${data.count} items`,
  error: (err) => `Failed: ${err.message}`,
});
```

Return `undefined` from a handler to dismiss silently. Return JSX if you're feeling fancy. Full details in **[docs/api.md](docs/api.md)**.

### Update and close

```ts
const id = toast.loading("Uploading...");
toast.update(id, { title: "Almost done...", description: "95%" });
toast.close(id);   // close one
toast.close();     // close all
```

### Custom toasts

Skip the default layout entirely. Render whatever you want.

```ts
toast.custom((id) => (
  <div>
    Your markup. Your rules.
    <button onClick={() => toast.close(id)}>Dismiss</button>
  </div>
));
```

### Anchored toasts

Pin a toast to a button, element, or coordinate. Think tooltips but with attitude.

```ts
toast.success("Copied!", {
  anchor: buttonRef.current,
  anchorSide: "top",
  arrow: true,
  timeout: 2000,
});
```

Full anchor positioning docs: **[docs/anchored.md](docs/anchored.md)**

### Deduplication

```ts
toast.error("Connection lost", { deduplicate: true });
toast.error("Connection lost", { deduplicate: true }); // no-op
```

## Toaster

Drop it anywhere. One instance. Configure once.

```tsx
<Toaster
  position="bottom-right"
  limit={3}
  timeout={4000}
  closeButton="hover"
  richColors
  theme="system"
/>
```

All props: **[docs/toaster.md](docs/toaster.md)**

## Styling

Import the defaults and override what you want:

```ts
import "@vcui/popser/styles";       // modular (6 files via @import)
import "@vcui/popser/styles/min";   // flat, minified, single file — 2.7 KB gzipped
```

Everything is CSS custom properties. Override them, don't fight them:

```css
:root {
  --popser-bg: oklch(1 0 0);
  --popser-fg: oklch(0.145 0 0);
  --popser-border: oklch(0.922 0 0);
  --popser-radius: 8px;
}
```

Works with Tailwind, CSS modules, or raw CSS. Pass `classNames` to target every slot. Or go `unstyled` and build from scratch with `data-popser-*` attributes.

Full styling guide: **[docs/styling.md](docs/styling.md)**

## shadcn

```bash
npx shadcn add @vcode-sh/popser
```

Details: **[docs/shadcn.md](docs/shadcn.md)**

## E2E Testing

Every toast renders `data-popser-id` in the DOM. Select by ID in Playwright or Cypress without praying to the selector gods.

```ts
await page.locator('[data-popser-id="my-toast"]').waitFor();
```

Full data attributes reference: **[docs/testing.md](docs/testing.md)**

## Bundle Size

| | Raw | Gzipped |
|---|---|---|
| JS (ESM) | 15.7 KB | 5.6 KB |
| CSS (`styles/min`) | 16.6 KB | 2.7 KB |
| **Total** | **32.3 KB** | **8.3 KB** |

Sonner ships ~17 KB gzipped with CSS bundled inside the JavaScript. Popser is about half that, and the CSS is a separate opt-in file your bundler can tree-shake.

## Why popser?

Sonner is great. I used it for years. Then I needed to style a toast without `!important` and the whole thing fell apart.

popser is built on [Base UI](https://base-ui.com) Toast primitives — the headless component library built by the teams behind Radix, Floating UI, and MUI. Base UI is where React component architecture is heading in 2026, and popser is the first toast library built on top of it.

The API is Sonner-compatible so you can swap without rewriting anything. But under the hood, it's proper headless UI with ARIA live regions, F6 keyboard navigation, and styles that don't need `!important` to override.

- **Headless primitives.** Base UI renders the structure. You own the styles.
- **Sonner-compatible.** Same `toast.success()` / `toast.promise()` interface. Drop-in.
- **No memory leaks.** Singleton manager with tracked cleanup. Toasts don't ghost you.
- **No hardcoded breakpoints.** Mobile breakpoint is a prop. CSS-driven responsiveness.
- **Accessible.** ARIA live regions, priority system, keyboard navigation.
- **E2E ready.** `data-popser-id` on every toast root. Stable selectors out of the box.
- **Tiny.** 8.3 KB gzipped total. Five inline SVGs and a CSS spinner. Zero icon dependencies.
- **Anchored toasts.** Pin toasts to elements with Floating UI positioning. Arrow included.

Read the full story: **[Why I built this](https://popser.vcui.dev/why)** · **[Why Base UI, not Radix](https://popser.vcui.dev/why-base-ui)**

## Documentation

- **[Toast API](docs/api.md)** — all methods, options, deduplication, callbacks
- **[Toaster Component](docs/toaster.md)** — props, positioning, theme, mobile
- **[Styling](docs/styling.md)** — CSS variables, classNames, Tailwind, dark mode, unstyled
- **[Promise Toasts](docs/promise.md)** — loading states, JSX results, conditional skip, finally
- **[Anchored Toasts](docs/anchored.md)** — element anchoring, coordinates, arrow, positioning
- **[Custom Toasts](docs/custom.md)** — custom render functions, bypassing default layout
- **[shadcn Integration](docs/shadcn.md)** — registry install, next-themes, configuration
- **[Testing](docs/testing.md)** — data attributes, Playwright, Cypress, useToaster hook
- **[Popser vs Sonner](docs/popser-sonner.md)** — feature comparison, migration guide, issue tracker
- **[Popser vs Base UI Toast](docs/popser-toast.md)** — architecture, component mapping, what we add
- **[Changelog](CHANGELOG.md)** — what changed, when, and why

Or just read them on the website: **[popser.vcui.dev/docs](https://popser.vcui.dev/docs)**

## Contributing

Contributions welcome. Bug fixes, features, docs, tests — all of it. Check **[CONTRIBUTING.md](CONTRIBUTING.md)** for the setup and ground rules, or read **[popser.vcui.dev/collaborate](https://popser.vcui.dev/collaborate)** for the longer version.

## License

MIT - [Vibe Code](https://vcode.sh)
