import type { PopserPosition, PopserSwipeDirection } from "popser";

export interface ToasterConfig {
  ariaLabel: string;
  closeButton: "always" | "hover" | "never";
  closeButtonPosition: "header" | "corner";
  dir: "" | "ltr" | "rtl" | "auto";
  expand: boolean;
  expandedLimit: number;
  gap: number;
  historyLength: number;
  limit: number;
  mobileBreakpoint: number;
  offset: number;
  position: PopserPosition;
  richColors: boolean;
  swipeDirection: PopserSwipeDirection[];
  theme: "light" | "dark" | "system";
  timeout: number;
  unstyled: boolean;
  useCustomIcons: boolean;
}

export const defaultConfig: ToasterConfig = {
  ariaLabel: "",
  closeButton: "hover",
  closeButtonPosition: "header",
  dir: "",
  expand: false,
  expandedLimit: 0,
  gap: 8,
  historyLength: 0,
  limit: 3,
  mobileBreakpoint: 600,
  offset: 16,
  position: "bottom-right",
  richColors: false,
  swipeDirection: ["down", "right"],
  theme: "system",
  timeout: 5000,
  unstyled: false,
  useCustomIcons: false,
};
