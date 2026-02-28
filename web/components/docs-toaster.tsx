"use client";

import { Toaster } from "@vcui/popser";
import "@vcui/popser/styles";
import { useTheme } from "next-themes";

export function DocsToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
