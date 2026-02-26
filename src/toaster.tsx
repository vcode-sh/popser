import { Toast } from "@base-ui/react";
import { useEffect, useState } from "react";
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

function ToasterContent({
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
}: Omit<ToasterProps, "limit" | "timeout">) {
  const { toasts } = Toast.useToastManager();
  const [isMobile, setIsMobile] = useState(false);

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
        className={classNames?.viewport}
        data-expanded={expand || undefined}
        data-mobile={isMobile || undefined}
        data-popser-viewport
        data-position={position}
        data-rich-colors={richColors || undefined}
        data-theme={theme}
        style={
          {
            ...(!unstyled && {
              "--popser-offset":
                typeof offset === "number" ? `${offset}px` : offset,
              "--popser-gap": `${gap}px`,
            }),
            ...style,
          } as React.CSSProperties
        }
      >
        {toasts.map((toast) => (
          <PopserToastRoot
            classNames={classNames}
            closeButton={closeButton}
            icons={icons}
            key={toast.id}
            swipeDirection={swipeDirection}
            toast={toast}
          />
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
      <ToasterContent {...rest} />
    </Toast.Provider>
  );
}
