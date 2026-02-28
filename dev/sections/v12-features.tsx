import { toast } from "popser";
import type { DemoButton } from "../components.js";
import { DemoCard, DemoSection } from "../components.js";
import { gridStyle } from "../styles.js";
import { tracked } from "../toast-counter.js";

const buttons: DemoButton[] = [
  {
    label: "Entry from Left",
    code: `toast("Slide left", {\n  enterFrom: "left",\n})`,
    onClick: () => tracked("Slide left", { enterFrom: "left" }),
  },
  {
    label: "Entry from Right",
    code: `toast("Slide right", {\n  enterFrom: "right",\n})`,
    onClick: () => tracked("Slide right", { enterFrom: "right" }),
  },
  {
    label: "Entry from Top",
    code: `toast("Slide top", {\n  enterFrom: "top",\n})`,
    onClick: () => tracked("Slide top", { enterFrom: "top" }),
  },
  {
    label: "Entry from Bottom",
    code: `toast("Slide bottom", {\n  enterFrom: "bottom",\n})`,
    onClick: () => tracked("Slide bottom", { enterFrom: "bottom" }),
  },
  {
    label: "Corner Close Button",
    code: `toast("Corner X", {\n  closeButtonPosition: "corner",\n  timeout: 8000,\n})`,
    onClick: () =>
      tracked("Corner X", { closeButtonPosition: "corner", timeout: 8000 }),
  },
  {
    label: "AbortSignal — Cancel",
    code: `const ctrl = new AbortController();\ntoast.promise(slowFetch(), {\n  loading: "Working...",\n  success: "Done!",\n  error: "Failed",\n  signal: ctrl.signal,\n  aborted: "Cancelled",\n});\nsetTimeout(() => ctrl.abort(), 1500);`,
    onClick: () => {
      const ctrl = new AbortController();
      toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 5000)), {
        loading: "Working...",
        success: "Done!",
        error: "Failed",
        signal: ctrl.signal,
        aborted: "Cancelled",
      });
      setTimeout(() => ctrl.abort(), 1500);
    },
  },
  {
    label: "AbortSignal — Completes",
    code: `const ctrl = new AbortController();\ntoast.promise(fastFetch(), {\n  loading: "Working...",\n  success: "Done!",\n  error: "Failed",\n  signal: ctrl.signal,\n  aborted: "Cancelled",\n});\nsetTimeout(() => ctrl.abort(), 5000);`,
    onClick: () => {
      const ctrl = new AbortController();
      toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 1000)), {
        loading: "Working...",
        success: "Done before abort!",
        error: "Failed",
        signal: ctrl.signal,
        aborted: "Cancelled",
      });
      setTimeout(() => ctrl.abort(), 5000);
    },
  },
  {
    label: "AbortSignal — Extended",
    code: `const ctrl = new AbortController();\ntoast.promise(slowFetch(), {\n  loading: "Uploading...",\n  success: "Uploaded!",\n  error: "Failed",\n  signal: ctrl.signal,\n  aborted: (reason) => ({\n    title: "Aborted",\n    description: String(reason),\n    timeout: 5000,\n  }),\n});\nsetTimeout(() => ctrl.abort("user"), 1500);`,
    onClick: () => {
      const ctrl = new AbortController();
      toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 5000)), {
        loading: "Uploading...",
        success: "Uploaded!",
        error: "Failed",
        signal: ctrl.signal,
        aborted: (reason) => ({
          title: "Aborted",
          description: String(reason),
          timeout: 5000,
        }),
      });
      setTimeout(() => ctrl.abort("user"), 1500);
    },
  },
  {
    label: "Show History",
    code: `toast("One"); toast("Two"); toast("Three");\nsetTimeout(() => {\n  const h = toast.getHistory();\n  toast.info(\`History: \${h.length} entries\`);\n}, 500);`,
    onClick: () => {
      tracked("One");
      tracked("Two");
      tracked("Three");
      setTimeout(() => {
        const h = toast.getHistory();
        tracked(`History: ${h.length} entries`, { type: "info" });
      }, 500);
    },
  },
  {
    label: "Clear History",
    code: `toast.clearHistory();\ntoast.info("History cleared");`,
    onClick: () => {
      toast.clearHistory();
      tracked("History cleared", { type: "info" });
    },
  },
];

export function V12FeaturesSection() {
  return (
    <DemoSection
      description="New in v1.2.0: entry direction, corner close button, AbortSignal, toast history"
      title="v1.2.0 Features"
    >
      <div style={gridStyle}>
        {buttons.map((btn) => (
          <DemoCard key={btn.label} {...btn} />
        ))}
      </div>
    </DemoSection>
  );
}
