import type { ReactNode } from "react";
import { getManager } from "./manager.js";
import { toManagerOptions, toManagerUpdateOptions } from "./toast-mapper.js";
import {
  clearActiveToasts,
  findDuplicate,
  getActiveToastIds,
  trackToast,
  untrackToast,
} from "./toast-tracker.js";
import type {
  PopserOptions,
  PopserPromiseOptions,
  PopserUpdateOptions,
} from "./types.js";

// Re-export test helpers so existing imports from "./toast.js" keep working
// biome-ignore lint/performance/noBarrelFile: re-exports are intentional for backward compat
export {
  clearActiveToasts,
  getActiveToastCount,
  getActiveToastTitles,
  isActiveToast,
} from "./toast-tracker.js";

/**
 * Internal helper that calls `getManager().add()` and keeps
 * active toast tracking in sync.
 */
function createToast(title: ReactNode, options: PopserOptions = {}): string {
  const existingId = findDuplicate(title, options.deduplicate);
  if (existingId !== undefined) {
    return existingId;
  }

  // Use a ref-like object so the onClose callback always sees the real ID
  const resolvedId = { current: "" };
  const managerOptions = toManagerOptions(title, options, () =>
    untrackToast(resolvedId.current)
  );
  const id = getManager().add(managerOptions);
  resolvedId.current = id;
  trackToast(id, title, options.deduplicate);

  return id;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Show a toast notification.
 *
 * ```ts
 * toast("Hello world");
 * toast("Saved", { description: "Your changes were saved." });
 * ```
 */
function toast(title: ReactNode, options?: PopserOptions): string {
  return createToast(title, options);
}

function typedToast(type: string) {
  return (title: ReactNode, options?: Omit<PopserOptions, "type">): string =>
    createToast(title, { ...options, type });
}

toast.success = typedToast("success");
toast.error = typedToast("error");
toast.info = typedToast("info");
toast.warning = typedToast("warning");
toast.loading = typedToast("loading");

/**
 * Tie a toast to a promise. Shows loading/success/error states
 * automatically as the promise settles.
 *
 * ```ts
 * toast.promise(fetchData(), {
 *   loading: "Loading...",
 *   success: "Done!",
 *   error: "Something went wrong",
 * });
 * ```
 */
toast.promise = <T>(
  promise: Promise<T>,
  options: PopserPromiseOptions<T>
): Promise<T> => {
  const { success, error } = options;

  const successHandler =
    typeof success === "function"
      ? (result: T) => {
          const title = success(result);
          if (title === undefined) {
            return { title: "", type: "default" as const, timeout: 1 };
          }
          return { title, type: "success" as const };
        }
      : { title: success, type: "success" as const };

  const errorHandler =
    typeof error === "function"
      ? (err: unknown) => {
          const title = error(err);
          if (title === undefined) {
            return { title: "", type: "default" as const, timeout: 1 };
          }
          return { title, type: "error" as const };
        }
      : { title: error, type: "error" as const };

  return getManager().promise(promise, {
    ...(options.id !== undefined && { id: options.id }),
    loading: { title: options.loading, type: "loading" as const },
    success: successHandler,
    error: errorHandler,
  });
};

/**
 * Close a specific toast by ID, or close all active toasts when called
 * without arguments.
 *
 * ```ts
 * toast.close("my-id");  // close one
 * toast.close();          // close all
 * ```
 */
toast.close = (id?: string): void => {
  if (id !== undefined) {
    getManager().close(id);
    untrackToast(id);
  } else {
    for (const toastId of getActiveToastIds()) {
      getManager().close(toastId);
    }
    clearActiveToasts();
  }
};

/**
 * Update an existing toast in-place.
 *
 * ```ts
 * toast.update("my-id", { title: "New title", description: "Updated" });
 * ```
 */
toast.update = (id: string, options: PopserUpdateOptions): void => {
  getManager().update(id, toManagerUpdateOptions(options));
};

export { toast };
