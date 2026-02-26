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
import type { ToasterProps } from "./types.js";

interface ErrorBoundaryState {
  hasError: boolean;
}

// biome-ignore lint/style/useReactFunctionComponents: Error boundaries require class components in React
class ToastErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function ToasterContent({
  ariaLabel,
  position = DEFAULT_POSITION,
  swipeDirection = DEFAULT_SWIPE_DIRECTION,
  closeButton = DEFAULT_CLOSE_BUTTON,
  icons,
  classNames,
  offset = DEFAULT_OFFSET,
  gap = DEFAULT_GAP,
  mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
  richColors = false,
  theme = "system",
  expand = false,
  style,
  unstyled = false,
  visibleCount = DEFAULT_LIMIT,
}: Omit<ToasterProps, "limit" | "timeout"> & { visibleCount?: number }) {
  const { toasts } = Toast.useToastManager();
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpanded = expand || isHovering;

  const viewportStyle = useMemo(
    () =>
      ({
        ...(!unstyled && {
          "--popser-offset":
            typeof offset === "number" ? `${offset}px` : offset,
          "--popser-gap": `${gap}px`,
          "--popser-visible-count": `${visibleCount}`,
        }),
        ...style,
      }) as React.CSSProperties,
    [unstyled, offset, gap, visibleCount, style]
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
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mobileBreakpoint]);

  return (
    <Toast.Portal>
      <Toast.Viewport
        aria-label={ariaLabel}
        className={classNames?.viewport}
        data-expanded={isExpanded || undefined}
        data-mobile={isMobile || undefined}
        data-popser-viewport
        data-position={position}
        data-rich-colors={richColors || undefined}
        data-theme={theme}
        onMouseLeave={handleMouseLeave}
        style={viewportStyle}
      >
        {toasts.map((toast) => (
          <ToastErrorBoundary key={toast.id}>
            <PopserToastRoot
              classNames={classNames}
              closeButton={closeButton}
              icons={icons}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              swipeDirection={swipeDirection}
              toast={toast}
            />
          </ToastErrorBoundary>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export function Toaster({
  limit = DEFAULT_LIMIT,
  timeout = DEFAULT_TIMEOUT,
  ...rest
}: ToasterProps) {
  return (
    <Toast.Provider limit={limit} timeout={timeout} toastManager={getManager()}>
      <ToasterContent visibleCount={limit} {...rest} />
    </Toast.Provider>
  );
}
