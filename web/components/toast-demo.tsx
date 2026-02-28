"use client";

import { toast, Toaster } from "@vcui/popser";
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
        <button style={buttonStyle} onClick={() => toast("Hello world")}>
          Default
        </button>
        <button
          style={buttonStyle}
          onClick={() => toast.success("Success!")}
        >
          Success
        </button>
        <button
          style={buttonStyle}
          onClick={() => toast.error("Something broke")}
        >
          Error
        </button>
        <button style={buttonStyle} onClick={() => toast.info("Heads up")}>
          Info
        </button>
        <button
          style={buttonStyle}
          onClick={() => toast.warning("Careful now")}
        >
          Warning
        </button>
        <button
          style={buttonStyle}
          onClick={() => toast.loading("Loading...")}
        >
          Loading
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: "Uploading...",
                success: "Upload complete!",
                error: "Upload failed",
              },
            );
          }}
        >
          Promise
        </button>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
