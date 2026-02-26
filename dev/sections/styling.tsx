import type { DemoButton } from "../components.js";
import { DemoCard, DemoSection } from "../components.js";
import { gridStyle } from "../styles.js";
import { tracked } from "../toast-counter.js";

const buttons: DemoButton[] = [
  {
    label: "Custom className",
    code: `toast("Styled via className", {\n  className: "my-custom-toast",\n})`,
    onClick: () =>
      tracked("Styled via className", { className: "my-custom-toast" }),
  },
  {
    label: "Inline Style",
    code: `toast.success("Custom background", {\n  style: {\n    background: "#065f46",\n    color: "#ecfdf5",\n    border: "1px solid #059669",\n  },\n})`,
    onClick: () =>
      tracked("Custom background", {
        type: "success",
        style: {
          background: "#065f46",
          color: "#ecfdf5",
          border: "1px solid #059669",
        },
      }),
  },
  {
    label: "Bold Gradient Style",
    code: `toast("Gradient toast", {\n  style: {\n    background: "linear-gradient(135deg, #667eea, #764ba2)",\n    color: "#fff",\n    border: "none",\n  },\n})`,
    onClick: () =>
      tracked("Gradient toast", {
        style: {
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          color: "#fff",
          border: "none",
        },
      }),
  },
  {
    label: "Custom Data",
    code: `toast("With metadata", {\n  data: { source: "api", requestId: "abc-123" },\n})`,
    onClick: () => {
      tracked("With metadata (check console)", {
        data: { source: "api", requestId: "abc-123" },
        onClose: () =>
          console.log(
            "[popser] Toast closed, data: { source: 'api', requestId: 'abc-123' }"
          ),
      });
    },
  },
];

export function StylingSection() {
  return (
    <DemoSection
      description="Per-toast className, inline style, and custom data"
      title="Styling"
    >
      <div style={gridStyle}>
        {buttons.map((btn) => (
          <DemoCard key={btn.label} {...btn} />
        ))}
      </div>
    </DemoSection>
  );
}
