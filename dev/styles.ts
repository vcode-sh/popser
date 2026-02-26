export const colors = {
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

export const containerStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "0 24px 48px",
  fontFamily:
    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: colors.text,
  background: colors.bg,
  minHeight: "100vh",
};

export const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 0",
  marginBottom: 32,
  borderBottom: `1px solid ${colors.border}`,
};

export const headerLeftStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

export const packageNameStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

export const versionBadgeStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  padding: "2px 8px",
  borderRadius: 9999,
  background: colors.badgeBg,
  color: colors.badgeText,
  letterSpacing: "0.02em",
};

export const toastCounterStyle = (count: number): React.CSSProperties => ({
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

export const counterDotStyle = (count: number): React.CSSProperties => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: count > 0 ? "#22c55e" : colors.border,
  transition: "background 0.2s ease",
});

export const sectionStyle: React.CSSProperties = {
  marginBottom: 36,
};

export const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 12,
  marginBottom: 16,
};

export const sectionTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: colors.text,
  letterSpacing: "-0.01em",
};

export const sectionDescStyle: React.CSSProperties = {
  fontSize: 13,
  color: colors.textFaint,
  fontWeight: 400,
};

export const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 10,
};

export const controlRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
};

export const controlGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 0",
};

export const controlLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: colors.textFaint,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginRight: 2,
};

export const selectStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 13,
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  background: colors.card,
  color: colors.text,
  cursor: "pointer",
};

export const pillStyle = (active: boolean): React.CSSProperties => ({
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

export const codePreviewStyle: React.CSSProperties = {
  marginTop: 12,
  padding: "8px 10px",
  borderRadius: 6,
  background: colors.codeBackground,
  border: `1px solid ${colors.codeBorder}`,
  fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
  fontSize: 11,
  lineHeight: 1.6,
  color: colors.textMuted,
  whiteSpace: "pre-wrap",
};

export const dividerStyle: React.CSSProperties = {
  width: 1,
  height: 24,
  background: colors.border,
  margin: "0 8px",
  flexShrink: 0,
};
