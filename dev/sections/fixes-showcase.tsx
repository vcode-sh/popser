import { toast } from "popser";
import { DemoSection } from "../components.js";
import { colors, gridStyle } from "../styles.js";
import { decrement, increment, tracked } from "../toast-counter.js";

const cardStyle: React.CSSProperties = {
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

const descStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.5,
  color: colors.textMuted,
};

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  fontSize: 10,
  fontWeight: 600,
  padding: "2px 6px",
  borderRadius: 4,
  background: colors.green,
  color: "#fff",
  letterSpacing: "0.03em",
  textTransform: "uppercase",
};

function FixCard({
  label,
  description,
  tag,
  onClick,
}: {
  label: string;
  description: string;
  tag: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.hoverBorder;
        e.currentTarget.style.boxShadow = colors.hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.boxShadow = "none";
      }}
      style={cardStyle}
      type="button"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={tagStyle}>{tag}</span>
        <span style={labelStyle}>{label}</span>
      </div>
      <span style={descStyle}>{description}</span>
    </button>
  );
}

export function FixesShowcaseSection() {
  return (
    <DemoSection
      description="Tap each card to see the fix in action"
      title="Fixes Showcase"
    >
      <div style={gridStyle}>
        <FixCard
          description="Toggle theme above to dark/system. The toast viewport and the entire demo page now follow the OS color scheme when set to 'system'."
          label="System Theme Detection"
          onClick={() =>
            tracked("Try switching theme to 'system' above", {
              type: "info",
              description:
                "Toasts now resolve system → light/dark from prefers-color-scheme",
              timeout: 6000,
            })
          }
          tag="fixed"
        />
        <FixCard
          description="Hover the toast stack to see toasts smoothly fan out. Move away to see them collapse back. The transition uses cumulative height offsets instead of flex layout."
          label="Smooth Expand / Collapse"
          onClick={() => {
            for (let i = 0; i < 4; i++) {
              tracked(`Toast ${i + 1} — hover the stack`, {
                type: (["success", "error", "info", "warning"] as const)[i],
                timeout: 12000,
              });
            }
          }}
          tag="new"
        />
        <FixCard
          description="Bottom toasts now slide down on exit (same direction as entry) instead of sliding up into the stack. Top toasts slide up correctly."
          label="Exit Animation Direction"
          onClick={() => {
            tracked("Watch me exit downward", {
              type: "success",
              timeout: 3000,
              description: "I'll auto-dismiss in 3s — watch the direction",
            });
          }}
          tag="fixed"
        />
        <FixCard
          description="All transitions now use cubic-bezier(0.32, 0.72, 0, 1) for a snappy, polished feel. GPU-accelerated with will-change hints."
          label="Polished Easing Curve"
          onClick={() => {
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                tracked(`Easing demo ${i + 1}`, {
                  type: (["info", "success", "warning"] as const)[i],
                  timeout: 5000,
                });
              }, i * 400);
            }
          }}
          tag="new"
        />
        <FixCard
          description="In expanded mode, invisible pseudo-elements fill the gap between toasts so your cursor never 'falls through'. No more flicker."
          label="Gap-Filling Hover"
          onClick={() => {
            for (let i = 0; i < 4; i++) {
              tracked(`Move your mouse between us (${i + 1}/4)`, {
                type: "info",
                timeout: 12000,
              });
            }
          }}
          tag="fixed"
        />
        <FixCard
          description="On mobile viewports, top-positioned toasts now correctly remap to bottom-center stacking. Animations, transform-origin, and direction all align."
          label="Mobile + Top Position"
          onClick={() =>
            tracked("Mobile position fix applied", {
              type: "success",
              description:
                "Resize to < 600px with position 'top-right' — toasts stack correctly at bottom",
              timeout: 8000,
            })
          }
          tag="fixed"
        />
        <FixCard
          description="Action button hover now uses brightness filter. Arrow has matching border. Spinner uses CSS containment. Mobile close button is more visible."
          label="CSS Polish"
          onClick={() => {
            tracked("Check the action button hover", {
              type: "info",
              timeout: 0,
              action: { label: "Hover Me", onClick: () => toast.info("Nice!") },
              cancel: { label: "Cancel" },
              description: "Hover the action button to see brightness filter",
            });
          }}
          tag="new"
        />
        <FixCard
          description="Content of non-front toasts fades via a single opacity on the container instead of per-child opacity. Fewer compositor layers."
          label="Optimized Content Fade"
          onClick={() => {
            for (let i = 0; i < 3; i++) {
              tracked(`Stacked toast ${i + 1}`, {
                type: (["success", "info", "warning"] as const)[i],
                description: "Non-front toasts fade content at container level",
                timeout: 8000,
              });
            }
          }}
          tag="perf"
        />
        <FixCard
          description="Create a loading toast, then watch it transition to success. The entire update is smooth — type, icon, and content all animate."
          label="Loading → Success"
          onClick={() => {
            increment();
            const id = toast.loading("Processing your request...");
            setTimeout(() => {
              toast.update(id, {
                title: "Request complete!",
                type: "success",
                timeout: 4000,
                description: "Smooth transition from loading state",
              });
              setTimeout(() => decrement(), 4500);
            }, 2500);
          }}
          tag="demo"
        />
      </div>
    </DemoSection>
  );
}
