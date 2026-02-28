import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Why I Built This — Popser",
  description:
    "Sonner works. But memory leaks, !important hacks, and 44 open issues convinced me to build something different.",
};

const SONNER_ISSUES = "https://github.com/emilkowalski/sonner/issues";

const issues = [
  {
    number: 729,
    title: "Memory leak",
    note: "Dismissed toasts never evicted from internal array. DOM nodes leaked.",
  },
  {
    number: 633,
    title: "Styles gated behind data-styled",
    note: 'Critical behaviour hidden behind data-styled="true" selector. Custom styles require !important.',
  },
  {
    number: 719,
    title: "Height not recalculated",
    note: "Replacing a toast with different content length — size doesn't update. Rendering bugs.",
  },
  {
    number: 376,
    title: "Custom mobile breakpoint",
    note: "Hardcoded 600px. Open since March 2024. 7 upvotes.",
  },
  {
    number: 401,
    title: "Loading state persists",
    note: "Re-call toast() with same ID. Loading spinner stays. 10 comments, still open.",
  },
  {
    number: 528,
    title: "Hydration error",
    note: "<section> rendered as child of <html>. React SSR mismatch.",
  },
  {
    number: 705,
    title: "Hover-to-show close button",
    note: "Hover-to-show was removed. Users want it back. Still open.",
  },
  {
    number: 714,
    title: "No stable test selectors",
    note: "data-testid requires per-toast config. No default attributes.",
  },
];

const features = [
  {
    label: "Sonner-compatible API",
    detail:
      "toast.success(), toast.error(), toast.promise(). Same muscle memory, different engine.",
  },
  {
    label: "No !important",
    detail: "Headless primitives. Your CSS wins every argument. Always.",
  },
  {
    label: "Zero memory leaks",
    detail:
      "Base UI's reactive store cleans up on close. No growing arrays. No leaked DOM.",
  },
  {
    label: "Anchored toasts",
    detail:
      "Pin to elements, mouse events, or coordinates. Sonner can't do this.",
  },
  {
    label: "Built-in icons",
    detail: "5 inline SVGs + CSS spinner. 40 lines. Zero icon library tax.",
  },
  {
    label: "Opt-in CSS",
    detail:
      "OKLCH tokens, light/dark, rich colours. Import it or don't. Your call.",
  },
  {
    label: "12 classNames slots",
    detail: "Sonner has 6. Every element is targetable.",
  },
  {
    label: "E2E ready",
    detail:
      "data-popser-* on every element. Zero config. Your tests stop being flaky.",
  },
];

const comparisonRows: {
  label: string;
  popser: ReactNode;
  sonner: ReactNode;
}[] = [
  { label: "JS (gzipped)", popser: "4.8 KB", sonner: "~13.5 KB" },
  { label: "CSS (gzipped)", popser: "2.6 KB", sonner: "Bundled in JS" },
  { label: "Total", popser: "7.4 KB", sonner: "~17 KB" },
  { label: "Memory leaks", popser: "None", sonner: null },
  {
    label: "!important required",
    popser: "Never",
    sonner: "For any override",
  },
  { label: "Open issues", popser: "Few", sonner: "44" },
  { label: "Anchored toasts", popser: "Full Floating UI", sonner: "None" },
  { label: "update() API", popser: "Partial updates", sonner: "None" },
  {
    label: "Close button modes",
    popser: "always / hover / never",
    sonner: "On or off",
  },
];

