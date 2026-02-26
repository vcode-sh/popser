import { Toast } from "@base-ui/react";
import type { ReactNode } from "react";
import type { PopserAction } from "./types.js";

function isPopserAction(value: unknown): value is PopserAction {
  return typeof value === "object" && value !== null && "label" in value;
}

export interface ToastActionsProps {
  action?: PopserAction | ReactNode;
  cancel?: PopserAction | ReactNode;
  classNames?: {
    actions?: string;
    actionButton?: string;
    cancelButton?: string;
  };
}

export function ToastActions({
  action,
  cancel,
  classNames,
}: ToastActionsProps) {
  if (!(action || cancel)) {
    return null;
  }

  return (
    <div className={classNames?.actions} data-popser-actions>
      {cancel &&
        (isPopserAction(cancel) ? (
          <Toast.Close
            className={classNames?.cancelButton}
            data-popser-cancel
            onClick={cancel.onClick}
          >
            {cancel.label}
          </Toast.Close>
        ) : (
          <span className={classNames?.cancelButton} data-popser-cancel>
            {cancel}
          </span>
        ))}
      {action &&
        (isPopserAction(action) ? (
          <Toast.Action
            className={classNames?.actionButton}
            data-popser-action
            onClick={action.onClick}
          >
            {action.label}
          </Toast.Action>
        ) : (
          <span className={classNames?.actionButton} data-popser-action>
            {action}
          </span>
        ))}
    </div>
  );
}
