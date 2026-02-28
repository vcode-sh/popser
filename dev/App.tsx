import type { PopserIcons } from "popser";
import { Toaster } from "popser";
import { useCallback, useEffect, useState } from "react";
import "popser/tokens";
import "popser/styles";
import { DemoSection } from "./components.js";
import { ConfigPanel } from "./config-panel.js";
import { defaultConfig, type ToasterConfig } from "./config-types.js";
import { AnchoredSection } from "./sections/anchored.js";
import { BehaviorSection } from "./sections/behavior.js";
import { ContentSection } from "./sections/content.js";
import { FixesShowcaseSection } from "./sections/fixes-showcase.js";
import { LifecycleSection } from "./sections/lifecycle.js";
import { StressSection } from "./sections/stress.js";
import { StylingSection } from "./sections/styling.js";
import { TypesSection } from "./sections/types.js";
import { V02FeaturesSection } from "./sections/v02-features.js";
import { V12FeaturesSection } from "./sections/v12-features.js";
import {
  colors,
  containerStyle,
  counterDotStyle,
  headerLeftStyle,
  headerStyle,
  packageNameStyle,
  toastCounterStyle,
  versionBadgeStyle,
} from "./styles.js";
import { useToastCount } from "./toast-counter.js";

const customIcons: PopserIcons = {
  success: <span>🎉</span>,
  error: <span>💥</span>,
  info: <span>💡</span>,
  warning: <span>⚡</span>,
  loading: <span>⏳</span>,
  close: <span>✕</span>,
};

function useResolvedTheme(theme: "light" | "dark" | "system") {
  const [resolved, setResolved] = useState<"light" | "dark">(() => {
    if (theme !== "system") {
      return theme;
    }
    if (typeof window === "undefined") {
      return "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    if (theme !== "system") {
      setResolved(theme);
      return;
    }
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setResolved(mql.matches ? "dark" : "light");
    const handler = (e: MediaQueryListEvent) =>
      setResolved(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  return resolved;
}

export function App() {
  const [config, setConfig] = useState<ToasterConfig>(defaultConfig);
  const count = useToastCount();
  const resolvedTheme = useResolvedTheme(config.theme);

  const update = useCallback(
    <K extends keyof ToasterConfig>(key: K, val: ToasterConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  // Apply page theme to root for CSS variable switching
  useEffect(() => {
    document.documentElement.setAttribute("data-page-theme", resolvedTheme);
  }, [resolvedTheme]);

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <span style={packageNameStyle}>popser</span>
          <span style={versionBadgeStyle}>v1.2.0</span>
          <span
            style={{ fontSize: 13, color: colors.textFaint, marginLeft: 4 }}
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
      <DemoSection
        description={"Controls passed to the <Toaster> component"}
        title="Configuration"
      >
        <ConfigPanel config={config} update={update} />
      </DemoSection>

      {/* Fixes showcase — front and center */}
      <FixesShowcaseSection />

      {/* Demo sections */}
      <TypesSection />
      <ContentSection />
      <StylingSection />
      <BehaviorSection />
      <LifecycleSection />
      <V02FeaturesSection />
      <V12FeaturesSection />
      <AnchoredSection />
      <StressSection />

      {/* Toaster */}
      <Toaster
        ariaLabel={config.ariaLabel || undefined}
        closeButton={config.closeButton}
        closeButtonPosition={config.closeButtonPosition}
        dir={config.dir || undefined}
        expand={config.expand}
        expandedLimit={config.expandedLimit || undefined}
        gap={config.gap}
        historyLength={config.historyLength || undefined}
        icons={config.useCustomIcons ? customIcons : undefined}
        limit={config.limit}
        mobileBreakpoint={config.mobileBreakpoint}
        offset={config.offset}
        position={config.position}
        richColors={config.richColors}
        swipeDirection={config.swipeDirection}
        theme={config.theme}
        timeout={config.timeout}
        unstyled={config.unstyled}
      />
    </div>
  );
}
