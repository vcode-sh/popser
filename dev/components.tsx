import {
  colors,
  sectionDescStyle,
  sectionHeaderStyle,
  sectionStyle,
  sectionTitleStyle,
} from "./styles.js";

export interface DemoButton {
  code: string;
  label: string;
  onClick: () => void;
}

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

export function DemoCard({ label, code, onClick }: DemoButton) {
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
      <span style={labelStyle}>{label}</span>
      <code style={codeStyle}>{code}</code>
    </button>
  );
}

export function DemoSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <span style={sectionTitleStyle}>{title}</span>
        <span style={sectionDescStyle}>{description}</span>
      </div>
      {children}
    </div>
  );
}
