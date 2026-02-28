"use client";

import { toast } from "@vcui/popser";
import { useRef, type ReactNode } from "react";

function DemoBox({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-4 rounded-xl border border-fd-border bg-fd-card/50 p-6 flex flex-wrap gap-2 justify-center">
      {children}
    </div>
  );
}

const buttonClass =
  "rounded-lg border border-fd-border bg-fd-secondary px-4 py-2 text-sm font-medium cursor-pointer transition-colors hover:bg-fd-accent";

function DemoButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}

export function TypesDemo() {
  return (
    <DemoBox>
      <DemoButton onClick={() => toast("Hello world")}>Default</DemoButton>
      <DemoButton onClick={() => toast.success("Saved")}>Success</DemoButton>
      <DemoButton onClick={() => toast.error("Something broke")}>
        Error
      </DemoButton>
      <DemoButton onClick={() => toast.info("Heads up")}>Info</DemoButton>
      <DemoButton onClick={() => toast.warning("Careful")}>Warning</DemoButton>
      <DemoButton onClick={() => toast.loading("Loading...")}>
        Loading
      </DemoButton>
    </DemoBox>
  );
}

export function DescriptionDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() =>
          toast("With description", { description: "More detail here" })
        }
      >
        With description
      </DemoButton>
    </DemoBox>
  );
}

export function ActionsDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() =>
          toast.success("File uploaded", {
            action: {
              label: "View",
              onClick: () => toast.info("Viewing file..."),
            },
            cancel: {
              label: "Undo",
              onClick: () => toast("Upload undone"),
            },
          })
        }
      >
        With actions
      </DemoButton>
    </DemoBox>
  );
}

export function UpdateDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() => {
          const id = toast.loading("Uploading...");
          setTimeout(() => {
            toast.update(id, {
              title: "Upload complete",
              description: "file.pdf",
              type: "success",
              timeout: 3000,
            });
          }, 2000);
        }}
      >
        Loading → Update
      </DemoButton>
    </DemoBox>
  );
}

export function CloseDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() => {
          const id = toast("This will be closed");
          setTimeout(() => toast.close(id), 1500);
        }}
      >
        Close specific
      </DemoButton>
      <DemoButton
        onClick={() => {
          toast("Toast one");
          toast("Toast two");
          toast("Toast three");
          setTimeout(() => toast.close(), 1500);
        }}
      >
        Close all
      </DemoButton>
    </DemoBox>
  );
}

export function DedupDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() =>
          toast.error("Connection lost", { deduplicate: true })
        }
      >
        Spam this button
      </DemoButton>
    </DemoBox>
  );
}

export function PromiseDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() => {
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: "Fetching data...",
              success: "Data loaded",
              error: "Failed to fetch",
            },
          );
        }}
      >
        Run promise
      </DemoButton>
    </DemoBox>
  );
}

export function CustomDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() => {
          toast.custom((id) => (
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: 4,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
                  New message
                </p>
                <p
                  style={{
                    fontSize: 13,
                    margin: 0,
                    opacity: 0.7,
                  }}
                >
                  Hey, are you coming to the meeting?
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.close(id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  opacity: 0.5,
                  fontSize: 18,
                  padding: "0 4px",
                }}
              >
                ✕
              </button>
            </div>
          ));
        }}
      >
        Custom toast
      </DemoButton>
    </DemoBox>
  );
}

export function RichColorsDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() => toast.success("Saved", { richColors: true })}
      >
        Success
      </DemoButton>
      <DemoButton
        onClick={() => toast.error("Failed", { richColors: true })}
      >
        Error
      </DemoButton>
      <DemoButton
        onClick={() => toast.info("Heads up", { richColors: true })}
      >
        Info
      </DemoButton>
      <DemoButton
        onClick={() => toast.warning("Careful", { richColors: true })}
      >
        Warning
      </DemoButton>
    </DemoBox>
  );
}

export function AnchoredDemo() {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <DemoBox>
      <button
        ref={ref}
        type="button"
        className={buttonClass}
        onClick={() => {
          toast.success("Copied to clipboard", {
            anchor: ref.current,
            anchorSide: "top",
            arrow: true,
            timeout: 2000,
          });
        }}
      >
        Anchored toast
      </button>
    </DemoBox>
  );
}
