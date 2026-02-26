import type { PopserPosition } from "popser";
import { Toaster, toast } from "popser";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import "popser/tokens";
import "popser/styles";

// ---------------------------------------------------------------------------
// Toast counter -- lightweight external store that tracks active toasts
// ---------------------------------------------------------------------------

let toastCount = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) {
    l();
  }
}

function increment() {
  toastCount++;
  emit();
}

function decrement() {
  toastCount = Math.max(0, toastCount - 1);
  emit();
}

function resetCount() {
  toastCount = 0;
  emit();
}

function useToastCount() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => toastCount
  );
}

/**
 * Wraps a toast call so we track its creation and auto-decrement on close.
 */
function tracked<T extends unknown[]>(
  fn: (...args: T) => string,
  ...args: T
): string {
  const originalArgs = [...args] as [...T];

  // Inject onClose into the options argument (second arg if it exists)
  const optionsIndex = originalArgs.length > 1 ? 1 : -1;
  if (optionsIndex >= 0 && typeof originalArgs[optionsIndex] === "object") {
    const opts = originalArgs[optionsIndex] as Record<string, unknown>;
    const prevOnClose = opts.onClose as (() => void) | undefined;
    opts.onClose = () => {
      decrement();
      prevOnClose?.();
    };
  } else if (originalArgs.length === 1) {
    // Only title provided, add options with onClose
    (originalArgs as unknown[]).push({ onClose: decrement });
  }

  increment();
  return fn(...(originalArgs as unknown as T));
}

// ---------------------------------------------------------------------------
// Positions & themes
// ---------------------------------------------------------------------------

const positions: PopserPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const themes = ["light", "dark", "system"] as const;

// ---------------------------------------------------------------------------
// Code snippet data -- each demo button has a label + code
// ---------------------------------------------------------------------------

interface DemoButton {
  code: string;
  label: string;
  onClick: () => void;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const colors = {
  bg: "#fafafa",
  card: "#ffffff",
  border: "#e5e5e5",
  borderLight: "#f0f0f0",
  text: "#111111",
  textMuted: "#666666",
  textFaint: "#999999",
  accent: "#111111",
  accentText: "#ffffff",
  codeBackground: "#f5f5f5",
  codeBorder: "#ebebeb",
  badgeBg: "#111111",
  badgeText: "#ffffff",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "0 24px 48px",
  fontFamily:
    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: colors.text,
  background: colors.bg,
  minHeight: "100vh",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 0",
  marginBottom: 32,
  borderBottom: `1px solid ${colors.border}`,
};

const headerLeftStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const packageNameStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const versionBadgeStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  padding: "2px 8px",
  borderRadius: 9999,
  background: colors.badgeBg,
  color: colors.badgeText,
  letterSpacing: "0.02em",
};

const toastCounterStyle = (count: number): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 500,
  color: count > 0 ? colors.text : colors.textFaint,
  padding: "6px 14px",
  borderRadius: 9999,
  background: count > 0 ? "#f0f0f0" : "transparent",
  border: `1px solid ${count > 0 ? colors.border : "transparent"}`,
  transition: "all 0.2s ease",
});

const counterDotStyle = (count: number): React.CSSProperties => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: count > 0 ? "#22c55e" : colors.border,
  transition: "background 0.2s ease",
});

const sectionStyle: React.CSSProperties = {
  marginBottom: 36,
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 12,
  marginBottom: 16,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: colors.text,
  letterSpacing: "-0.01em",
};

const sectionDescStyle: React.CSSProperties = {
  fontSize: 13,
  color: colors.textFaint,
  fontWeight: 400,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 10,
};

const demoButtonStyle: React.CSSProperties = {
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
  position: "relative",
};

const demoButtonLabelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 13,
  color: colors.text,
};

const demoButtonCodeStyle: React.CSSProperties = {
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

const controlRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
};

const controlGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 0",
};

const controlLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: colors.textFaint,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginRight: 2,
};

const selectStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 13,
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  background: colors.card,
  color: colors.text,
  cursor: "pointer",
};

const pillStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 500,
  border: `1px solid ${active ? colors.accent : colors.border}`,
  borderRadius: 9999,
  background: active ? colors.accent : colors.card,
  color: active ? colors.accentText : colors.text,
  cursor: "pointer",
  transition: "all 0.15s ease",
  whiteSpace: "nowrap",
});

const dividerStyle: React.CSSProperties = {
  width: 1,
  height: 24,
  background: colors.border,
  margin: "0 8px",
  flexShrink: 0,
};

