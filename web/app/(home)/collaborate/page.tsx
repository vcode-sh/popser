import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collaborate — Popser",
  description:
    "Popser is open source. Contribute code, docs, tests, or ideas. Base UI is the foundation. You bring the rest.",
};

const areas = [
  {
    label: "Bug fixes",
    detail:
      "Found something broken? Fix it. Or open an issue with a reproduction. Both are equally valuable.",
  },
  {
    label: "Accessibility",
    detail:
      "Screen reader testing, keyboard navigation edge cases, ARIA improvements. This matters more than any feature.",
  },
  {
    label: "Performance",
    detail:
      "Bundle size wins, render optimisation, CSS improvements. Every byte counts at scale.",
  },
  {
    label: "Testing",
    detail:
      "More edge cases, more coverage, more confidence. 419 tests and counting. Break something new.",
  },
  {
    label: "Documentation",
    detail:
      "Typos, unclear explanations, missing examples. If you had to read something twice, that's a docs bug.",
  },
  {
    label: "CSS and theming",
    detail:
      "Better defaults, new themes, token improvements. CSS is the hardest part and I'm not above admitting that.",
  },
  {
    label: "Framework integrations",
    detail:
      "Next.js edge cases, Remix, Astro, whatever you ship with. If popser doesn't work there, tell me.",
  },
  {
    label: "Ideas",
    detail:
      "Open a discussion. Propose something wild. The worst I can say is no. The best is: that's brilliant, do it.",
  },
];

