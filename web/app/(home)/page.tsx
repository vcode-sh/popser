import Link from "next/link";
import { ToastDemo } from "@/components/toast-demo";

const features = [
  {
    title: "Headless Base UI",
    description:
      "Built on Base UI Toast primitives. No opinionated markup. Your styles always win.",
  },
  {
    title: "Sonner-compatible API",
    description:
      "Drop-in replacement. toast.success(), toast.error(), toast.promise() — all the hits.",
  },
  {
    title: "No memory leaks",
    description:
      "Singleton toast manager with proper cleanup. Deduplication map cleared on close.",
  },
  {
    title: "Accessible",
    description:
      "ARIA live regions, priority system, F6 keyboard navigation. Screen readers included.",
  },
  {
    title: "Anchored toasts",
    description:
      "Pin to DOM elements, click events, or coordinates. Built on Floating UI.",
  },
  {
    title: "E2E ready",
    description:
      "data-popser-id on every toast root. Stable selectors for Playwright and Cypress.",
  },
  {
    title: "No !important",
    description:
      "Headless primitives mean zero specificity wars. Override anything with plain CSS.",
  },
  {
    title: "Zero icon deps",
    description:
      "Five inline SVGs + CSS spinner. Under 40 lines. No icon library required.",
  },
];

const codeExample = `import { toast, Toaster } from "@vcui/popser";
import "@vcui/popser/styles";

function App() {
  return (
    <>
      <button onClick={() => toast.success("Saved!")}>
        Save
      </button>
      <Toaster />
    </>
  );
}`;

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-20 pb-16 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Toast notifications
          <br />
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            done properly
          </span>
        </h1>
        <p className="mt-6 text-lg text-fd-muted-foreground max-w-xl">
          Built on Base UI. Sonner-compatible API. No{" "}
          <code className="text-fd-foreground">!important</code>. No memory
          leaks. Just toasts that work.
        </p>
        <div className="mt-8 flex flex-col items-center gap-2">
          <code className="rounded-lg border border-fd-border bg-fd-secondary px-4 py-2.5 text-sm font-mono">
            npm i @vcui/popser
          </code>
          <span className="text-xs text-fd-muted-foreground">or</span>
          <code className="rounded-lg border border-fd-border bg-fd-secondary px-4 py-2.5 text-sm font-mono">
            npx shadcn add @vcode-sh/popser
          </code>
        </div>
        <div className="mt-6 flex gap-3">
          <Link
            href="/docs"
            className="rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/vcode-sh/popser"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-4 py-16 mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">What you get</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-fd-border bg-fd-card p-5"
            >
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="mt-2 text-sm text-fd-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section className="w-full max-w-3xl px-4 py-16 mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Try it out</h2>
        <ToastDemo />
      </section>

      {/* Code Example */}
      <section className="w-full max-w-3xl px-4 pb-20 mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Quick start</h2>
        <pre className="rounded-xl border border-fd-border bg-fd-secondary p-6 text-sm font-mono overflow-x-auto">
          <code>{codeExample}</code>
        </pre>
      </section>
    </main>
  );
}
