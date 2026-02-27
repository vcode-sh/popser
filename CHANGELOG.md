# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-02-26

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
- Light and dark mode token sets
- Mobile responsive behavior with configurable breakpoint
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
- ESM + CJS dual output with TypeScript declarations
