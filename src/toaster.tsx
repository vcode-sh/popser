import { Toast } from "@base-ui/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_CLOSE_BUTTON,
  DEFAULT_GAP,
  DEFAULT_LIMIT,
  DEFAULT_MOBILE_BREAKPOINT,
  DEFAULT_OFFSET,
  DEFAULT_POSITION,
  DEFAULT_SWIPE_DIRECTION,
  DEFAULT_TIMEOUT,
} from "./constants.js";
import { getManager } from "./manager.js";
import { PopserToastRoot } from "./toast-root.js";
import { setHistoryLimit } from "./toast-tracker.js";
import type { ToasterProps } from "./types.js";

interface ErrorBoundaryState {
  hasError: boolean;
}

class ToastErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[popser] Toast rendering failed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

/** Flip left/right in a position string for RTL. Center positions unchanged. */
function flipPosition(pos: string): string {
  if (pos.endsWith("-left")) {
    return pos.replace("-left", "-right");
  }
  if (pos.endsWith("-right")) {
    return pos.replace("-right", "-left");
  }
  return pos;
}

/** Flip left<->right in swipe directions for RTL. */
function flipSwipeDirection(
  dir: ("up" | "down" | "left" | "right") | ("up" | "down" | "left" | "right")[]
): ("up" | "down" | "left" | "right") | ("up" | "down" | "left" | "right")[] {
  const flip = (d: "up" | "down" | "left" | "right") => {
    if (d === "left") {
      return "right" as const;
    }
    if (d === "right") {
      return "left" as const;
    }
    return d;
  };
  if (Array.isArray(dir)) {
    return dir.map(flip);
  }
  return flip(dir);
}

function ToasterContent({
  ariaLabel,
  position = DEFAULT_POSITION,
  swipeDirection = DEFAULT_SWIPE_DIRECTION,
  closeButton = DEFAULT_CLOSE_BUTTON,
  closeButtonPosition,
  dir,
  icons,
  classNames,
  offset = DEFAULT_OFFSET,
  mobileOffset,
  gap = DEFAULT_GAP,
  mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
  richColors = false,
  theme = "system",
  expand = false,
  expandedLimit,
  style,
  unstyled = false,
  visibleCount = DEFAULT_LIMIT,
  toastOptions,
}: Omit<ToasterProps, "limit" | "timeout"> & { visibleCount?: number }) {
  const { toasts } = Toast.useToastManager();
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
    theme === "system" ? "light" : theme
  );
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resolve text direction
  let resolvedDir = dir;
  if (dir === "auto") {
    const isDocRtl =
      typeof document !== "undefined" && document.documentElement.dir === "rtl";
    resolvedDir = isDocRtl ? "rtl" : "ltr";
  }
  const isRtl = resolvedDir === "rtl";

  const isExpanded = expand || isHovering;
  const basePosition = isRtl ? flipPosition(position) : position;
  const effectivePosition = isMobile ? "bottom-center" : basePosition;
  const effectiveSwipeDirection = isRtl
    ? flipSwipeDirection(swipeDirection)
    : swipeDirection;
  const effectiveVisibleCount =
    isExpanded && expandedLimit
      ? Math.max(visibleCount, expandedLimit)
      : visibleCount;

  const viewportStyle = useMemo(
    () =>
      ({
        ...(!unstyled && {
          "--popser-offset":
            typeof offset === "number" ? `${offset}px` : offset,
          "--popser-gap": `${gap}px`,
          "--popser-visible-count": `${effectiveVisibleCount}`,
          ...(mobileOffset !== undefined && {
            "--popser-mobile-offset":
              typeof mobileOffset === "number"
                ? `${mobileOffset}px`
                : mobileOffset,
          }),
        }),
        ...style,
      }) as React.CSSProperties,
    [unstyled, offset, mobileOffset, gap, effectiveVisibleCount, style]
  );

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Small delay to prevent flicker when moving between toasts
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 100);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (theme !== "system") {
      setResolvedTheme(theme);
      return;
    }
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setResolvedTheme(mql.matches ? "dark" : "light");
    const handler = (e: MediaQueryListEvent) =>
      setResolvedTheme(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mobileBreakpoint]);

  const viewportRef = useCallback((node: HTMLElement | null) => {
    if (node && "showPopover" in node) {
      try {
        node.showPopover();
      } catch {
        /* already showing or unsupported */
      }
    }
  }, []);

  return (
    <Toast.Portal>
      <Toast.Viewport
        aria-label={ariaLabel}
        className={classNames?.viewport}
        data-dir={isRtl ? "rtl" : undefined}
        data-expanded={isExpanded || undefined}
        data-mobile={isMobile || undefined}
        data-popser-viewport
        data-position={effectivePosition}
        data-rich-colors={richColors || undefined}
        data-theme={resolvedTheme}
        dir={resolvedDir}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        popover="manual"
        ref={viewportRef}
        style={viewportStyle}
      >
        {toasts.map((toast) => {
          const isAnchored = !!toast.positionerProps?.anchor;
          const inner = (
            <ToastErrorBoundary>
              <PopserToastRoot
                classNames={classNames}
                closeButton={closeButton}
                closeButtonPosition={closeButtonPosition}
                icons={icons}
                richColors={richColors}
                swipeDirection={effectiveSwipeDirection}
                toast={toast}
                toastOptions={toastOptions}
              />
            </ToastErrorBoundary>
          );

          if (isAnchored) {
            return (
              <Toast.Positioner key={toast.id} toast={toast}>
                {inner}
              </Toast.Positioner>
            );
          }

          return <React.Fragment key={toast.id}>{inner}</React.Fragment>;
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export function Toaster({
  limit = DEFAULT_LIMIT,
  expandedLimit,
  historyLength,
  timeout = DEFAULT_TIMEOUT,
  ...rest
}: ToasterProps) {
  // When expandedLimit is set, Provider needs to keep enough toasts alive for expanded view
  const providerLimit = expandedLimit ? Math.max(limit, expandedLimit) : limit;

  // Configure history ring buffer
  useEffect(() => {
    setHistoryLimit(historyLength ?? 0);
  }, [historyLength]);

  return (
    <Toast.Provider
      limit={providerLimit}
      timeout={timeout}
      toastManager={getManager()}
    >
      <ToasterContent
        expandedLimit={expandedLimit}
        visibleCount={limit}
        {...rest}
      />
    </Toast.Provider>
  );
}
