import type { PopserPosition } from "popser";
import { Toaster, toast } from "popser";
import { useRef, useState } from "react";
import "popser/tokens";
import "popser/styles";

const positions: PopserPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const themes = ["light", "dark", "system"] as const;

const containerStyle: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
  padding: "32px 24px",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const headingStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 24,
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 32,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 12,
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: 8,
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 500,
  border: "1px solid #ddd",
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
  textAlign: "left",
  transition: "background 0.15s",
};

const controlRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  marginRight: 4,
};

const selectStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 13,
  border: "1px solid #ddd",
  borderRadius: 6,
  background: "#fff",
};

const toggleStyle = (active: boolean): React.CSSProperties => ({
  ...buttonStyle,
  background: active ? "#111" : "#fff",
  color: active ? "#fff" : "#111",
  width: "auto",
});

export function App() {
  const [position, setPosition] = useState<PopserPosition>("bottom-right");
  const [richColors, setRichColors] = useState(false);
  const [expand, setExpand] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const lastToastId = useRef<string | null>(null);

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Popser Dev Preview</h1>

      {/* Controls */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Configuration</div>

        <div style={controlRowStyle}>
          <span style={labelStyle}>Position:</span>
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

          <span style={{ ...labelStyle, marginLeft: 16 }}>Theme:</span>
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={toggleStyle(theme === t)}
              type="button"
            >
              {t}
            </button>
          ))}

          <button
            onClick={() => setRichColors((v) => !v)}
            style={{ ...toggleStyle(richColors), marginLeft: 16 }}
            type="button"
          >
            Rich Colors
          </button>

          <button
            onClick={() => setExpand((v) => !v)}
            style={toggleStyle(expand)}
            type="button"
          >
            Expand
          </button>
        </div>
      </div>

      {/* Basic Types */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Basic Types</div>
        <div style={gridStyle}>
          <button
            onClick={() => toast("Hello world")}
            style={buttonStyle}
            type="button"
          >
            Default
          </button>
          <button
            onClick={() => toast.success("Successfully saved!")}
            style={buttonStyle}
            type="button"
          >
            Success
          </button>
          <button
            onClick={() => toast.error("Something went wrong")}
            style={buttonStyle}
            type="button"
          >
            Error
          </button>
          <button
            onClick={() => toast.info("Here is some info")}
            style={buttonStyle}
            type="button"
          >
            Info
          </button>
          <button
            onClick={() => toast.warning("Be careful!")}
            style={buttonStyle}
            type="button"
          >
            Warning
          </button>
          <button
            onClick={() => toast.loading("Loading data...")}
            style={buttonStyle}
            type="button"
          >
            Loading
          </button>
        </div>
      </div>

      {/* Content Variants */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Content Variants</div>
        <div style={gridStyle}>
          <button
            onClick={() =>
              toast.success("Changes saved", {
                description: "Your document has been updated successfully.",
              })
            }
            style={buttonStyle}
            type="button"
          >
            With Description
          </button>
          <button
            onClick={() =>
              toast("File deleted", {
                action: {
                  label: "Undo",
                  onClick: () => console.log("undo"),
                },
              })
            }
            style={buttonStyle}
            type="button"
          >
            With Action
          </button>
          <button
            onClick={() =>
              toast("Confirm changes?", {
                action: {
                  label: "Confirm",
                  onClick: () => console.log("confirmed"),
                },
                cancel: {
                  label: "Cancel",
                  onClick: () => console.log("cancelled"),
                },
              })
            }
            style={buttonStyle}
            type="button"
          >
            Action + Cancel
          </button>
          <button
            onClick={() =>
              toast.success("Custom icon", { icon: <span>✨</span> })
            }
            style={buttonStyle}
            type="button"
          >
            Custom Icon
          </button>
          <button
            onClick={() => toast.success("No icon shown", { icon: false })}
            style={buttonStyle}
            type="button"
          >
            No Icon
          </button>
          <button
            onClick={() => toast("Urgent notification!", { priority: "high" })}
            style={buttonStyle}
            type="button"
          >
            Priority High
          </button>
        </div>
      </div>

      {/* Async & Lifecycle */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Async & Lifecycle</div>
        <div style={gridStyle}>
          <button
            onClick={() =>
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 2000)),
                {
                  loading: "Loading...",
                  success: "Done!",
                  error: "Failed",
                }
              )
            }
            style={buttonStyle}
            type="button"
          >
            Promise
          </button>
          <button
            onClick={() => toast("Persistent toast", { timeout: 0 })}
            style={buttonStyle}
            type="button"
          >
            Persistent (no auto-dismiss)
          </button>
          <button
            onClick={() => {
              const id = toast.loading("Uploading...");
              setTimeout(() => {
                toast.update(id, {
                  title: "Upload complete!",
                  type: "success",
                  timeout: 4000,
                });
              }, 2000);
            }}
            style={buttonStyle}
            type="button"
          >
            Update (loading to success)
          </button>
        </div>
      </div>

      {/* Close Controls */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Close Controls</div>
        <div style={gridStyle}>
          <button
            onClick={() => {
              const id = toast("Close me via button below");
              lastToastId.current = id;
            }}
            style={buttonStyle}
            type="button"
          >
            Create Toast (save ID)
          </button>
          <button
            onClick={() => {
              if (lastToastId.current) {
                toast.close(lastToastId.current);
                lastToastId.current = null;
              }
            }}
            style={buttonStyle}
            type="button"
          >
            Close Last Toast
          </button>
          <button
            onClick={() => toast.close()}
            style={buttonStyle}
            type="button"
          >
            Close All
          </button>
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
