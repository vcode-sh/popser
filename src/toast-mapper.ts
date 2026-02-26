import type { ReactNode } from "react";
import {
  isManuallyClosedToast,
  removeManualCloseFlag,
} from "./toast-tracker.js";
import type {
  PopserInternalData,
  PopserOptions,
  PopserUpdateOptions,
} from "./types.js";

/**
 * Converts PopserOptions into the shape expected by Base UI's
 * `ToastManager.add()`. Popser-specific fields are stored inside
 * `data.__popser` to prevent collision with user-provided data fields.
 */
export function toManagerOptions(
  title: ReactNode,
  options: PopserOptions,
  onCloseInternal: () => void,
  resolvedId: { current: string },
  jsx?: (id: string) => ReactNode
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
    classNames,
    style,
    dismissible,
    richColors,
    unstyled,
    data,
  } = options;

  const effectiveTimeout = timeout ?? duration;

  const __popser: PopserInternalData = {
    icon,
    action,
    cancel,
    className,
    classNames,
    style,
    dismissible,
    richColors,
    unstyled,
    ...(jsx !== undefined && { jsx }),
  };

  return {
    id,
    title,
    type,
    description,
    timeout: effectiveTimeout,
    priority,
    onClose: () => {
      const toastId = resolvedId.current;
      const wasManuallyClosed = isManuallyClosedToast(toastId);
      if (wasManuallyClosed) {
        removeManualCloseFlag(toastId);
        onDismiss?.(toastId);
      } else {
        onAutoClose?.(toastId);
      }
      onCloseInternal();
      onClose?.(toastId);
    },
    onRemove,
    data: {
      ...data,
      __popser,
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
    classNames,
    style,
    dismissible,
    richColors,
    unstyled,
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
          onDismiss?.(id);
        } else {
          onAutoClose?.(id);
        }
        onCloseInternal();
        onClose?.(id);
      }
    : undefined;

  const __popser: Partial<PopserInternalData> = {
    ...(icon !== undefined && { icon }),
    ...(action !== undefined && { action }),
    ...(cancel !== undefined && { cancel }),
    ...(className !== undefined && { className }),
    ...(classNames !== undefined && { classNames }),
    ...(style !== undefined && { style }),
    ...(dismissible !== undefined && { dismissible }),
    ...(richColors !== undefined && { richColors }),
    ...(unstyled !== undefined && { unstyled }),
  };

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
      ...(Object.keys(__popser).length > 0 && { __popser }),
    },
  };
}
