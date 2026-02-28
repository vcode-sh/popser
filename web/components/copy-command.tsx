"use client";

import { useCallback, useState } from "react";

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect height="13" rx="2" width="13" x="9" y="9" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [command]);

  return (
    <button
      className="group flex cursor-pointer items-center gap-2 rounded-lg border border-fd-border bg-fd-secondary px-4 py-2.5 font-mono text-sm transition-colors hover:bg-fd-accent"
      onClick={copy}
      type="button"
    >
      <span>{command}</span>
      <span className="text-fd-muted-foreground transition-colors group-hover:text-fd-foreground">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
    </button>
  );
}
