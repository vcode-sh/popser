import { Toast } from "@base-ui/react";
import type { ReactNode } from "react";

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="14"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 6 6 18" />
    <path d="M6 6 18 18" />
  </svg>
);

export interface ToastCloseButtonProps {
  className?: string;
  icon?: ReactNode;
  mode?: "always" | "hover" | "never";
  position?: "header" | "corner";
}

export function ToastCloseButton({
  mode = "hover",
  icon,
  className,
  position = "header",
}: ToastCloseButtonProps) {
  if (mode === "never") {
    return null;
  }

  return (
    <Toast.Close
      aria-label="Close notification"
      className={className}
      data-close-button={mode}
      data-close-position={position}
      data-popser-close
    >
      {icon || <CloseIcon />}
    </Toast.Close>
  );
}
