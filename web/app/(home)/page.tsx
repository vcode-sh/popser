import Link from "next/link";
import { CopyCommand } from "@/components/copy-command";
import { ToastDemo } from "@/components/toast-demo";

const highlights = [
  {
    label: "Anchored toasts",
    detail:
      "Pin to elements, clicks, or coordinates. Sonner can't. Popser can.",
    badge: "Unique",
  },
  {
    label: "Headless Base UI",
    detail: "No opinions. Your CSS wins every argument.",
  },
  {
    label: "Sonner-compatible",
    detail: "Same API. Drop-in replacement. All the greatest hits.",
  },
  {
    label: "No !important",
    detail: "Zero specificity wars. Override anything. Like civilised people.",
  },
  {
    label: "No memory leaks",
    detail: "Proper cleanup. Your app won't slowly eat itself alive.",
  },
  {
    label: "Accessible",
    detail: "ARIA live regions, F6 navigation. Not an afterthought.",
  },
  {
    label: "E2E ready",
    detail: "data-popser-id on every toast. Your tests won't be flaky (for once).",
  },
  {
    label: "Zero icon deps",
    detail: "Five inline SVGs. One CSS spinner. 40 lines. No library tax.",
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
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-24 pb-20 text-center">
        <h1 className="font-extrabold text-7xl tracking-tighter sm:text-8xl">
          <span className="animate-gradient bg-[length:200%_auto] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Popser
          </span>
        </h1>
        <p className="mt-4 font-medium text-fd-foreground text-xl tracking-tight sm:text-2xl">
          Toasts that don&apos;t make you cry.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-fd-muted-foreground text-sm leading-relaxed sm:text-base">
          Headless Base UI. Sonner-compatible API.
          <br />
          No <code className="text-fd-foreground">!important</code> hacks. No
          memory leaks. No existential dread.
        </p>

        <div className="mt-10 flex flex-col items-center gap-2">
          <CopyCommand command="npm i @vcui/popser" />
          <span className="text-fd-muted-foreground text-xs">
            or, if you&apos;re fancy
          </span>
          <CopyCommand command="npx shadcn add @vcode-sh/popser" />
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            className="rounded-lg bg-fd-primary px-6 py-2.5 font-medium text-fd-primary-foreground text-sm transition-colors hover:bg-fd-primary/90"
            href="/docs"
          >
            Read the docs
          </Link>
          <a
            className="rounded-lg border border-fd-border px-6 py-2.5 font-medium text-sm transition-colors hover:bg-fd-accent"
            href="https://github.com/vcode-sh/popser"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="divide-y divide-fd-border rounded-xl border border-fd-border">
          {highlights.map((item) => (
            <div
              className="flex items-start gap-3 px-5 py-4"
              key={item.label}
            >
              <span className="mt-0.5 text-fd-muted-foreground">
                {"badge" in item ? (
                  <span className="inline-block rounded-full bg-purple-500/10 px-2 py-0.5 font-medium text-purple-500 text-[10px] leading-tight">
                    {item.badge}
                  </span>
                ) : (
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20 6 9 17l-5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <div className="min-w-0">
                <span className="font-medium text-sm">{item.label}</span>
                <span className="ml-2 text-fd-muted-foreground text-sm">
                  {item.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section className="mx-auto w-full max-w-2xl px-4 py-16">
        <h2 className="mb-2 text-center font-bold text-2xl">
          Go on, break something
        </h2>
        <p className="mb-8 text-center text-fd-muted-foreground text-sm">
          Try the click-anchored one. That&apos;s the one Sonner doesn&apos;t
          have.
        </p>
        <ToastDemo />
      </section>

      {/* Code Example */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-20">
        <h2 className="mb-8 text-center font-bold text-2xl">
          Five lines. That&apos;s it.
        </h2>
        <pre className="overflow-x-auto rounded-xl border border-fd-border bg-fd-secondary p-6 font-mono text-sm">
          <code>{codeExample}</code>
        </pre>
      </section>
    </main>
  );
}
