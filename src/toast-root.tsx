import type { ToastObject } from "@base-ui/react";
import { Toast } from "@base-ui/react";
import React from "react";
import { ToastActions } from "./toast-action.js";
import { ToastCloseButton } from "./toast-close.js";
import { ToastIcon } from "./toast-icon.js";
import type {
  PopserClassNames,
  PopserIcons,
  PopserInternalData,
  PopserOptions,
  PopserToastData,
} from "./types.js";

/**
 * Merge two classNames objects, concatenating values for each slot.
 */
function mergeClassNames(
  toaster?: PopserClassNames,
  perToast?: Partial<PopserClassNames>
): PopserClassNames | undefined {
  if (!(toaster || perToast)) {
    return undefined;
  }
  if (!perToast) {
    return toaster;
  }
  if (!toaster) {
    return perToast as PopserClassNames;
  }

  const slots = [
    "arrow",
    "root",
    "content",
    "header",
    "title",
    "description",
    "icon",
    "closeButton",
    "actions",
    "actionButton",
    "cancelButton",
    "viewport",
  ] as const;

  const merged: Record<string, string | undefined> = {};
  for (const slot of slots) {
    const a = toaster[slot];
    const b = perToast[slot];
    if (a && b) {
      merged[slot] = `${a} ${b}`;
    } else {
      merged[slot] = a || b;
    }
  }
  return merged as PopserClassNames;
}

export interface ToastRootProps {
  classNames?: PopserClassNames;
  closeButton?: "always" | "hover" | "never";
  icons?: PopserIcons;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  richColors?: boolean;
  swipeDirection?:
    | ("up" | "down" | "left" | "right")
    | ("up" | "down" | "left" | "right")[];
  toast: ToastObject<PopserToastData>;
  toastOptions?: Partial<PopserOptions>;
}

export const PopserToastRoot = React.memo(function PopserToastRoot({
  toast: toastData,
  swipeDirection,
  closeButton = "hover",
  icons,
  classNames,
  richColors: toasterRichColors,
  onMouseEnter,
  onMouseLeave,
  toastOptions,
}: ToastRootProps) {
  const popser = (toastData.data?.__popser ?? {}) as PopserInternalData;
  const type = toastData.type;

  const effectiveSwipeDirection =
    popser.dismissible === false ? [] : swipeDirection;
  const effectiveCloseButton =
    popser.dismissible === false ? "never" : closeButton;

  // Per-toast richColors overrides Toaster-level
  const effectiveRichColors = popser.richColors ?? toasterRichColors;

  // Per-toast unstyled
  const isUnstyled = popser.unstyled;

  // Detect anchored toast
  const isAnchored = !!toastData.positionerProps?.anchor;

  // Merge Toaster-level classNames with toastOptions classNames, then per-toast classNames
  const baseClassNames = mergeClassNames(classNames, toastOptions?.classNames);
  const mergedClassNames = mergeClassNames(baseClassNames, popser.classNames);

  // Merge className strings
  const rootClassName =
    [mergedClassNames?.root, toastOptions?.className, popser.className]
      .filter(Boolean)
      .join(" ") || undefined;

  // Custom toast rendering - bypass default structure
  if (popser.jsx) {
    const customContent = popser.jsx(toastData.id);
    return (
      <Toast.Root
        className={rootClassName}
        data-anchored={isAnchored || undefined}
        data-popser-id={toastData.id}
        data-popser-root
        data-rich-colors={effectiveRichColors || undefined}
        data-type="custom"
        data-unstyled={isUnstyled || undefined}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={popser.style}
        swipeDirection={effectiveSwipeDirection}
        toast={toastData}
      >
        {isAnchored ? (
          <Toast.Positioner toast={toastData}>
            {popser.arrow && (
              <Toast.Arrow
                className={mergedClassNames?.arrow}
                data-popser-arrow
              />
            )}
            {customContent}
          </Toast.Positioner>
        ) : (
          customContent
        )}
      </Toast.Root>
    );
  }

  const toastContent = (
    <Toast.Content className={mergedClassNames?.content} data-popser-content>
      <div className={mergedClassNames?.header} data-popser-header>
        <ToastIcon
          className={mergedClassNames?.icon}
          globalIcons={icons}
          icon={popser.icon}
          type={type}
        />
        <div data-popser-text>
          {toastData.title && (
            <Toast.Title className={mergedClassNames?.title} data-popser-title>
              {toastData.title}
            </Toast.Title>
          )}
          {toastData.description && (
            <Toast.Description
              className={mergedClassNames?.description}
              data-popser-description
            >
              {toastData.description}
            </Toast.Description>
          )}
        </div>
        <ToastCloseButton
          className={mergedClassNames?.closeButton}
          icon={icons?.close}
          mode={effectiveCloseButton}
        />
      </div>
      <ToastActions
        action={popser.action}
        cancel={popser.cancel}
        classNames={{
          actions: mergedClassNames?.actions,
          actionButton: mergedClassNames?.actionButton,
          cancelButton: mergedClassNames?.cancelButton,
        }}
      />
    </Toast.Content>
  );

  return (
    <Toast.Root
      className={rootClassName}
      data-anchored={isAnchored || undefined}
      data-popser-id={toastData.id}
      data-popser-root
      data-rich-colors={effectiveRichColors || undefined}
      data-type={type}
      data-unstyled={isUnstyled || undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={popser.style}
      swipeDirection={effectiveSwipeDirection}
      toast={toastData}
    >
      {isAnchored ? (
        <Toast.Positioner toast={toastData}>
          {popser.arrow && (
            <Toast.Arrow
              className={mergedClassNames?.arrow}
              data-popser-arrow
            />
          )}
          {toastContent}
        </Toast.Positioner>
      ) : (
        toastContent
      )}
    </Toast.Root>
  );
});
