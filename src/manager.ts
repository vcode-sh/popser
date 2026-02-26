import { Toast } from "@base-ui/react";

let manager: ReturnType<typeof Toast.createToastManager> | null = null;

export function getManager() {
  if (!manager) {
    manager = Toast.createToastManager();
  }
  return manager;
}

export function resetManager() {
  manager = Toast.createToastManager();
  return manager;
}

/**
 * Resets the manager to `null` so the next `getManager()` call lazily
 * creates a fresh instance. Used in tests to simulate the state before
 * any `<Toaster>` has mounted.
 */
export function clearManager() {
  manager = null;
}
