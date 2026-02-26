import type { PopserOptions } from "popser";
import { toast } from "popser";
import { useSyncExternalStore } from "react";

let toastCount = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) {
    l();
  }
}

export function increment() {
  toastCount++;
  emit();
}

export function decrement() {
  toastCount = Math.max(0, toastCount - 1);
  emit();
}

export function resetCount() {
  toastCount = 0;
  emit();
}

export function useToastCount() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => toastCount
  );
}

/**
 * Create a toast and auto-track its count. Decrements on close.
 */
export function tracked(title: string, options: PopserOptions = {}): string {
  const prevOnClose = options.onClose;
  increment();
  return toast(title, {
    ...options,
    onClose: () => {
      decrement();
      prevOnClose?.();
    },
  });
}

export function closeAll() {
  toast.close();
  resetCount();
}
