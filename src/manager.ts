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
