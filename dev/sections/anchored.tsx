import { toast } from "popser";
import { useRef } from "react";
import { DemoSection } from "../components.js";
import { colors, gridStyle } from "../styles.js";
import { decrement, increment } from "../toast-counter.js";

const anchorButtonStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "12px 14px",
  fontSize: 13,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  background: colors.card,
  cursor: "pointer",
  textAlign: "left",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 13,
  color: colors.text,
};

const codeStyle: React.CSSProperties = {
  fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
  fontSize: 11,
  lineHeight: 1.5,
  color: colors.textMuted,
  background: colors.codeBackground,
  border: `1px solid ${colors.codeBorder}`,
  borderRadius: 5,
  padding: "6px 8px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
};

function AnchorCard({
  label,
  code,
  onClick,
}: {
  label: string;
  code: string;
  onClick: (el: HTMLButtonElement, event: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      onClick={(event) => {
        if (ref.current) {
          onClick(ref.current, event);
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#c0c0c0";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.boxShadow = "none";
      }}
      ref={ref}
      style={anchorButtonStyle}
      type="button"
    >
      <span style={labelStyle}>{label}</span>
      <code style={codeStyle}>{code}</code>
    </button>
  );
}

function trackedAnchored(
  title: string,
  anchor: Element | MouseEvent | { x: number; y: number },
  options: Parameters<typeof toast>[1] = {}
) {
  increment();
  return toast(title, {
    ...options,
    anchor,
    onClose: () => {
      decrement();
      options.onClose?.("");
    },
  });
}

export function AnchoredSection() {
  return (
    <DemoSection
      description="Toasts positioned relative to a DOM element using Toast.Positioner"
      title="Anchored Toasts"
    >
      <div style={gridStyle}>
        <AnchorCard
          code={`toast("Copied!", {\n  anchor: buttonRef.current,\n})`}
          label="Basic Anchor"
          onClick={(el) => trackedAnchored("Copied!", el)}
        />
        <AnchorCard
          code={`toast("Copied!", {\n  anchor: el,\n  anchorSide: "top",\n})`}
          label="Anchor Top"
          onClick={(el) =>
            trackedAnchored("Anchored to top", el, { anchorSide: "top" })
          }
        />
        <AnchorCard
          code={`toast("Saved", {\n  anchor: el,\n  anchorSide: "right",\n})`}
          label="Anchor Right"
          onClick={(el) =>
            trackedAnchored("Anchored to right", el, { anchorSide: "right" })
          }
        />
        <AnchorCard
          code={`toast("Saved", {\n  anchor: el,\n  anchorSide: "left",\n})`}
          label="Anchor Left"
          onClick={(el) =>
            trackedAnchored("Anchored to left", el, { anchorSide: "left" })
          }
        />
        <AnchorCard
          code={`toast("Field required", {\n  anchor: el,\n  arrow: true,\n})`}
          label="With Arrow"
          onClick={(el) =>
            trackedAnchored("Field required", el, { arrow: true })
          }
        />
        <AnchorCard
          code={`toast("Field required", {\n  anchor: el,\n  anchorSide: "top",\n  arrow: true,\n})`}
          label="Arrow Top"
          onClick={(el) =>
            trackedAnchored("Arrow pointing down", el, {
              anchorSide: "top",
              arrow: true,
            })
          }
        />
        <AnchorCard
          code={`toast.success("Saved!", {\n  anchor: el,\n  arrow: true,\n})`}
          label="Success + Arrow"
          onClick={(el) => {
            increment();
            toast.success("Saved!", {
              anchor: el,
              arrow: true,
              onClose: () => decrement(),
            });
          }}
        />
        <AnchorCard
          code={`toast.error("Invalid input", {\n  anchor: el,\n  anchorSide: "bottom",\n  anchorAlign: "start",\n  arrow: true,\n})`}
          label="Error + Align Start"
          onClick={(el) => {
            increment();
            toast.error("Invalid input", {
              anchor: el,
              anchorSide: "bottom",
              anchorAlign: "start",
              arrow: true,
              onClose: () => decrement(),
            });
          }}
        />
        <AnchorCard
          code={`toast("Custom offset", {\n  anchor: el,\n  anchorOffset: 20,\n  arrow: true,\n})`}
          label="Custom Offset (20px)"
          onClick={(el) =>
            trackedAnchored("Custom offset", el, {
              anchorOffset: 20,
              arrow: true,
            })
          }
        />
        <AnchorCard
          code={`toast.warning("Caution!", {\n  anchor: el,\n  anchorSide: "top",\n  anchorAlign: "end",\n  arrow: true,\n  richColors: true,\n})`}
          label="Rich Colors + Anchor"
          onClick={(el) => {
            increment();
            toast.warning("Caution!", {
              anchor: el,
              anchorSide: "top",
              anchorAlign: "end",
              arrow: true,
              richColors: true,
              onClose: () => decrement(),
            });
          }}
        />
        <AnchorCard
          code={`toast("Persistent", {\n  anchor: el,\n  arrow: true,\n  dismissible: false,\n  timeout: 0,\n})`}
          label="Non-dismissible Anchor"
          onClick={(el) =>
            trackedAnchored("Persistent anchored toast", el, {
              arrow: true,
              dismissible: false,
              timeout: 0,
            })
          }
        />
        <AnchorCard
          code={`toast("With description", {\n  anchor: el,\n  arrow: true,\n  description: "Extra context here",\n})`}
          label="Anchor + Description"
          onClick={(el) =>
            trackedAnchored("With description", el, {
              arrow: true,
              description: "Extra context shown below the title",
            })
          }
        />
        <AnchorCard
          code={`toast("Copied!", {\n  anchor: event,\n})`}
          label="Cursor Anchor"
          onClick={(_el, event) =>
            trackedAnchored("Copied at cursor!", event.nativeEvent)
          }
        />
        <AnchorCard
          code={`toast("Saved!", {\n  anchor: { x, y },\n})`}
          label="Coordinates Anchor"
          onClick={(_el, event) =>
            trackedAnchored("Saved at coords!", {
              x: event.clientX,
              y: event.clientY,
            })
          }
        />
      </div>
    </DemoSection>
  );
}