const steps = [
  {
    step: "1",
    title: "Fork and clone",
    code: "git clone https://github.com/vcode-sh/popser.git\ncd popser && npm install",
  },
  {
    step: "2",
    title: "Run the dev server",
    code: "npm run dev          # watch build\nnpm run web:dev      # docs site\nnpm run test:watch   # tests",
  },
  {
    step: "3",
    title: "Make it pass",
    code: "npm run type-check && npm run test && npm run lint && npm run build",
  },
  {
    step: "4",
    title: "Open a PR",
    code: null,
  },
];

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CollaboratePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-16 pb-24">
      <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl">
        Collaborate
      </h1>
      <p className="mt-4 text-fd-muted-foreground text-lg leading-relaxed">
        Open source. Not the LinkedIn kind where people post about giving back
        and then ghost the repo. The real kind.
      </p>

      {/* The pitch */}
      <section className="mt-16">
        <h2 className="font-bold text-2xl tracking-tight">The situation</h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            I built popser because I needed toast notifications that don&apos;t
            fight me on styling, leak memory, or require a PhD in CSS
            specificity. It works. It&apos;s tested. It ships at 8.3 KB gzipped.
          </p>
          <p>
            But one person building a component library is a bottleneck, not a
            strategy. The code is MIT-licensed, the{" "}
            <a
              className="text-fd-foreground underline underline-offset-2 hover:text-fd-primary"
              href="https://github.com/vcode-sh/popser"
              rel="noopener noreferrer"
              target="_blank"
            >
              repo is on GitHub
            </a>
            , and I genuinely want people to contribute. Not in a
            &ldquo;contributions welcome&rdquo; badge-on-the-README way. In a
            &ldquo;please help me make this thing better&rdquo; way.
          </p>
        </div>
      </section>

      {/* Why Base UI matters */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          The foundation matters
        </h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            Popser is built on{" "}
            <a
              className="text-fd-foreground underline underline-offset-2 hover:text-fd-primary"
              href="https://base-ui.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Base UI
            </a>{" "}
            — the headless React component library built by the teams behind
            Radix, Floating UI, and MUI. This is where React component
            architecture is heading. Proper primitives, proper accessibility,
            proper CSS transitions. No opinions about your styles.
          </p>
          <p>
            Contributing to popser means working with Base UI primitives. If you
            understand{" "}
            <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-fd-foreground">
              createToastManager()
            </code>
            , reactive stores, and headless components, you already know the
            architecture. If you don&apos;t,{" "}
            <Link
              className="text-fd-foreground underline underline-offset-2 hover:text-fd-primary"
              href="/why-base-ui"
            >
              here&apos;s why it matters
            </Link>
            .
          </p>
        </div>
      </section>

      {/* What we need */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          What I actually need help with
        </h2>
        <p className="mt-4 mb-6 text-fd-muted-foreground leading-relaxed">
          Not a wishlist. Not a backlog grooming exercise. Real things that
          would make popser better.
        </p>
        <div className="divide-y divide-fd-border rounded-xl border border-fd-border text-sm">
          {areas.map((area) => (
            <div className="flex items-start gap-3 px-5 py-3" key={area.label}>
              <span className="mt-0.5 text-fd-muted-foreground">
                <ChevronIcon />
              </span>
              <div>
                <span className="font-medium text-fd-foreground">
                  {area.label}
                </span>
                <span className="ml-2 text-fd-muted-foreground">
                  {area.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to start */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          How to get started
        </h2>
        <div className="mt-6 space-y-6">
          {steps.map((item) => (
            <div key={item.step}>
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-fd-secondary font-mono text-xs">
                  {item.step}
                </span>
                <span className="font-medium">{item.title}</span>
              </div>
              {item.code ? (
                <pre className="mt-2 ml-10 overflow-x-auto rounded-lg border border-fd-border bg-fd-secondary p-4 font-mono text-sm leading-relaxed">
                  <code>{item.code}</code>
                </pre>
              ) : (
                <p className="mt-2 ml-10 text-fd-muted-foreground text-sm leading-relaxed">
                  Explain what changed and why. One thing per PR. Tests
                  included. Read the full{" "}
                  <a
                    className="text-fd-foreground underline underline-offset-2 hover:text-fd-primary"
                    href="https://github.com/vcode-sh/popser/blob/main/CONTRIBUTING.md"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    contributing guide
                  </a>{" "}
                  if you want the details.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ground rules */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">Ground rules</h2>
        <div className="mt-4 space-y-4 text-fd-muted-foreground leading-relaxed">
          <p>
            No Code of Conduct document. Just common sense. Be decent, be
            helpful, be honest. If someone&apos;s code needs work, say so
            kindly. If someone&apos;s idea is brilliant, say so loudly. If you
            disagree, explain why with reasoning, not volume.
          </p>
          <p>
            I review every PR personally. I&apos;ll give honest feedback.
            Sometimes I&apos;ll say no. That&apos;s not a rejection of you —
            it&apos;s a rejection of that particular approach. Come back with
            something different. Or tell me why I&apos;m wrong. I&apos;ve been
            wrong before.
          </p>
        </div>
      </section>

      {/* The project */}
      <section className="mt-12">
        <h2 className="font-bold text-2xl tracking-tight">
          The project at a glance
        </h2>
        <div className="mt-6 overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-fd-border">
              <tr>
                <td className="px-5 py-3 font-medium">Stack</td>
                <td className="px-5 py-3 text-fd-muted-foreground">
                  React, Base UI, TypeScript 5.9, Vitest, Biome
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Bundle</td>
                <td className="px-5 py-3 text-fd-muted-foreground">
                  8.3 KB gzipped (JS + CSS)
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Tests</td>
                <td className="px-5 py-3 text-fd-muted-foreground">
                  419 tests, 90% coverage thresholds
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">CI</td>
                <td className="px-5 py-3 text-fd-muted-foreground">
                  Node 22 + 24, Bun, Codecov, bundle size tracking
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Node</td>
                <td className="px-5 py-3 text-fd-muted-foreground">
                  &gt;= 22.0.0
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">License</td>
                <td className="px-5 py-3 text-fd-muted-foreground">MIT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <a
          className="rounded-lg bg-fd-primary px-6 py-2.5 font-medium text-fd-primary-foreground text-sm transition-colors hover:bg-fd-primary/90"
          href="https://github.com/vcode-sh/popser"
          rel="noopener noreferrer"
          target="_blank"
        >
          View on GitHub
        </a>
        <div className="flex gap-4">
          <Link
            className="text-fd-muted-foreground text-sm underline underline-offset-4 hover:text-fd-foreground"
            href="/docs"
          >
            Read the docs
          </Link>
          <Link
            className="text-fd-muted-foreground text-sm underline underline-offset-4 hover:text-fd-foreground"
            href="/why"
          >
            Why I built this
          </Link>
        </div>
      </div>
    </main>
  );
}
