import type { ReactNode } from "react";
import { resolveAnchor } from "./anchor-resolver.js";
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
 * Builds the `positionerProps` object from anchor-related options.
 * Returns `undefined` when no anchor is set.
 * When a MouseEvent or {x,y} coordinates are provided, a synthetic DOM element
 * is created and a `cleanup` function is returned to remove it.
 */
function buildPositionerProps(options: Partial<PopserOptions>) {
  const {
    anchor,
    anchorSide,
    anchorAlign,
    anchorOffset,
    anchorAlignOffset,
    arrowPadding,
    anchorPositionMethod,
    anchorSticky,
    anchorCollisionBoundary,
    anchorCollisionPadding,
  } = options;

  const resolved = resolveAnchor(anchor ?? null);

  if (!resolved) {
    return { props: undefined, cleanup: undefined };
  }

  return {
    props: {
      anchor: resolved.element,
      side: anchorSide ?? "bottom",
      sideOffset: anchorOffset ?? 8,
      align: anchorAlign ?? "center",
      ...(anchorAlignOffset !== undefined && {
        alignOffset: anchorAlignOffset,
      }),
      ...(anchorPositionMethod !== undefined && {
        positionMethod: anchorPositionMethod,
      }),
      ...(anchorSticky !== undefined && { sticky: anchorSticky }),
      ...(anchorCollisionBoundary !== undefined && {
        collisionBoundary: anchorCollisionBoundary,
      }),
      ...(anchorCollisionPadding !== undefined && {
        collisionPadding: anchorCollisionPadding,
      }),
      ...(arrowPadding !== undefined && { arrowPadding }),
    },
    cleanup: resolved.cleanup,
  };
}

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
    arrow,
    data,
  } = options;

  const effectiveTimeout = timeout ?? duration;

  const { props: positionerProps, cleanup: anchorCleanup } =
    buildPositionerProps(options);

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
    ...(arrow !== undefined && { arrow }),
  };

  return {
    id,
    title,
    type,
    description,
    timeout: effectiveTimeout,
    priority,
    positionerProps,
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
    onRemove: anchorCleanup
      ? () => {
          anchorCleanup();
          onRemove?.();
        }
      : onRemove,
    data: {
      ...data,
      __popser,
    },
  };
}

/**
 * Builds a partial `PopserInternalData` from update options,
 * only including fields that were explicitly provided.
 */
function buildUpdateInternalData(
  options: PopserUpdateOptions
): Partial<PopserInternalData> {
  const {
    icon,
    action,
    cancel,
    className,
    classNames,
    style,
    dismissible,
    richColors,
    unstyled,
    arrow,
  } = options;

  return {
    ...(icon !== undefined && { icon }),
    ...(action !== undefined && { action }),
    ...(cancel !== undefined && { cancel }),
    ...(className !== undefined && { className }),
    ...(classNames !== undefined && { classNames }),
    ...(style !== undefined && { style }),
    ...(dismissible !== undefined && { dismissible }),
    ...(richColors !== undefined && { richColors }),
    ...(unstyled !== undefined && { unstyled }),
    ...(arrow !== undefined && { arrow }),
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
    onClose,
    onAutoClose,
    onDismiss,
    onRemove,
    data,
  } = options;

  const effectiveTimeout = timeout ?? duration;

  const { props: positionerProps, cleanup: anchorCleanup } =
    buildPositionerProps(options);

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

  let wrappedOnRemove = onRemove;
  if (anchorCleanup) {
    wrappedOnRemove = () => {
      anchorCleanup();
      onRemove?.();
    };
  }

  const __popser = buildUpdateInternalData(options);

  return {
    ...(title !== undefined && { title }),
    ...(type !== undefined && { type }),
    ...(description !== undefined && { description }),
    ...(effectiveTimeout !== undefined && { timeout: effectiveTimeout }),
    ...(priority !== undefined && { priority }),
    ...(wrappedOnClose !== undefined && { onClose: wrappedOnClose }),
    ...(wrappedOnRemove !== undefined && { onRemove: wrappedOnRemove }),
    ...(positionerProps !== undefined && { positionerProps }),
    data: {
      ...data,
      ...(Object.keys(__popser).length > 0 && { __popser }),
    },
  };
}
