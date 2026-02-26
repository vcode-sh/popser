import type { ToastObject } from "@base-ui/react";
import { Toast } from "@base-ui/react";
import { ToastActions } from "./toast-action.js";
import { ToastCloseButton } from "./toast-close.js";
import { ToastIcon } from "./toast-icon.js";
import type { PopserAction, PopserClassNames, PopserIcons } from "./types.js";

interface PopserToastData {
  action?: PopserAction;
  cancel?: PopserAction;
  className?: string;
  icon?: React.ReactNode | false;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export interface ToastRootProps {
  classNames?: PopserClassNames;
  closeButton?: "always" | "hover" | "never";
  icons?: PopserIcons;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  swipeDirection?:
    | ("up" | "down" | "left" | "right")
    | ("up" | "down" | "left" | "right")[];
  toast: ToastObject<PopserToastData>;
}

export function PopserToastRoot({
  toast: toastData,
  swipeDirection,
  closeButton = "hover",
  icons,
  classNames,
  onMouseEnter,
  onMouseLeave,
}: ToastRootProps) {
  const data = (toastData.data ?? {}) as PopserToastData;
  const type = toastData.type;

  return (
    <Toast.Root
      className={
        [classNames?.root, data.className].filter(Boolean).join(" ") ||
        undefined
      }
      data-popser-root
      data-type={type}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={data.style}
      swipeDirection={swipeDirection}
      toast={toastData}
    >
      <Toast.Content className={classNames?.content} data-popser-content>
        <div className={classNames?.header} data-popser-header>
          <ToastIcon globalIcons={icons} icon={data.icon} type={type} />
          <div data-popser-text>
            {toastData.title && (
              <Toast.Title className={classNames?.title} data-popser-title>
                {toastData.title}
              </Toast.Title>
            )}
            {toastData.description && (
              <Toast.Description
                className={classNames?.description}
                data-popser-description
              >
                {toastData.description}
              </Toast.Description>
            )}
          </div>
          <ToastCloseButton
            className={classNames?.closeButton}
            icon={icons?.close}
            mode={closeButton}
          />
        </div>
        <ToastActions
          action={data.action}
          cancel={data.cancel}
          classNames={{
            actions: classNames?.actions,
            actionButton: classNames?.actionButton,
            cancelButton: classNames?.cancelButton,
          }}
        />
      </Toast.Content>
    </Toast.Root>
  );
}
