# popser

Toast notifications for React. Built on Base UI. Sonner-compatible API.
No `!important`. No memory leaks. No hardcoded breakpoints.

## Install

```bash
npm install popser
```

## Quick Start

```tsx
import { toast, Toaster } from "popser";
import "popser/styles";

function App() {
  return (
    <>
      <button onClick={() => toast.success("It works")}>Toast</button>
      <Toaster />
    </>
  );
}
```

That's it. No Provider wrapper. No theme configuration.
No 47-step setup guide. It just works.

## Documentation

Coming soon.

## License

MIT
