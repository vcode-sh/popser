import type { PopserIcons } from "popser";
import { Toaster } from "popser";
import { useCallback, useState } from "react";
import "popser/tokens";
import "popser/styles";
import { DemoSection } from "./components.js";
import { ConfigPanel } from "./config-panel.js";
import { defaultConfig, type ToasterConfig } from "./config-types.js";
import { BehaviorSection } from "./sections/behavior.js";
import { ContentSection } from "./sections/content.js";
import { LifecycleSection } from "./sections/lifecycle.js";
import { StressSection } from "./sections/stress.js";
import { StylingSection } from "./sections/styling.js";
import { TypesSection } from "./sections/types.js";
import { V02FeaturesSection } from "./sections/v02-features.js";
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

export function App() {
  const [config, setConfig] = useState<ToasterConfig>(defaultConfig);
  const count = useToastCount();

  const update = useCallback(
    <K extends keyof ToasterConfig>(key: K, val: ToasterConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <span style={packageNameStyle}>popser</span>
          <span style={versionBadgeStyle}>v0.2.0</span>
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

      {/* Demo sections */}
      <TypesSection />
      <ContentSection />
      <StylingSection />
      <BehaviorSection />
      <LifecycleSection />
      <V02FeaturesSection />
      <StressSection />

      {/* Toaster */}
      <Toaster
        ariaLabel={config.ariaLabel || undefined}
        closeButton={config.closeButton}
        expand={config.expand}
        gap={config.gap}
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
