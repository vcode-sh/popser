import { toast } from "popser";
import type { DemoButton } from "../components.js";
import { DemoCard, DemoSection } from "../components.js";
import { gridStyle } from "../styles.js";
import { tracked } from "../toast-counter.js";

const buttons: DemoButton[] = [
  {
    label: "Deduplicate",
    code: `toast("Same title", { deduplicate: true })\n// Click multiple times — only one toast`,
    onClick: () => tracked("Same title", { deduplicate: true }),
  },
  {
    label: "Not Dismissible",
    code: `toast("Can't swipe or close me", {\n  dismissible: false,\n  timeout: 4000,\n})`,
    onClick: () =>
      tracked("Can't swipe or close me", {
        dismissible: false,
        timeout: 4000,
      }),
  },
  {
    label: "Duration (Sonner compat)",
    code: `toast("Auto-close in 8s", {\n  duration: 8000, // alias for timeout\n})`,
    onClick: () => tracked("Auto-close in 8s", { duration: 8000 }),
  },
  {
    label: "onAutoClose callback",
    code: `toast("Wait for auto-close...", {\n  timeout: 3000,\n  onAutoClose: () => toast.info("onAutoClose fired!"),\n})`,
    onClick: () =>
      tracked("Wait for auto-close...", {
        timeout: 3000,
        onAutoClose: () => toast.info("onAutoClose fired!"),
      }),
  },
  {
    label: "onDismiss callback",
    code: `toast("Close me manually", {\n  timeout: 0,\n  onDismiss: () => toast.info("onDismiss fired!"),\n})`,
    onClick: () =>
      tracked("Close me manually", {
        timeout: 0,
        onDismiss: () => toast.info("onDismiss fired!"),
      }),
  },
  {
    label: "onRemove callback",
    code: `toast("Watch the console", {\n  onRemove: () => console.log("Removed from DOM"),\n})`,
    onClick: () =>
      tracked("Watch the console", {
        onRemove: () =>
          console.log("[popser] onRemove: toast removed from DOM"),
      }),
  },
];

export function BehaviorSection() {
  return (
    <DemoSection
      description="Deduplication, dismissible control, duration alias, lifecycle callbacks"
      title="Behavior"
    >
      <div style={gridStyle}>
        {buttons.map((btn) => (
          <DemoCard key={btn.label} {...btn} />
        ))}
      </div>
    </DemoSection>
  );
}
