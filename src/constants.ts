import type { PopserPosition, PopserSwipeDirection } from "./types.js";

export const DEFAULT_TIMEOUT = 4000;
export const DEFAULT_LIMIT = 3;
export const DEFAULT_POSITION: PopserPosition = "bottom-right";
export const DEFAULT_SWIPE_DIRECTION: PopserSwipeDirection[] = [
  "down",
  "right",
];
export const DEFAULT_CLOSE_BUTTON = "hover" as const;
export const DEFAULT_EXPAND = false;
export const DEFAULT_RICH_COLORS = false;
export const DEFAULT_THEME = "system" as const;
export const DEFAULT_OFFSET = 16;
export const DEFAULT_GAP = 8;
export const DEFAULT_MOBILE_BREAKPOINT = 600;
