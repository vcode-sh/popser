import type { ReactNode } from "react";

export type PopserType = "success" | "error" | "info" | "warning" | "loading";

export interface PopserAction {
  label: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface PopserOptions {
  action?: PopserAction;
  cancel?: PopserAction;
  className?: string;
  data?: Record<string, unknown>;
  deduplicate?: boolean;
  description?: ReactNode;
  icon?: ReactNode | false;
  id?: string;
  onClose?: () => void;
  onRemove?: () => void;
  priority?: "low" | "high";
  style?: React.CSSProperties;
  timeout?: number;
  type?: PopserType | (string & {});
}

export interface PopserPromiseOptions<T = unknown> {
  error: ReactNode | ((error: unknown) => ReactNode | undefined);
  id?: string;
  loading: ReactNode;
  success: ReactNode | ((result: T) => ReactNode | undefined);
}

export interface PopserUpdateOptions extends Partial<PopserOptions> {
  title?: ReactNode;
}

export interface PopserIcons {
  close?: ReactNode;
  error?: ReactNode;
  info?: ReactNode;
  loading?: ReactNode;
  success?: ReactNode;
  warning?: ReactNode;
}

export type PopserPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type PopserSwipeDirection = "up" | "down" | "left" | "right";

export interface PopserClassNames {
  actionButton?: string;
  actions?: string;
  cancelButton?: string;
  closeButton?: string;
  content?: string;
  description?: string;
  header?: string;
  icon?: string;
  root?: string;
  title?: string;
  viewport?: string;
}

export interface ToasterProps {
  classNames?: PopserClassNames;
  closeButton?: "always" | "hover" | "never";
  expand?: boolean;
  gap?: number;
  icons?: PopserIcons;
  limit?: number;
  mobileBreakpoint?: number;
  offset?: number | string;
  position?: PopserPosition;
  richColors?: boolean;
  style?: React.CSSProperties;
  swipeDirection?: PopserSwipeDirection | PopserSwipeDirection[];
  theme?: "light" | "dark" | "system";
  timeout?: number;
  unstyled?: boolean;
}
