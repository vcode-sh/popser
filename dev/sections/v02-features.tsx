import { toast } from "popser";
import { createElement } from "react";
import type { DemoButton } from "../components.js";
import { DemoCard, DemoSection } from "../components.js";
import { gridStyle } from "../styles.js";
import { decrement, increment, tracked } from "../toast-counter.js";

const buttons: DemoButton[] = [
  {
    label: "toast.message()",
    code: `toast.message("Something happened", {\n  description: "This is a message toast",\n})`,
    onClick: () =>
      tracked("Something happened", {
        type: "default",
        description: "This is a message toast",
      }),
  },
  {
    label: "toast.custom()",
    code: "toast.custom((id) => (\n  <div style={{ padding: 16 }}>\n    Custom JSX! <button onClick={() => toast.close(id)}>Close</button>\n  </div>\n))",
    onClick: () => {
      increment();
      toast.custom(
        (id) =>
          createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                background: "#fff",
                borderRadius: 8,
                border: "1px solid #e5e5e5",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: 14,
              },
            },
            createElement("span", null, "Custom JSX toast!"),
            createElement(
              "button",
              {
                onClick: () => {
                  toast.close(id);
                  decrement();
                },
                style: {
                  marginLeft: "auto",
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid #e5e5e5",
                  borderRadius: 6,
                  background: "#fff",
                  cursor: "pointer",
                },
              },
              "Close"
            )
          ),
        { timeout: 0 }
      );
    },
  },
  {
    label: "Lazy Promise",
    code: `toast.promise(\n  () => fetch("/api/data").then(r => r.json()),\n  {\n    loading: "Fetching...",\n    success: "Fetched!",\n    error: "Request failed",\n  }\n)`,
    onClick: () => {
      increment();
      toast.promise(
        () =>
          new Promise<string>((resolve) =>
            setTimeout(() => resolve("ok"), 2000)
          ),
        { loading: "Fetching...", success: "Fetched!", error: "Request failed" }
      );
      setTimeout(() => decrement(), 6500);
    },
  },
  {
    label: "Extended Promise Result",
    code: `toast.promise(asyncFn(), {\n  loading: "Processing...",\n  success: (data) => ({\n    title: "Processed!",\n    icon: <span>\u2728</span>,\n    timeout: 8000,\n    action: { label: "View", onClick: ... },\n  }),\n  error: "Failed",\n})`,
    onClick: () => {
      increment();
      toast.promise(
        new Promise<{ count: number }>((resolve) =>
          setTimeout(() => resolve({ count: 42 }), 2000)
        ),
        {
          loading: "Processing...",
          success: (data) => ({
            title: `Processed ${data.count} items`,
            icon: createElement("span", null, "\u2728"),
            timeout: 8000,
            action: {
              label: "View",
              onClick: () => console.log("[popser] View clicked"),
            },
          }),
          error: "Failed",
        }
      );
      setTimeout(() => decrement(), 10500);
    },
  },
  {
    label: "Promise with finally",
    code: `toast.promise(asyncFn(), {\n  loading: "Saving...",\n  success: "Saved!",\n  error: "Save failed",\n  finally: () => console.log("Cleanup done"),\n})`,
    onClick: () => {
      increment();
      toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 2000)), {
        loading: "Saving...",
        success: "Saved!",
        error: "Save failed",
        finally: () => console.log("[popser] finally: cleanup done"),
      });
      setTimeout(() => decrement(), 6500);
    },
  },
  {
    label: "Per-state Description",
    code: `toast.promise(asyncFn(), {\n  loading: "Uploading...",\n  success: "Uploaded!",\n  error: "Upload failed",\n  description: (data) => \`\${data.size} bytes\`,\n})`,
    onClick: () => {
      increment();
      toast.promise(
        new Promise<{ size: number }>((resolve) =>
          setTimeout(() => resolve({ size: 1024 }), 2000)
        ),
        {
          loading: "Uploading...",
          success: (data) => `Uploaded ${data.size} bytes`,
          error: "Upload failed",
        }
      );
      setTimeout(() => decrement(), 6500);
    },
  },
  {
    label: "Success returns undefined",
    code: `toast.promise(asyncFn(), {\n  loading: "Syncing...",\n  success: () => undefined, // auto-dismiss\n  error: "Sync failed",\n})`,
    onClick: () => {
      increment();
      toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 2000)), {
        loading: "Syncing...",
        success: () => undefined,
        error: "Sync failed",
      });
      setTimeout(() => decrement(), 3000);
    },
  },
  {
    label: "Per-toast classNames",
    code: `toast.success("Styled toast", {\n  classNames: {\n    root: "my-root",\n    title: "my-title",\n    description: "my-desc",\n  },\n})`,
    onClick: () =>
      tracked("Styled toast", {
        type: "success",
        description: "Check DOM for class names",
        classNames: {
          root: "my-custom-root",
          title: "my-custom-title",
          description: "my-custom-desc",
        },
      }),
  },
  {
    label: "Per-toast unstyled",
    code: `toast("Unstyled toast", {\n  unstyled: true,\n  description: "No default styles applied",\n})`,
    onClick: () =>
      tracked("Unstyled toast", {
        unstyled: true,
        description: "No default styles applied",
      }),
  },
  {
    label: "Action as ReactNode",
    code: `toast("Deploy ready", {\n  action: <button style={...}>Deploy Now</button>,\n  cancel: <button style={...}>Later</button>,\n})`,
    onClick: () =>
      tracked("Deploy ready", {
        action: createElement(
          "button",
          {
            onClick: () => console.log("[popser] Deploy clicked"),
            style: {
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 600,
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            },
          },
          "Deploy Now"
        ),
        cancel: createElement(
          "button",
          {
            onClick: () => console.log("[popser] Later clicked"),
            style: {
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 500,
              background: "transparent",
              color: "#666",
              border: "1px solid #e5e5e5",
              borderRadius: 4,
              cursor: "pointer",
            },
          },
          "Later"
        ),
      }),
  },
  {
    label: "Per-toast richColors",
    code: `toast.success("Rich success!", {\n  richColors: true,\n})\n// Overrides global richColors setting`,
    onClick: () =>
      tracked("Rich success!", {
        type: "success",
        richColors: true,
        description: "Per-toast richColors override",
      }),
  },
  {
    label: "Callbacks with ID",
    code: `toast("Watch the console", {\n  onAutoClose: (id) => console.log("auto-closed:", id),\n  onDismiss: (id) => console.log("dismissed:", id),\n  onClose: (id) => console.log("closed:", id),\n})`,
    onClick: () =>
      tracked("Watch the console", {
        timeout: 4000,
        onAutoClose: (id) => console.log("[popser] onAutoClose, id:", id),
        onDismiss: (id) => console.log("[popser] onDismiss, id:", id),
        onClose: (id) => console.log("[popser] onClose, id:", id),
      }),
  },
];

export function V02FeaturesSection() {
  return (
    <DemoSection
      description="New in v0.2.0: toast.message(), toast.custom(), enhanced promises, per-toast styling, ReactNode actions, richColors override, callbacks with ID"
      title="v0.2.0 Features"
    >
      <div style={gridStyle}>
        {buttons.map((btn) => (
          <DemoCard key={btn.label} {...btn} />
        ))}
      </div>
    </DemoSection>
  );
}
