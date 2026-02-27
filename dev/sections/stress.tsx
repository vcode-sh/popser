import { toast } from "popser";
import { DemoSection } from "../components.js";
import { pillStyle } from "../styles.js";
import { closeAll, tracked } from "../toast-counter.js";

const types = ["success", "error", "info", "warning"] as const;

export function StressSection() {
  return (
    <DemoSection
      description="Rapid-fire toast generation for stacking & performance testing"
      title="Stress Test"
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => {
            for (let i = 0; i < 20; i++) {
              tracked(`Toast #${i + 1} (${types[i % types.length]})`, {
                type: types[i % types.length],
                timeout: 0,
              });
            }
          }}
          style={pillStyle(false)}
          type="button"
        >
          Spam 20 persistent toasts
        </button>
        <button
          onClick={() => {
            for (let i = 0; i < 20; i++) {
              tracked(`Toast #${i + 1} (${types[i % types.length]})`, {
                type: types[i % types.length],
              });
            }
          }}
          style={pillStyle(false)}
          type="button"
        >
          Spam 20 auto-dismiss toasts
        </button>
        <button
          onClick={() => {
            for (let i = 0; i < 5; i++) {
              tracked("Dedup toast", { deduplicate: true, type: "info" });
            }
          }}
          style={pillStyle(false)}
          type="button"
        >
          Spam 5 deduplicated
        </button>
        <button
          onClick={() => {
            for (let i = 0; i < 10; i++) {
              const id = toast.loading(`Task #${i + 1}...`);
              setTimeout(
                () => {
                  toast.update(id, {
                    title: `Task #${i + 1} done!`,
                    type: "success",
                    timeout: 3000,
                  });
                },
                1000 + i * 500
              );
            }
          }}
          style={pillStyle(false)}
          type="button"
        >
          {"10 sequential loading->success"}
        </button>
        <button
          onClick={closeAll}
          style={{
            ...pillStyle(false),
            borderColor: "oklch(0.637 0.237 25)",
            color: "oklch(0.637 0.237 25)",
          }}
          type="button"
        >
          Close all
        </button>
      </div>
    </DemoSection>
  );
}
