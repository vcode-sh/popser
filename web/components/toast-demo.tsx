"use client";

import { Toaster, toast } from "@vcui/popser";
import "@vcui/popser/styles";

const buttonStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "1px solid var(--color-fd-border)",
  backgroundColor: "var(--color-fd-secondary)",
  fontSize: "0.875rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background-color 0.15s",
} as const;

export function ToastDemo() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
        }}
      >
        <button onClick={() => toast("Hello world")} style={buttonStyle}>
          Default
        </button>
        <button onClick={() => toast.success("Success!")} style={buttonStyle}>
          Success
        </button>
        <button
          onClick={() => toast.error("Something broke")}
          style={buttonStyle}
        >
          Error
        </button>
        <button onClick={() => toast.info("Heads up")} style={buttonStyle}>
          Info
        </button>
        <button
          onClick={() => toast.warning("Careful now")}
          style={buttonStyle}
        >
          Warning
        </button>
        <button onClick={() => toast.loading("Loading...")} style={buttonStyle}>
          Loading
        </button>
        <button
          onClick={() => {
            toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
              loading: "Uploading...",
              success: "Upload complete!",
              error: "Upload failed",
            });
          }}
          style={buttonStyle}
        >
          Promise
        </button>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
