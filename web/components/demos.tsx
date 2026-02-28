"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { toast } from "@vcui/popser";
import { type ReactNode, useRef } from "react";

function DemoBox({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-4 flex flex-wrap justify-center gap-2 rounded-xl border border-fd-border bg-fd-card/50 p-6">
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
    <button className={buttonClass} onClick={onClick} type="button">
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
        onClick={() => toast.error("Connection lost", { deduplicate: true })}
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
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: "Fetching data...",
            success: "Data loaded",
            error: "Failed to fetch",
          });
        }}
      >
        Run promise
      </DemoButton>
    </DemoBox>
  );
}

const customToastStyle = {
  background: "var(--popser-bg)",
  border: "1px solid var(--popser-border)",
  borderRadius: "var(--popser-radius, 8px)",
  boxShadow: "var(--popser-shadow)",
  padding: 12,
  color: "var(--popser-fg)",
};

export function CustomDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() => {
          toast.custom(
            (id: string) => (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
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
                  onClick={() => toast.close(id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0.5,
                    fontSize: 18,
                    padding: "0 4px",
                  }}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ),
            { style: customToastStyle }
          );
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
      <DemoButton onClick={() => toast.success("Saved", { richColors: true })}>
        Success
      </DemoButton>
      <DemoButton onClick={() => toast.error("Failed", { richColors: true })}>
        Error
      </DemoButton>
      <DemoButton onClick={() => toast.info("Heads up", { richColors: true })}>
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
        className={buttonClass}
        onClick={() => {
          toast.success("Copied to clipboard", {
            anchor: ref.current,
            anchorSide: "top",
            arrow: true,
            timeout: 2000,
          });
        }}
        ref={ref}
        type="button"
      >
        Anchored toast
      </button>
    </DemoBox>
  );
}

export function AnchorSidesDemo() {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <DemoBox>
      <div className="flex flex-col items-center gap-3">
        <DemoButton
          onClick={() => {
            toast.info("Top", {
              anchor: ref.current,
              anchorSide: "top",
              arrow: true,
              timeout: 2000,
            });
          }}
        >
          Top
        </DemoButton>
        <div className="flex gap-2">
          <DemoButton
            onClick={() => {
              toast.info("Left", {
                anchor: ref.current,
                anchorSide: "left",
                arrow: true,
                timeout: 2000,
              });
            }}
          >
            Left
          </DemoButton>
          <button
            className="rounded-lg border border-purple-500/50 border-dashed bg-purple-500/5 px-6 py-3 text-purple-500 text-xs"
            ref={ref}
            type="button"
          >
            anchor
          </button>
          <DemoButton
            onClick={() => {
              toast.info("Right", {
                anchor: ref.current,
                anchorSide: "right",
                arrow: true,
                timeout: 2000,
              });
            }}
          >
            Right
          </DemoButton>
        </div>
        <DemoButton
          onClick={() => {
            toast.info("Bottom", {
              anchor: ref.current,
              anchorSide: "bottom",
              arrow: true,
              timeout: 2000,
            });
          }}
        >
          Bottom
        </DemoButton>
      </div>
    </DemoBox>
  );
}

export function AnchorClickDemo() {
  return (
    <DemoBox>
      <button
        className={buttonClass}
        onClick={(e: ReactMouseEvent<HTMLButtonElement>) => {
          toast.success("Right where you clicked", {
            anchor: e.nativeEvent,
            anchorOffset: 16,
            arrow: true,
            timeout: 2000,
          });
        }}
        type="button"
      >
        Click anywhere on me
      </button>
    </DemoBox>
  );
}

export function AnchorArrowDemo() {
  const arrowRef = useRef<HTMLButtonElement>(null);
  const noArrowRef = useRef<HTMLButtonElement>(null);

  return (
    <DemoBox>
      <button
        className={buttonClass}
        onClick={() => {
          toast.success("With arrow", {
            anchor: arrowRef.current,
            anchorSide: "top",
            arrow: true,
            timeout: 2000,
          });
        }}
        ref={arrowRef}
        type="button"
      >
        Arrow toast
      </button>
      <button
        className={buttonClass}
        onClick={() => {
          toast.info("No arrow", {
            anchor: noArrowRef.current,
            anchorSide: "top",
            timeout: 2000,
          });
        }}
        ref={noArrowRef}
        type="button"
      >
        No arrow
      </button>
    </DemoBox>
  );
}

export function CustomNotificationDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() => {
          toast.custom(
            (id: string) => (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  D
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
                    Deployment complete
                  </p>
                  <p style={{ fontSize: 13, margin: 0, opacity: 0.6 }}>
                    Production build deployed
                  </p>
                </div>
                <button
                  onClick={() => toast.close(id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0.4,
                    fontSize: 18,
                    padding: "0 4px",
                  }}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ),
            { style: customToastStyle }
          );
        }}
      >
        Notification card
      </DemoButton>
      <DemoButton
        onClick={() => {
          toast.custom(
            (id: string) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
                  Delete this item?
                </p>
                <p style={{ fontSize: 13, margin: 0, opacity: 0.6 }}>
                  This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => {
                      toast.close(id);
                      toast.error("Deleted");
                    }}
                    style={{
                      padding: "6px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      borderRadius: 6,
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      cursor: "pointer",
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toast.close(id)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      borderRadius: 6,
                      border: "1px solid var(--popser-border)",
                      background: "transparent",
                      cursor: "pointer",
                      color: "var(--popser-fg)",
                    }}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ),
            { timeout: 0, style: customToastStyle }
          );
        }}
      >
        Confirm dialog
      </DemoButton>
    </DemoBox>
  );
}

export function CustomAnchoredDemo() {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <DemoBox>
      <button
        className={buttonClass}
        onClick={() => {
          toast.custom(
            (id: string) => (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13 }}>Copied to clipboard</span>
                <button
                  onClick={() => toast.close(id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0.4,
                    fontSize: 14,
                  }}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ),
            {
              anchor: ref.current,
              anchorSide: "top",
              arrow: true,
              timeout: 2000,
              style: customToastStyle,
            }
          );
        }}
        ref={ref}
        type="button"
      >
        Custom + anchored
      </button>
    </DemoBox>
  );
}

export function StyleDemo() {
  return (
    <DemoBox>
      <DemoButton
        onClick={() =>
          toast.success("Saved", {
            style: {
              borderLeft: "4px solid #22c55e",
            },
          })
        }
      >
        Custom border
      </DemoButton>
      <DemoButton
        onClick={() =>
          toast.error("Something broke", {
            style: {
              borderLeft: "4px solid #ef4444",
            },
          })
        }
      >
        Error accent
      </DemoButton>
      <DemoButton
        onClick={() =>
          toast("Minimal", {
            icon: false,
            style: {
              fontFamily: "monospace",
              fontSize: 13,
            },
          })
        }
      >
        Monospace, no icon
      </DemoButton>
    </DemoBox>
  );
}
