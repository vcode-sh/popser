import type { PopserPosition, PopserSwipeDirection } from "popser";

export interface ToasterConfig {
  ariaLabel: string;
  closeButton: "always" | "hover" | "never";
  expand: boolean;
  gap: number;
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
  expand: false,
  gap: 8,
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
