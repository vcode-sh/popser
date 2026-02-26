import { Toast } from "@base-ui/react";
import type { PopserToastData } from "./types.js";

let manager: ReturnType<
  typeof Toast.createToastManager<PopserToastData>
> | null = null;

export function getManager() {
  if (!manager) {
    manager = Toast.createToastManager<PopserToastData>();
  }
  return manager;
}

export function resetManager() {
  manager = Toast.createToastManager<PopserToastData>();
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
