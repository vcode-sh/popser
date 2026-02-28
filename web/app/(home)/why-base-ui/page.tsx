import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Base UI, Not Radix — Popser",
  description:
    "The co-creator of Radix called their toast component a liability. Here's why Popser chose Base UI instead.",
};

const comparisonRows = [
  {
    feature: "Imperative API",
    baseui: "createToastManager()",
    radix: "None",
  },
  {
    feature: "toast.promise()",
    baseui: "Built-in",
    radix: "None",
  },
  {
    feature: "toast.update()",
    baseui: "Built-in",
    radix: "None",
  },
  {
    feature: "Anchored positioning",
    baseui: "Floating UI built-in",
    radix: "None",
  },
  {
    feature: "Arrow element",
    baseui: "Toast.Arrow",
    radix: "None",
  },
  {
    feature: "ARIA priority",
    baseui: '"high" / "low"',
    radix: "Fixed",
  },
  {
    feature: "Keyboard nav",
    baseui: "F6 (ARIA standard)",
    radix: "Custom",
  },
  {
    feature: "CSS transitions",
    baseui: "data-starting-style / data-ending-style",
    radix: "data-state only",
  },
  {
    feature: "Height tracking",
    baseui: "CSS variable (--toast-height)",
    radix: "Manual JS",
  },
  {
    feature: "Stacking variables",
    baseui: "--toast-index, --toast-frontmost-height",
    radix: "None",
  },
  {
    feature: "Swipe handling",
    baseui: "Native, accessible",
    radix: "Custom pointer events",
  },
  {
    feature: "Close all",
    baseui: "manager.close()",
    radix: "Manual",
  },
  {
    feature: "React 19",
    baseui: "Full support",
    radix: "Partial",
  },
  {
    feature: "Last release",
    baseui: "Feb 2026 (v1.2.0)",
    radix: "6+ months ago",
  },
  {
    feature: "Development",
    baseui: "Weekly commits",
    radix: "Maintenance mode",
  },
];

const baseuiPRs = [
  {
    number: 3882,
    title: "Generic createToastManager<T>()",
    note: "Type-safe custom data access (v1.2.0)",
  },
  {
    number: 3464,
    title: "Reactive store refactor",
    note: "Foundation for singleton manager pattern",
  },
  {
    number: 3359,
    title: "Height recalculation on layout change",
    note: "Content updates resize correctly",
  },
  {
    number: 3096,
    title: "Anchored toast support",
    note: "Toast.Positioner with Floating UI",
  },
  {
    number: 4040,
    title: "Fix dismissed promise toast reopening",
    note: "Clean promise state transitions",
  },
  {
    number: 3564,
    title: "Fix timers not rescheduled on update",
    note: "toast.update() resets timeout properly",
  },
];

const assemblyItems = [
  "Build an imperative API wrapper",
  "Create icons (or install a library)",
  "Write all the CSS from scratch",
  "Handle mobile responsive behaviour",
  "Implement stacking and expand-on-hover",
  "Wire up classNames cascading",
  "Add close button visibility modes",
  "Set up shadcn integration",
];

