import type { PopserPosition, PopserSwipeDirection } from "popser";
import type { ToasterConfig } from "./config-types.js";
import {
  codePreviewStyle,
  colors,
  controlGroupStyle,
  controlLabelStyle,
  controlRowStyle,
  dividerStyle,
  pillStyle,
  selectStyle,
} from "./styles.js";

const positions: PopserPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const themes = ["light", "dark", "system"] as const;
const closeModes = ["hover", "always", "never"] as const;
const closePositions = ["header", "corner"] as const;
const dirs = ["ltr", "rtl", "auto"] as const;
const swipeDirs: PopserSwipeDirection[] = ["up", "down", "left", "right"];

function buildCodePreview(config: ToasterConfig): string {
  return [
    "<Toaster",
    `  position="${config.position}"`,
    `  theme="${config.theme}"`,
    `  closeButton="${config.closeButton}"`,
    `  limit={${config.limit}}`,
    `  offset={${config.offset}}`,
    `  gap={${config.gap}}`,
    `  timeout={${config.timeout}}`,
    config.richColors ? "  richColors" : null,
    config.expand ? "  expand" : null,
    config.unstyled ? "  unstyled" : null,
    config.useCustomIcons ? "  icons={customIcons}" : null,
    config.ariaLabel ? `  ariaLabel="${config.ariaLabel}"` : null,
    config.swipeDirection.length > 0
      ? `  swipeDirection={${JSON.stringify(config.swipeDirection)}}`
      : null,
    config.mobileBreakpoint !== 600
      ? `  mobileBreakpoint={${config.mobileBreakpoint}}`
      : null,
    config.closeButtonPosition !== "header"
      ? `  closeButtonPosition="${config.closeButtonPosition}"`
      : null,
    config.dir ? `  dir="${config.dir}"` : null,
    config.expandedLimit > 0
      ? `  expandedLimit={${config.expandedLimit}}`
      : null,
    config.historyLength > 0
      ? `  historyLength={${config.historyLength}}`
      : null,
    "/>",
  ]
    .filter(Boolean)
    .join("\n");
}

const rowBorder: React.CSSProperties = {
  ...controlRowStyle,
  marginTop: 10,
  paddingTop: 10,
  borderTop: `1px solid ${colors.borderLight}`,
};

export function ConfigPanel({
  config,
  update,
}: {
  config: ToasterConfig;
  update: <K extends keyof ToasterConfig>(
    key: K,
    val: ToasterConfig[K]
  ) => void;
}) {
  const toggleSwipe = (dir: PopserSwipeDirection) => {
    const current = config.swipeDirection;
    update(
      "swipeDirection",
      current.includes(dir)
        ? current.filter((d) => d !== dir)
        : [...current, dir]
    );
  };

  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: 10,
        border: `1px solid ${colors.border}`,
        background: colors.card,
      }}
    >
      {/* Row 1: Position, Theme, Close mode */}
      <div style={controlRowStyle}>
        <div style={controlGroupStyle}>
          <span style={controlLabelStyle}>Position</span>
          <select
            onChange={(e) =>
              update("position", e.target.value as PopserPosition)
            }
            style={selectStyle}
            value={config.position}
          >
            {positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div style={dividerStyle} />
        <div style={controlGroupStyle}>
          <span style={controlLabelStyle}>Theme</span>
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => update("theme", t)}
              style={pillStyle(config.theme === t)}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
        <div style={dividerStyle} />
        <div style={controlGroupStyle}>
          <span style={controlLabelStyle}>Close</span>
          {closeModes.map((m) => (
            <button
              key={m}
              onClick={() => update("closeButton", m)}
              style={pillStyle(config.closeButton === m)}
              type="button"
            >
              {m}
            </button>
          ))}
        </div>
        <div style={dividerStyle} />
        <div style={controlGroupStyle}>
          <span style={controlLabelStyle}>Close Pos</span>
          {closePositions.map((p) => (
            <button
              key={p}
              onClick={() => update("closeButtonPosition", p)}
              style={pillStyle(config.closeButtonPosition === p)}
              type="button"
            >
              {p}
            </button>
          ))}
        </div>
        <div style={dividerStyle} />
        <div style={controlGroupStyle}>
          <span style={controlLabelStyle}>Dir</span>
          {dirs.map((d) => (
            <button
              key={d}
              onClick={() => update("dir", config.dir === d ? "" : d)}
              style={pillStyle(config.dir === d)}
              type="button"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Toggles + Swipe direction */}
      <div style={rowBorder}>
        {(
          [
            ["richColors", "Rich Colors"],
            ["expand", "Expand"],
            ["unstyled", "Unstyled"],
            ["useCustomIcons", "Custom Icons"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => update(key, !config[key])}
            style={pillStyle(config[key] as boolean)}
            type="button"
          >
            {label}
          </button>
        ))}
        <div style={dividerStyle} />
        <div style={controlGroupStyle}>
          <span style={controlLabelStyle}>Swipe</span>
          {swipeDirs.map((dir) => (
            <button
              key={dir}
              onClick={() => toggleSwipe(dir)}
              style={pillStyle(config.swipeDirection.includes(dir))}
              type="button"
            >
              {dir}
            </button>
          ))}
        </div>
      </div>

      {/* Row 3: Numeric controls */}
      <div style={rowBorder}>
        {(
          [
            ["limit", 1, 20, 1],
            ["offset", 0, 64, 4],
            ["gap", 0, 32, 2],
            ["timeout", 0, 30000, 500],
            ["mobileBreakpoint", 320, 1024, 20],
            ["expandedLimit", 0, 20, 1],
            ["historyLength", 0, 100, 10],
          ] as const
        ).map(([key, min, max, step]) => (
          <div key={key} style={controlGroupStyle}>
            <span style={controlLabelStyle}>{key}</span>
            <input
              max={max}
              min={min}
              onChange={(e) => update(key, Number(e.target.value))}
              step={step}
              style={{
                ...selectStyle,
                width:
                  key === "timeout" || key === "mobileBreakpoint" ? 80 : 60,
              }}
              type="number"
              value={config[key]}
            />
          </div>
        ))}
      </div>

      <div style={codePreviewStyle}>{buildCodePreview(config)}</div>
    </div>
  );
}
