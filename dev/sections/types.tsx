import type { DemoButton } from "../components.js";
import { DemoCard, DemoSection } from "../components.js";
import { gridStyle } from "../styles.js";
import { tracked } from "../toast-counter.js";

const buttons: DemoButton[] = [
  {
    label: "Default",
    code: 'toast("Hello world")',
    onClick: () => tracked("Hello world"),
  },
  {
    label: "Success",
    code: 'toast.success("Successfully saved!")',
    onClick: () => tracked("Successfully saved!", { type: "success" }),
  },
  {
    label: "Error",
    code: 'toast.error("Something went wrong")',
    onClick: () => tracked("Something went wrong", { type: "error" }),
  },
  {
    label: "Info",
    code: 'toast.info("Here is some info")',
    onClick: () => tracked("Here is some info", { type: "info" }),
  },
  {
    label: "Warning",
    code: 'toast.warning("Be careful!")',
    onClick: () => tracked("Be careful!", { type: "warning" }),
  },
  {
    label: "Loading",
    code: 'toast.loading("Loading data...")',
    onClick: () => tracked("Loading data...", { type: "loading" }),
  },
];

export function TypesSection() {
  return (
    <DemoSection
      description="All 6 toast type variants: default, success, error, info, warning, loading"
      title="Types"
    >
      <div style={gridStyle}>
        {buttons.map((btn) => (
          <DemoCard key={btn.label} {...btn} />
        ))}
      </div>
    </DemoSection>
  );
}
