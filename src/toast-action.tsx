import { Toast } from "@base-ui/react";
import type { PopserAction } from "./types.js";

export interface ToastActionsProps {
  action?: PopserAction;
  cancel?: PopserAction;
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
      {cancel && (
        <Toast.Close
          className={classNames?.cancelButton}
          data-popser-cancel
          onClick={cancel.onClick}
        >
          {cancel.label}
        </Toast.Close>
      )}
      {action && (
        <Toast.Action
          className={classNames?.actionButton}
          data-popser-action
          onClick={action.onClick}
        >
          {action.label}
        </Toast.Action>
      )}
    </div>
  );
}
