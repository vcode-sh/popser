import { Toast } from "@base-ui/react";

/**
 * React hook for accessing the toast manager state.
 * Thin wrapper over Base UI's `Toast.useToastManager()` for API compatibility.
 */
export function useToaster() {
  return Toast.useToastManager();
}