const migrationCode = `- import { toast } from "sonner";
+ import { toast } from "@vcui/popser";

- toast.dismiss(id);
+ toast.close(id);

- toast("msg", { duration: 3000 });
+ toast("msg", { timeout: 3000 });`;

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IssueLink({ number }: { number: number }) {
  return (
    <a
      className="shrink-0 font-mono text-fd-muted-foreground text-xs underline decoration-fd-border underline-offset-2 hover:text-fd-foreground"
      href={`${SONNER_ISSUES}/${number}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      #{number}
    </a>
  );
}

export default function WhyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-16 pb-24">
      <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl">
        Why I Built This
      </h1>
      <p className="mt-4 text-fd-muted-foreground text-lg leading-relaxed">
        Not because the world needed another toast library. Because the existing
        ones made me unreasonably angry.
      </p>

      {/* The problem */}
      <section className="mt-16">
        <h2 className="font-bold text-2xl tracking-tight">
          Sonner&apos;s good enough problem
        </h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            Emil Kowalski built something great. Sonner has 12,000 stars,
            millions of weekly downloads, and a spot in shadcn&apos;s official
            component list. It works out of the box.
          </p>
          <p>
            &ldquo;Works out of the box&rdquo; becomes &ldquo;impossible to
            change&rdquo; when you actually try to customise it. Override a
            default style? Need{" "}
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              !important
            </code>
            . Use it with Tailwind v4? Broken. Avoid memory leaks in a
            long-running app? Good luck — dismissed toasts are never evicted
            from the internal array. The DOM nodes leak too.
          </p>
          <p>
            Emil&apos;s busy. PRs sit. Issues pile up. 44 open at last count.
            The codebase relies on a singleton Observer class with{" "}
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              setTimeout + flushSync
            </code>{" "}
            workarounds documented as &ldquo;temp solutions.&rdquo; Not a dig —
            it&apos;s what happens when a side project gets 12,000 stars and
            real life doesn&apos;t pause.
          </p>
        </div>
      </section>

      {/* Issues */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          The issues that convinced me
        </h2>
        <p className="mt-4 mb-6 text-fd-muted-foreground leading-relaxed">
          These are all real{" "}
          <a
            className="text-fd-foreground underline underline-offset-2 hover:text-fd-primary"
            href={SONNER_ISSUES}
            rel="noopener noreferrer"
            target="_blank"
          >
            Sonner GitHub issues
          </a>
          . All still open.
        </p>
        <div className="divide-y divide-fd-border rounded-xl border border-fd-border text-sm">
          {issues.map((issue) => (
            <div
              className="flex items-start gap-3 px-5 py-3"
              key={issue.number}
            >
              <IssueLink number={issue.number} />
              <div>
                <span className="font-medium">{issue.title}</span>
                <span className="ml-2 text-fd-muted-foreground">
                  {issue.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Base UI */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          Base UI changed the equation
        </h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            In early 2026, the team behind Radix, Floating UI, and MUI shipped{" "}
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              @base-ui/react
            </code>{" "}
            v1.0 with proper toast primitives. Not a styling library. Not a
            component kit. Headless primitives that do the hard part and get out
            of your way.
          </p>
          <p>
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              createToastManager()
            </code>{" "}
            — a singleton with a reactive store, proper cleanup on close,
            Floating UI positioning built in, ARIA live regions, F6 keyboard
            navigation. The foundation was there. Someone just needed to wrap it
            in a developer-friendly API.
          </p>
        </div>
      </section>

      {/* What I built */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">What I built</h2>
        <p className="mt-4 text-fd-muted-foreground leading-relaxed">
          A thin layer on top of Base UI Toast. If you know Sonner, you know
          Popser. Same API, different engine.
        </p>
        <div className="mt-6 divide-y divide-fd-border rounded-xl border border-fd-border text-sm">
          {features.map((feature) => (
            <div
              className="flex items-start gap-3 px-5 py-3"
              key={feature.label}
            >
              <span className="mt-0.5 text-fd-muted-foreground">
                <CheckIcon />
              </span>
              <div>
                <span className="font-medium text-fd-foreground">
                  {feature.label}
                </span>
                <span className="ml-2 text-fd-muted-foreground">
                  {feature.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The numbers */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">The numbers</h2>
        <p className="mt-4 text-fd-muted-foreground leading-relaxed">
          Less than half the size. And the CSS is a separate file — not injected
          as a JavaScript side-effect.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-fd-border border-b bg-fd-secondary text-left">
                <th className="px-5 py-3 font-medium" />
                <th className="px-5 py-3 font-medium">Popser</th>
                <th className="px-5 py-3 font-medium">Sonner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fd-border">
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <td className="px-5 py-3 font-medium">{row.label}</td>
                  <td className="px-5 py-3 text-fd-muted-foreground">
                    {row.popser}
                  </td>
                  <td className="px-5 py-3 text-fd-muted-foreground">
                    {row.label === "Memory leaks" ? (
                      <span>
                        <IssueLink number={729} />, <IssueLink number={605} />
                      </span>
                    ) : (
                      row.sonner
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Migration */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">Migration</h2>
        <p className="mt-4 text-fd-muted-foreground leading-relaxed">
          95% of call sites need zero changes. The remaining 5% is mechanical
          rename.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-fd-border bg-fd-secondary p-5 font-mono text-sm leading-relaxed">
          <code>{migrationCode}</code>
        </pre>
      </section>

      {/* Closing */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          What this isn&apos;t
        </h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            This isn&apos;t a crusade against Sonner. Emil built a great
            library. It&apos;s popular for good reasons. But software ages,
            priorities shift, and sometimes you build the thing that exists in
            the gap between &ldquo;good enough&rdquo; and &ldquo;actually
            good.&rdquo;
          </p>
          <p>
            I needed toast notifications built on proper primitives, with clean
            CSS architecture, zero memory leaks, and anchored positioning. So I
            built it.
          </p>
        </div>
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
          href="/why-base-ui"
        >
          Why Base UI, not Radix? →
        </Link>
      </div>
    </main>
  );
}
