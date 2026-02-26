import type { DemoButton } from "../components.js";
import { DemoCard, DemoSection } from "../components.js";
import { gridStyle } from "../styles.js";
import { tracked } from "../toast-counter.js";

const buttons: DemoButton[] = [
  {
    label: "With Description",
    code: `toast.success("Changes saved", {\n  description: "Your document has been updated.",\n})`,
    onClick: () =>
      tracked("Changes saved", {
        type: "success",
        description: "Your document has been updated.",
      }),
  },
  {
    label: "With Action Button",
    code: `toast("File deleted", {\n  action: { label: "Undo", onClick: ... },\n})`,
    onClick: () =>
      tracked("File deleted", {
        action: { label: "Undo", onClick: () => console.log("undo") },
      }),
  },
  {
    label: "Action + Cancel",
    code: `toast("Confirm changes?", {\n  action: { label: "Confirm" },\n  cancel: { label: "Cancel" },\n})`,
    onClick: () =>
      tracked("Confirm changes?", {
        action: { label: "Confirm", onClick: () => console.log("confirmed") },
        cancel: { label: "Cancel", onClick: () => console.log("cancelled") },
      }),
  },
  {
    label: "Custom Icon",
    code: `toast.success("Custom icon", {\n  icon: <span>✨</span>,\n})`,
    onClick: () =>
      tracked("Custom icon", { type: "success", icon: <span>✨</span> }),
  },
  {
    label: "No Icon",
    code: `toast.success("No icon shown", {\n  icon: false,\n})`,
    onClick: () => tracked("No icon shown", { type: "success", icon: false }),
  },
  {
    label: "High Priority",
    code: `toast("Urgent notification!", {\n  priority: "high",\n})`,
    onClick: () => tracked("Urgent notification!", { priority: "high" }),
  },
];

export function ContentSection() {
  return (
    <DemoSection
      description="Description text, action buttons, custom icons, priority levels"
      title="Content"
    >
      <div style={gridStyle}>
        {buttons.map((btn) => (
          <DemoCard key={btn.label} {...btn} />
        ))}
      </div>
    </DemoSection>
  );
}