export default function WhyBaseUIPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-16 pb-24">
      <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl">
        Why Base UI, Not Radix
      </h1>
      <p className="mt-4 text-fd-muted-foreground text-lg leading-relaxed">
        Because the people who built Radix said so.
      </p>

      {/* The backstory */}
      <section className="mt-16">
        <h2 className="font-bold text-2xl tracking-tight">The backstory</h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            Radix UI dominated React component libraries for three years. 18,000
            stars. 9.6 million weekly downloads. shadcn built their entire
            component system on it.
          </p>
          <p>
            Then Colm Tuite — co-creator of Radix — publicly called the Radix
            Toast component &ldquo;a liability&rdquo; and joined the Base UI
            team.
          </p>
          <p>
            That&apos;s not a market signal. That&apos;s the architect leaving
            the building and moving into a new one.
          </p>
        </div>
      </section>

      {/* What happened */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">What happened</h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            The team that created Radix UI (Colm Tuite, Pedro Duarte) joined
            forces with the Floating UI team (Atomiks) and the MUI team.
            Together they built{" "}
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              @base-ui/react
            </code>{" "}
            — a clean-room rewrite of headless React primitives.
          </p>
          <p>
            Base UI isn&apos;t a Radix fork. It&apos;s what Radix would be if
            they started over knowing everything they know now. And for toasts
            specifically, the difference is not subtle.
          </p>
        </div>
      </section>

      {/* The Radix Toast problem */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          The Radix Toast problem
        </h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>Radix Toast is declarative-only. Assemble it yourself:</p>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-fd-border bg-fd-secondary p-5 font-mono text-sm leading-relaxed">
          <code>{`<Toast.Provider>
  <Toast.Root>
    <Toast.Title>...</Toast.Title>
    <Toast.Description>...</Toast.Description>
    <Toast.Action>...</Toast.Action>
    <Toast.Close>...</Toast.Close>
  </Toast.Root>
  <Toast.Viewport />
</Toast.Provider>`}</code>
        </pre>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            No{" "}
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              toast.success()
            </code>
            . No imperative API. No{" "}
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              createToastManager()
            </code>
            . You can&apos;t call it from an event handler, a server action, or
            anywhere outside a React component tree without building your own
            state management.
          </p>
          <p>
            This is why shadcn deprecated their Radix toast wrapper and replaced
            it with Sonner. When the most influential React component library
            gives up on your toast component, that&apos;s a sign.
          </p>
        </div>
      </section>

      {/* What Base UI Toast provides */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          What Base UI Toast provides
        </h2>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-fd-border bg-fd-secondary p-5 font-mono text-sm leading-relaxed">
          <code>{`import { Toast } from "@base-ui/react";

const manager = Toast.createToastManager();

// Works anywhere — event handlers, server actions, utilities
manager.add({ title: "Hello", type: "success" });`}</code>
        </pre>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            Imperative. Singleton. Works anywhere. Plus a reactive store with
            memoized selectors, proper cleanup on close, Floating UI
            positioning, CSS transitions via{" "}
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              data-starting-style
            </code>
            , ARIA priority system, and F6 keyboard navigation.
          </p>
          <p>
            The foundation does the hard part. No Observer hacks. No{" "}
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              setTimeout + flushSync
            </code>{" "}
            workarounds.
          </p>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          Feature comparison
        </h2>
        <p className="mt-4 mb-6 text-fd-muted-foreground leading-relaxed">
          Toast-specific capabilities. This isn&apos;t close.
        </p>
        <div className="overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-fd-border border-b bg-fd-secondary text-left">
                <th className="px-5 py-3 font-medium">Feature</th>
                <th className="px-5 py-3 font-medium">Base UI Toast</th>
                <th className="px-5 py-3 font-medium">Radix Toast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fd-border">
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td className="px-5 py-3 font-medium">{row.feature}</td>
                  <td className="px-5 py-3 text-fd-muted-foreground">
                    {row.baseui}
                  </td>
                  <td className="px-5 py-3 text-fd-muted-foreground">
                    {row.radix}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* The shadcn signal */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">The shadcn signal</h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            shadcn now supports both Radix and Base UI components. Their docs
            include Base UI variants. They deprecated their own Radix toast
            wrapper — replaced it with Sonner, which is itself a from-scratch
            implementation because Radix Toast wasn&apos;t enough.
          </p>
          <p>
            When the ecosystem&apos;s most influential component library starts
            hedging between Radix and Base UI, you pick the one that&apos;s
            actively developed by the people who made both.
          </p>
        </div>
      </section>

      {/* Development velocity */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          Development velocity
        </h2>
        <p className="mt-4 mb-6 text-fd-muted-foreground leading-relaxed">
          Base UI ships monthly. The toast primitives alone have had significant
          improvements. Here are the PRs that directly benefit Popser:
        </p>
        <div className="divide-y divide-fd-border rounded-xl border border-fd-border text-sm">
          {baseuiPRs.map((pr) => (
            <div className="flex items-start gap-3 px-5 py-3" key={pr.number}>
              <span className="shrink-0 font-mono text-fd-muted-foreground text-xs">
                #{pr.number}
              </span>
              <div>
                <span className="font-medium">{pr.title}</span>
                <span className="ml-2 text-fd-muted-foreground">{pr.note}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-fd-muted-foreground leading-relaxed">
          Radix Toast&apos;s last meaningful update was over six months ago.
        </p>
      </section>

      {/* Why not just use Base UI directly */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          Why not just use Base UI directly?
        </h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            You can. It&apos;s a great library. But Base UI gives you LEGO
            bricks, not a toast. You&apos;d need to:
          </p>
        </div>
        <div className="mt-4 divide-y divide-fd-border rounded-xl border border-fd-border text-sm">
          {assemblyItems.map((item) => (
            <div className="flex items-center gap-3 px-5 py-3" key={item}>
              <span className="text-fd-muted-foreground">
                <svg
                  aria-hidden="true"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            That&apos;s what Popser is. The assembly already done. Same Base UI
            primitives underneath, but ready to use in five lines instead of
            fifty.
          </p>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-fd-border bg-fd-secondary p-5 font-mono text-sm leading-relaxed">
          <code>{`import { toast, Toaster } from "@vcui/popser";
import "@vcui/popser/styles";

// That's it.
toast.success("Done.");`}</code>
        </pre>
      </section>

      {/* CTA */}
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <Link
          className="rounded-lg bg-fd-primary px-6 py-2.5 font-medium text-fd-primary-foreground text-sm transition-colors hover:bg-fd-primary/90"
          href="/docs"
        >
          Read the docs
        </Link>
        <Link
          className="text-fd-muted-foreground text-sm underline underline-offset-4 hover:text-fd-foreground"
          href="/why"
        >
          ← Why I built this
        </Link>
      </div>
    </main>
  );
}
