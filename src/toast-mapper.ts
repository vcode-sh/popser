import type { ReactNode } from "react";
import type { PopserOptions, PopserUpdateOptions } from "./types.js";

/**
 * Converts PopserOptions into the shape expected by Base UI's
 * `ToastManager.add()`. Popser-specific fields (icon, action, cancel,
 * className, style) are stored inside `data` so that our renderer
 * components can read them back.
 */
export function toManagerOptions(
  title: ReactNode,
  options: PopserOptions,
  onCloseInternal: () => void
) {
  const {
    id,
    type,
    description,
    timeout,
    priority,
    icon,
    action,
    cancel,
    onClose,
    onRemove,
    className,
    style,
    dismissible,
    data,
  } = options;

  return {
    id,
    title,
    type,
    description,
    timeout,
    priority,
    onClose: () => {
      onCloseInternal();
      onClose?.();
    },
    onRemove,
    data: {
      ...data,
      icon,
      action,
      cancel,
      className,
      style,
      dismissible,
    },
  };
}

/**
 * Converts PopserUpdateOptions into the shape expected by Base UI's
 * `ToastManager.update()`.
 */
export function toManagerUpdateOptions(options: PopserUpdateOptions) {
  const {
    title,
    type,
    description,
    timeout,
    priority,
    icon,
    action,
    cancel,
    onClose,
    onRemove,
    className,
    style,
    dismissible,
    data,
  } = options;

  return {
    ...(title !== undefined && { title }),
    ...(type !== undefined && { type }),
    ...(description !== undefined && { description }),
    ...(timeout !== undefined && { timeout }),
    ...(priority !== undefined && { priority }),
    ...(onClose !== undefined && { onClose }),
    ...(onRemove !== undefined && { onRemove }),
    data: {
      ...data,
      ...(icon !== undefined && { icon }),
      ...(action !== undefined && { action }),
      ...(cancel !== undefined && { cancel }),
      ...(className !== undefined && { className }),
      ...(style !== undefined && { style }),
      ...(dismissible !== undefined && { dismissible }),
    },
  };
}
