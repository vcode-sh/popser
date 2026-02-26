import type { ReactNode } from "react";
import {
  isManuallyClosedToast,
  removeManualCloseFlag,
} from "./toast-tracker.js";
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
  onCloseInternal: () => void,
  resolvedId: { current: string }
) {
  const {
    id,
    type,
    description,
    timeout,
    duration,
    priority,
    icon,
    action,
    cancel,
    onClose,
    onAutoClose,
    onDismiss,
    onRemove,
    className,
    style,
    dismissible,
    data,
  } = options;

  const effectiveTimeout = timeout ?? duration;

  return {
    id,
    title,
    type,
    description,
    timeout: effectiveTimeout,
    priority,
    onClose: () => {
      const wasManuallyClosed = isManuallyClosedToast(resolvedId.current);
      if (wasManuallyClosed) {
        removeManualCloseFlag(resolvedId.current);
        onDismiss?.();
      } else {
        onAutoClose?.();
      }
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
 *
 * When `onClose`, `onAutoClose`, or `onDismiss` are provided, they must be
 * wrapped with the same internal tracking logic used at creation time.
 * `onCloseInternal` handles untracking the toast from active sets.
 */
export function toManagerUpdateOptions(
  id: string,
  options: PopserUpdateOptions,
  onCloseInternal: () => void
) {
  const {
    title,
    type,
    description,
    timeout,
    duration,
    priority,
    icon,
    action,
    cancel,
    onClose,
    onAutoClose,
    onDismiss,
    onRemove,
    className,
    style,
    dismissible,
    data,
  } = options;

  const effectiveTimeout = timeout ?? duration;

  // If any close-related callback is being updated, wrap it with internal
  // tracking logic just like toManagerOptions does at creation time.
  const hasCloseCallbacks =
    onClose !== undefined ||
    onAutoClose !== undefined ||
    onDismiss !== undefined;

  const wrappedOnClose = hasCloseCallbacks
    ? () => {
        const wasManuallyClosed = isManuallyClosedToast(id);
        if (wasManuallyClosed) {
          removeManualCloseFlag(id);
          onDismiss?.();
        } else {
          onAutoClose?.();
        }
        onCloseInternal();
        onClose?.();
      }
    : undefined;

  return {
    ...(title !== undefined && { title }),
    ...(type !== undefined && { type }),
    ...(description !== undefined && { description }),
    ...(effectiveTimeout !== undefined && { timeout: effectiveTimeout }),
    ...(priority !== undefined && { priority }),
    ...(wrappedOnClose !== undefined && { onClose: wrappedOnClose }),
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
