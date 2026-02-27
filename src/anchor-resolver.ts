import type { PopserAnchor } from "./types.js";

export interface ResolvedAnchor {
  cleanup?: () => void;
  element: Element;
}

/**
 * Duck-type check for MouseEvent-like objects.
 * Uses property checks instead of `instanceof` for cross-frame/JSDOM compatibility.
 */
function isMouseEventLike(
  value: unknown
): value is { clientX: number; clientY: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "clientX" in value &&
    "clientY" in value &&
    typeof (value as Record<string, unknown>).clientX === "number" &&
    typeof (value as Record<string, unknown>).clientY === "number"
  );
}

/**
 * Duck-type check for coordinate objects `{ x: number; y: number }`.
 */
function isCoordinates(value: unknown): value is { x: number; y: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "x" in value &&
    "y" in value &&
    typeof (value as Record<string, unknown>).x === "number" &&
    typeof (value as Record<string, unknown>).y === "number" &&
    !isMouseEventLike(value)
  );
}

/**
 * Creates a zero-size fixed-position element at the given coordinates.
 * Base UI's Toast.Positioner requires a real DOM Element (rejects virtual elements),
 * so we create a synthetic anchor and clean it up when the toast is removed.
 */
function createSyntheticAnchor(x: number, y: number): ResolvedAnchor {
  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.left = "0";
  el.style.top = "0";
  el.style.width = "0";
  el.style.height = "0";
  el.style.pointerEvents = "none";
  el.style.transform = `translate(${x}px, ${y}px)`;
  el.setAttribute("data-popser-synthetic-anchor", "");
  document.body.appendChild(el);

  return {
    element: el,
    cleanup: () => {
      el.remove();
    },
  };
}

/**
 * Resolves a `PopserAnchor` value into a real DOM Element suitable for
 * Base UI's Toast.Positioner, plus an optional cleanup function.
 *
 * - `null` → returns `null`
 * - `Element` → pass-through (no cleanup)
 * - `MouseEvent` → creates a synthetic anchor at `clientX`/`clientY`
 * - `{ x, y }` → creates a synthetic anchor at the given coordinates
 * - unknown shape → returns `null` (graceful degradation)
 */
export function resolveAnchor(anchor: PopserAnchor): ResolvedAnchor | null {
  if (anchor == null) {
    return null;
  }

  // Real DOM element — pass through
  if (anchor instanceof Element) {
    return { element: anchor };
  }

  // MouseEvent-like — use clientX/clientY
  if (isMouseEventLike(anchor)) {
    return createSyntheticAnchor(anchor.clientX, anchor.clientY);
  }

  // Coordinate object { x, y }
  if (isCoordinates(anchor)) {
    return createSyntheticAnchor(anchor.x, anchor.y);
  }

  // Unknown shape — graceful degradation
  return null;
}
