import type { ReactNode } from "react";

export type PopserAnchor =
  | Element
  | MouseEvent
  | { x: number; y: number }
  | null;

export type PopserType = "success" | "error" | "info" | "warning" | "loading";

export interface PopserAction {
  label: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface PopserClassNames {
  actionButton?: string;
  actions?: string;
  arrow?: string;
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

export interface PopserOptions {
  action?: PopserAction | ReactNode;
  /** Element, MouseEvent, or {x,y} coordinates to position the toast against. When set, toast becomes anchored. */
  anchor?: PopserAnchor;
  /** Alignment along the anchor edge. @default "center" */
  anchorAlign?: "start" | "center" | "end";
  /** Alignment axis offset in pixels. @default 0 */
  anchorAlignOffset?: number;
  /** Collision boundary for auto-flip. @default "clipping-ancestors" */
  anchorCollisionBoundary?: "clipping-ancestors" | Element | Element[];
  /** Padding from collision boundary. @default 5 */
  anchorCollisionPadding?: number;
  /** Distance from anchor in pixels. @default 8 */
  anchorOffset?: number;
  /** CSS position method for anchor positioning. @default "absolute" */
  anchorPositionMethod?: "absolute" | "fixed";
  /** Which side of the anchor to place the toast. @default "bottom" */
  anchorSide?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "inline-end"
    | "inline-start";
  /** Keep toast visible when anchor scrolls out of view. @default false */
  anchorSticky?: boolean;
  /** Whether to show an arrow pointing at the anchor. @default false */
  arrow?: boolean;
  /** Padding around arrow from toast edges. @default 5 */
  arrowPadding?: number;
  cancel?: PopserAction | ReactNode;
  className?: string;
  classNames?: Partial<PopserClassNames>;
  data?: Record<string, unknown>;
  deduplicate?: boolean;
  description?: ReactNode;
  /** When false, prevents this toast from being swiped to dismiss. Also hides the close button. */
  dismissible?: boolean;
  /** Alias for `timeout`. If both are set, `timeout` takes precedence. Provided for Sonner compatibility. */
  duration?: number;
  icon?: ReactNode | false;
  id?: string;
  /** Callback fired when the toast is auto-dismissed after its timeout expires. */
  onAutoClose?: (id: string) => void;
  onClose?: (id: string) => void;
  /** Callback fired when the toast is dismissed by user action (e.g. `toast.close(id)`). */
  onDismiss?: (id: string) => void;
  /**
   * Called after the toast's exit animation completes and it is removed from the DOM.
   * Fires after `onClose`/`onAutoClose`/`onDismiss`.
   *
   * Callback firing order: `onDismiss`/`onAutoClose` -> `onClose` -> (exit animation) -> `onRemove`
   */
  onRemove?: () => void;
  priority?: "low" | "high";
  richColors?: boolean;
  style?: React.CSSProperties;
  timeout?: number;
  type?: PopserType | (string & {});
  unstyled?: boolean;
}

/**
 * Extended result from a promise handler. When the success or error callback
 * returns an object with a `title` property, it is treated as extended options.
 */
export interface PopserPromiseExtendedResult extends Partial<PopserOptions> {
  title: ReactNode;
}

export interface PopserPromiseOptions<T = unknown> {
  description?:
    | ReactNode
    | ((data: T) => ReactNode)
    | ((error: unknown) => ReactNode);
  error:
    | ReactNode
    | ((error: unknown) => ReactNode | PopserPromiseExtendedResult | undefined);
  finally?: () => void | Promise<void>;
  id?: string;
  loading: ReactNode;
  success:
    | ReactNode
    | ((result: T) => ReactNode | PopserPromiseExtendedResult | undefined);
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

/**
 * Internal data stored under `__popser` key in the toast data object.
 * This namespace prevents collision with user-provided `data` fields.
 */
export interface PopserInternalData {
  action?: PopserAction | ReactNode;
  arrow?: boolean;
  cancel?: PopserAction | ReactNode;
  className?: string;
  classNames?: Partial<PopserClassNames>;
  dismissible?: boolean;
  icon?: ReactNode | false;
  jsx?: (id: string) => ReactNode;
  richColors?: boolean;
  style?: React.CSSProperties;
  unstyled?: boolean;
}

export interface PopserToastData {
  __popser?: PopserInternalData;
  [key: string]: unknown;
}

export interface ToasterProps {
  /** Accessible label for the toast viewport region. Defaults to Base UI's built-in label. */
  ariaLabel?: string;
  classNames?: PopserClassNames;
  closeButton?: "always" | "hover" | "never";
  expand?: boolean;
  gap?: number;
  icons?: PopserIcons;
  limit?: number;
  mobileBreakpoint?: number;
  /** Separate offset for mobile viewports. Falls back to `offset` if not set. */
  mobileOffset?: number | string;
  offset?: number | string;
  position?: PopserPosition;
  richColors?: boolean;
  style?: React.CSSProperties;
  swipeDirection?: PopserSwipeDirection | PopserSwipeDirection[];
  theme?: "light" | "dark" | "system";
  timeout?: number;
  /** Default options applied to all toasts. Per-toast options take precedence. */
  toastOptions?: Partial<PopserOptions>;
  unstyled?: boolean;
}
