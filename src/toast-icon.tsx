import type { ReactNode } from "react";
import type { PopserIcons } from "./types.js";

const icons: Record<string, ReactNode> = {
  success: (
    <svg
      aria-label="Success"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        fillRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg
      aria-label="Error"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
        fillRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg
      aria-label="Info"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        fillRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg
      aria-label="Warning"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.499-2.599 4.499H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.004zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
        fillRule="evenodd"
      />
    </svg>
  ),
};

function Spinner() {
  return (
    <div data-popser-spinner>
      {Array.from({ length: 12 }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static spinner bars never reorder
        <div data-popser-spinner-bar key={i} />
      ))}
    </div>
  );
}

export interface ToastIconProps {
  globalIcons?: PopserIcons;
  icon?: React.ReactNode | false;
  type?: string;
}

export function ToastIcon({ type, icon, globalIcons }: ToastIconProps) {
  if (icon === false) {
    return null;
  }
  if (icon) {
    return <span data-popser-icon>{icon}</span>;
  }
  if (type && globalIcons?.[type as keyof PopserIcons]) {
    return (
      <span data-popser-icon>{globalIcons[type as keyof PopserIcons]}</span>
    );
  }
  if (type === "loading") {
    return (
      <span data-popser-icon>
        <Spinner />
      </span>
    );
  }
  if (type && icons[type]) {
    return (
      <span data-popser-icon data-type={type}>
        {icons[type]}
      </span>
    );
  }
  return null;
}