// ---------------------------------------------------------------------------
// DemoCard component
// ---------------------------------------------------------------------------

function DemoCard({ label, code, onClick }: DemoButton) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#c0c0c0";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.boxShadow = "none";
      }}
      style={demoButtonStyle}
      type="button"
    >
      <span style={demoButtonLabelStyle}>{label}</span>
      <code style={demoButtonCodeStyle}>{code}</code>
    </button>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export function App() {
  const [position, setPosition] = useState<PopserPosition>("bottom-right");
  const [richColors, setRichColors] = useState(false);
  const [expand, setExpand] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const lastToastId = useRef<string | null>(null);
  const count = useToastCount();

  const closeAll = useCallback(() => {
    toast.close();
    resetCount();
  }, []);

  // -------------------------------------------------------------------------
  // Section: Types
  // -------------------------------------------------------------------------

  const typeButtons: DemoButton[] = [
    {
      label: "Default",
      code: 'toast("Hello world")',
      onClick: () => tracked(toast, "Hello world"),
    },
    {
      label: "Success",
      code: 'toast.success("Successfully saved!")',
      onClick: () =>
        tracked(
          (t: string, o?: Record<string, unknown>) => toast.success(t, o),
          "Successfully saved!",
          {}
        ),
    },
    {
      label: "Error",
      code: 'toast.error("Something went wrong")',
      onClick: () =>
        tracked(
          (t: string, o?: Record<string, unknown>) => toast.error(t, o),
          "Something went wrong",
          {}
        ),
    },
    {
      label: "Info",
      code: 'toast.info("Here is some info")',
      onClick: () =>
        tracked(
          (t: string, o?: Record<string, unknown>) => toast.info(t, o),
          "Here is some info",
          {}
        ),
    },
    {
      label: "Warning",
      code: 'toast.warning("Be careful!")',
      onClick: () =>
        tracked(
          (t: string, o?: Record<string, unknown>) => toast.warning(t, o),
          "Be careful!",
          {}
        ),
    },
    {
      label: "Loading",
      code: 'toast.loading("Loading data...")',
      onClick: () =>
        tracked(
          (t: string, o?: Record<string, unknown>) => toast.loading(t, o),
          "Loading data...",
          {}
        ),
    },
  ];

  // -------------------------------------------------------------------------
  // Section: Content
  // -------------------------------------------------------------------------

  const contentButtons: DemoButton[] = [
    {
      label: "With Description",
      code: `toast.success("Changes saved", {\n  description: "Your document has been updated.",\n})`,
      onClick: () =>
        tracked(
          (t: string, o?: Record<string, unknown>) => toast.success(t, o),
          "Changes saved",
          {
            description: "Your document has been updated.",
          }
        ),
    },
    {
      label: "With Action Button",
      code: `toast("File deleted", {\n  action: { label: "Undo", onClick: ... },\n})`,
      onClick: () =>
        tracked(toast, "File deleted", {
          action: {
            label: "Undo",
            onClick: () => console.log("undo"),
          },
        }),
    },
    {
      label: "Action + Cancel",
      code: `toast("Confirm changes?", {\n  action: { label: "Confirm", onClick: ... },\n  cancel: { label: "Cancel", onClick: ... },\n})`,
      onClick: () =>
        tracked(toast, "Confirm changes?", {
          action: {
            label: "Confirm",
            onClick: () => console.log("confirmed"),
          },
          cancel: {
            label: "Cancel",
            onClick: () => console.log("cancelled"),
          },
        }),
    },
    {
      label: "Custom Icon",
      code: `toast.success("Custom icon", {\n  icon: <span>✨</span>,\n})`,
      onClick: () =>
        tracked(
          (t: string, o?: Record<string, unknown>) => toast.success(t, o),
          "Custom icon",
          { icon: <span>✨</span> }
        ),
    },
    {
      label: "No Icon",
      code: `toast.success("No icon shown", {\n  icon: false,\n})`,
      onClick: () =>
        tracked(
          (t: string, o?: Record<string, unknown>) => toast.success(t, o),
          "No icon shown",
          { icon: false }
        ),
    },
    {
      label: "High Priority",
      code: `toast("Urgent notification!", {\n  priority: "high",\n})`,
      onClick: () =>
        tracked(toast, "Urgent notification!", { priority: "high" }),
    },
  ];

  // -------------------------------------------------------------------------
  // Section: Lifecycle
  // -------------------------------------------------------------------------

  const lifecycleButtons: DemoButton[] = [
    {
      label: "Promise (2s delay)",
      code: `toast.promise(asyncFn(), {\n  loading: "Loading...",\n  success: "Done!",\n  error: "Failed",\n})`,
      onClick: () => {
        increment();
        toast.promise(
          new Promise<void>((resolve) => setTimeout(resolve, 2000)),
          {
            loading: "Loading...",
            success: "Done!",
            error: "Failed",
          }
        );
        // Promise toasts auto-transition; decrement after success/error dismisses
        setTimeout(() => decrement(), 6500);
      },
    },
    {
      label: "Persistent (no auto-dismiss)",
      code: `toast("Persistent toast", {\n  timeout: 0,\n})`,
      onClick: () => tracked(toast, "Persistent toast", { timeout: 0 }),
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
          // Decrement after the updated toast auto-dismisses
          setTimeout(() => decrement(), 4500);
        }, 2000);
      },
    },
    {
      label: "Create Toast (save ID)",
      code: `const id = toast("Close me via button below");\nlastToastId.current = id;`,
      onClick: () => {
        const id = tracked(toast, "Close me via button below");
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
      label: "Close All Toasts",
      code: "toast.close()",
      onClick: closeAll,
    },
  ];

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <span style={packageNameStyle}>popser</span>
          <span style={versionBadgeStyle}>v0.1.0</span>
          <span
            style={{
              fontSize: 13,
              color: colors.textFaint,
              marginLeft: 4,
            }}
          >
            Dev Preview
          </span>
        </div>
        <div style={toastCounterStyle(count)}>
          <span style={counterDotStyle(count)} />
          <span>
            {count} active toast{count !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      {/* Configuration */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={sectionTitleStyle}>Configuration</span>
          <span style={sectionDescStyle}>
            Controls passed to the {"<Toaster>"} component
          </span>
        </div>

        <div
          style={{
            padding: "14px 18px",
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            background: colors.card,
          }}
        >
          <div style={controlRowStyle}>
            {/* Position */}
            <div style={controlGroupStyle}>
              <span style={controlLabelStyle}>Position</span>
              <select
                onChange={(e) => setPosition(e.target.value as PopserPosition)}
                style={selectStyle}
                value={position}
              >
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div style={dividerStyle} />

            {/* Theme */}
            <div style={controlGroupStyle}>
              <span style={controlLabelStyle}>Theme</span>
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  style={pillStyle(theme === t)}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={dividerStyle} />

            {/* Toggles */}
            <div style={controlGroupStyle}>
              <button
                onClick={() => setRichColors((v) => !v)}
                style={pillStyle(richColors)}
                type="button"
              >
                Rich Colors
              </button>
              <button
                onClick={() => setExpand((v) => !v)}
                style={pillStyle(expand)}
                type="button"
              >
                Expand
              </button>
            </div>
          </div>

          {/* Live config preview */}
          <div
            style={{
              marginTop: 12,
              padding: "8px 10px",
              borderRadius: 6,
              background: colors.codeBackground,
              border: `1px solid ${colors.codeBorder}`,
              fontFamily:
                "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
              fontSize: 11,
              lineHeight: 1.6,
              color: colors.textMuted,
            }}
          >
            {`<Toaster position="${position}" theme="${theme}"${richColors ? " richColors" : ""}${expand ? " expand" : ""} />`}
          </div>
        </div>
      </div>

      {/* Types */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={sectionTitleStyle}>Types</span>
          <span style={sectionDescStyle}>
            All 6 toast type variants: default, success, error, info, warning,
            loading
          </span>
        </div>
        <div style={gridStyle}>
          {typeButtons.map((btn) => (
            <DemoCard key={btn.label} {...btn} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={sectionTitleStyle}>Content</span>
          <span style={sectionDescStyle}>
            Description text, action buttons, custom icons, priority levels
          </span>
        </div>
        <div style={gridStyle}>
          {contentButtons.map((btn) => (
            <DemoCard key={btn.label} {...btn} />
          ))}
        </div>
      </div>

      {/* Lifecycle */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={sectionTitleStyle}>Lifecycle</span>
          <span style={sectionDescStyle}>
            Promise handling, persistent toasts, updates, and close controls
          </span>
        </div>
        <div style={gridStyle}>
          {lifecycleButtons.map((btn) => (
            <DemoCard key={btn.label} {...btn} />
          ))}
        </div>
      </div>

      <Toaster
        expand={expand}
        position={position}
        richColors={richColors}
        theme={theme}
      />
    </div>
  );
}
