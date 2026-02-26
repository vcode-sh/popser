import { toast } from "popser";
import { useRef } from "react";
import type { DemoButton } from "../components.js";
import { DemoCard, DemoSection } from "../components.js";
import { gridStyle } from "../styles.js";
import { closeAll, decrement, increment, tracked } from "../toast-counter.js";

export function LifecycleSection() {
  const lastToastId = useRef<string | null>(null);

  const buttons: DemoButton[] = [
    {
      label: "Promise (2s delay)",
      code: `toast.promise(asyncFn(), {\n  loading: "Loading...",\n  success: "Done!",\n  error: "Failed",\n})`,
      onClick: () => {
        increment();
        toast.promise(
          new Promise<void>((resolve) => setTimeout(resolve, 2000)),
          { loading: "Loading...", success: "Done!", error: "Failed" }
        );
        setTimeout(() => decrement(), 6500);
      },
    },
    {
      label: "Promise (rejects)",
      code: `toast.promise(failingFn(), {\n  loading: "Trying...",\n  success: "Done!",\n  error: (err) => \`Failed: \${err}\`,\n})`,
      onClick: () => {
        increment();
        toast.promise(
          new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error("Network error")), 2000)
          ),
          {
            loading: "Trying...",
            success: "Done!",
            error: (err) =>
              `Failed: ${err instanceof Error ? err.message : String(err)}`,
          }
        );
        setTimeout(() => decrement(), 6500);
      },
    },
    {
      label: "Persistent (no auto-dismiss)",
      code: `toast("Persistent toast", { timeout: 0 })`,
      onClick: () => tracked("Persistent toast", { timeout: 0 }),
    },
    {
      label: "Update (loading -> success)",
      code: `const id = toast.loading("Uploading...");\nsetTimeout(() => {\n  toast.update(id, {\n    title: "Upload complete!",\n    type: "success",\n    timeout: 4000,\n  });\n}, 2000);`,
      onClick: () => {
        increment();
        const id = toast.loading("Uploading...");
        setTimeout(() => {
          toast.update(id, {
            title: "Upload complete!",
            type: "success",
            timeout: 4000,
          });
          setTimeout(() => decrement(), 4500);
        }, 2000);
      },
    },
    {
      label: "Create Toast (save ID)",
      code: `const id = toast("Close me via button below");\nlastToastId.current = id;`,
      onClick: () => {
        const id = tracked("Close me via button below");
        lastToastId.current = id;
      },
    },
    {
      label: "Close Last Toast by ID",
      code: "toast.close(lastToastId.current)",
      onClick: () => {
        if (lastToastId.current) {
          toast.close(lastToastId.current);
          decrement();
          lastToastId.current = null;
        }
      },
    },
    {
      label: "toast.dismiss() (Sonner alias)",
      code: "toast.dismiss(id) // alias for toast.close(id)",
      onClick: () => {
        const id = tracked("Dismiss me with Sonner API");
        setTimeout(() => {
          toast.dismiss(id);
          decrement();
        }, 2000);
      },
    },
    {
      label: "toast.getToasts()",
      code: `const ids = toast.getToasts();\nconsole.log(ids); // ["id1", "id2", ...]`,
      onClick: () => {
        const ids = toast.getToasts();
        console.log("[popser] Active toast IDs:", ids);
        tracked(`${ids.length} active toast(s)`, {
          type: "info",
          description: ids.length > 0 ? `IDs: ${ids.join(", ")}` : undefined,
        });
      },
    },
    {
      label: "Close All Toasts",
      code: "toast.close()",
      onClick: closeAll,
    },
  ];

  return (
    <DemoSection
      description="Promise handling, updates, close/dismiss, getToasts"
      title="Lifecycle"
    >
      <div style={gridStyle}>
        {buttons.map((btn) => (
          <DemoCard key={btn.label} {...btn} />
        ))}
      </div>
    </DemoSection>
  );
}
