import type { ReactNode } from "react";
import { getManager } from "./manager.js";
import { toManagerOptions, toManagerUpdateOptions } from "./toast-mapper.js";
import {
  clearActiveToasts,
  findDuplicate,
  getActiveToastIds,
  markManuallyClosedToast,
  trackToast,
  untrackToast,
} from "./toast-tracker.js";
import type {
  PopserOptions,
  PopserPromiseExtendedResult,
  PopserPromiseOptions,
  PopserUpdateOptions,
} from "./types.js";

// Re-export test helpers so existing imports from "./toast.js" keep working
// biome-ignore lint/performance/noBarrelFile: re-exports are intentional for backward compat
export {
  clearActiveToasts,
  clearManualCloseFlags,
  getActiveToastCount,
  getActiveToastTitles,
  isActiveToast,
} from "./toast-tracker.js";

/**
 * Tracks the currently active anchored toast ID.
 * Only one anchored toast can be visible at a time — creating a new one
 * automatically dismisses the previous.
 */
let activeAnchoredToastId: string | null = null;

/** @internal -- exposed for testing only */
export function getActiveAnchoredToastId(): string | null {
  return activeAnchoredToastId;
}

/** @internal -- exposed for testing only */
export function clearActiveAnchoredToastId(): void {
  activeAnchoredToastId = null;
}

/**
 * Internal helper that calls `getManager().add()` and keeps
 * active toast tracking in sync.
 */
function createToast(title: ReactNode, options: PopserOptions = {}): string {
  const existingId = findDuplicate(title, options.deduplicate);
  if (existingId !== undefined) {
    return existingId;
  }

  const isAnchored = options.anchor != null;

  // Only one anchored toast at a time — close the previous one
  if (isAnchored && activeAnchoredToastId !== null) {
    toast.close(activeAnchoredToastId);
    activeAnchoredToastId = null;
  }

  // Use a ref-like object so the onClose callback always sees the real ID
  const resolvedId = { current: "" };
  const managerOptions = toManagerOptions(
    title,
    options,
    () => {
      untrackToast(resolvedId.current);
      // Clear anchored tracking when this toast closes
      if (activeAnchoredToastId === resolvedId.current) {
        activeAnchoredToastId = null;
      }
    },
    resolvedId
  );
  const id = getManager().add(managerOptions);
  resolvedId.current = id;
  trackToast(id, title, options.deduplicate);

  if (isAnchored) {
    activeAnchoredToastId = id;
  }

  return id;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Checks if a promise handler result is an extended result object (has `title`).
 */
function isExtendedResult(
  value: unknown
): value is PopserPromiseExtendedResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    !isReactElement(value)
  );
}

/**
 * Checks if a value is a React element (has $$typeof).
 */
function isReactElement(value: unknown): boolean {
  return typeof value === "object" && value !== null && "$$typeof" in value;
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
 * Show a message toast (explicit "default" type). Provided for Sonner compatibility.
 *
 * ```ts
 * toast.message("Something happened");
 * ```
 */
toast.message = (
  title: ReactNode,
  options?: Omit<PopserOptions, "type">
): string => createToast(title, { ...options, type: "default" });

/**
 * Render arbitrary JSX as a toast, bypassing the default structure.
 * Base UI still provides transitions, swipe, stacking, and ARIA.
 *
 * ```ts
 * toast.custom((id) => <MyToast id={id} onClose={() => toast.dismiss(id)} />);
 * ```
 */
toast.custom = (
  jsx: (id: string) => ReactNode,
  options?: Omit<PopserOptions, "type" | "icon" | "action" | "cancel">
): string => {
  const isAnchored = options?.anchor != null;

  // Only one anchored toast at a time — close the previous one
  if (isAnchored && activeAnchoredToastId !== null) {
    toast.close(activeAnchoredToastId);
    activeAnchoredToastId = null;
  }

  const resolvedId = { current: "" };
  const managerOptions = toManagerOptions(
    undefined,
    { ...options, type: "__custom" },
    () => {
      untrackToast(resolvedId.current);
      if (activeAnchoredToastId === resolvedId.current) {
        activeAnchoredToastId = null;
      }
    },
    resolvedId,
    jsx
  );
  const id = getManager().add(managerOptions);
  resolvedId.current = id;
  trackToast(id, undefined, false);

  if (isAnchored) {
    activeAnchoredToastId = id;
  }

  return id;
};

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
 *
 * Supports lazy promises, extended results, `finally`, and per-state descriptions.
 */
toast.promise = <T>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  options: PopserPromiseOptions<T>
): Promise<T> & { id: string } => {
  const { success, error } = options;

  // Support lazy promises
  const promise =
    typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;

  const toastId = { current: "" };

  const successHandler =
    typeof success === "function"
      ? (result: T) => {
          const handlerResult = success(result);
          if (handlerResult === undefined) {
            // Close the loading toast instead of showing a ghost (B1 fix)
            queueMicrotask(() => getManager().close(toastId.current));
            return { title: "", type: "success" as const, timeout: 1 };
          }
          if (isExtendedResult(handlerResult)) {
            const {
              title,
              timeout,
              icon,
              action,
              cancel,
              description,
              ...rest
            } = handlerResult;
            return {
              title,
              type: "success" as const,
              ...(timeout !== undefined && { timeout }),
              ...(description !== undefined && { description }),
              data: {
                __popser: {
                  ...(icon !== undefined && { icon }),
                  ...(action !== undefined && { action }),
                  ...(cancel !== undefined && { cancel }),
                  ...rest,
                },
              },
            };
          }
          // Per-state description support
          const desc =
            typeof options.description === "function"
              ? (options.description as (data: T) => ReactNode)(result)
              : undefined;
          return {
            title: handlerResult,
            type: "success" as const,
            ...(desc !== undefined && { description: desc }),
          };
        }
      : {
          title: success,
          type: "success" as const,
          ...(typeof options.description !== "function" &&
            options.description !== undefined && {
              description: options.description,
            }),
        };

  const errorHandler =
    typeof error === "function"
      ? (err: unknown) => {
          const handlerResult = error(err);
          if (handlerResult === undefined) {
            // Close the loading toast instead of showing a ghost (B1 fix)
            queueMicrotask(() => getManager().close(toastId.current));
            return { title: "", type: "error" as const, timeout: 1 };
          }
          if (isExtendedResult(handlerResult)) {
            const {
              title,
              timeout,
              icon,
              action,
              cancel,
              description,
              ...rest
            } = handlerResult;
            return {
              title,
              type: "error" as const,
              ...(timeout !== undefined && { timeout }),
              ...(description !== undefined && { description }),
              data: {
                __popser: {
                  ...(icon !== undefined && { icon }),
                  ...(action !== undefined && { action }),
                  ...(cancel !== undefined && { cancel }),
                  ...rest,
                },
              },
            };
          }
          // Per-state description support
          const desc =
            typeof options.description === "function"
              ? (options.description as (error: unknown) => ReactNode)(err)
              : undefined;
          return {
            title: handlerResult,
            type: "error" as const,
            ...(desc !== undefined && { description: desc }),
          };
        }
      : {
          title: error,
          type: "error" as const,
          ...(typeof options.description !== "function" &&
            options.description !== undefined && {
              description: options.description,
            }),
        };

  const result = getManager().promise(promise, {
    ...(options.id !== undefined && { id: options.id }),
    loading: { title: options.loading, type: "loading" as const },
    success: successHandler,
    error: errorHandler,
  }) as Promise<T> & { id: string };

  // Capture the toast ID from the manager (it's the return value of promise())
  // We need to handle the finally clause
  if (options.finally) {
    const finallyFn = options.finally;
    result.then(
      () => finallyFn(),
      () => finallyFn()
    );
  }

  // Add non-enumerable `id` property for accessing the toast ID
  // Note: The actual ID is set by Base UI internally; we track it via the promise chain
  Object.defineProperty(result, "id", {
    get: () => toastId.current,
    enumerable: false,
    configurable: true,
  });

  return result;
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
    markManuallyClosedToast(id);
    getManager().close(id);
    untrackToast(id);
    if (activeAnchoredToastId === id) {
      activeAnchoredToastId = null;
    }
  } else {
    for (const toastId of getActiveToastIds()) {
      markManuallyClosedToast(toastId);
      getManager().close(toastId);
    }
    clearActiveToasts();
    activeAnchoredToastId = null;
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
  getManager().update(
    id,
    toManagerUpdateOptions(id, options, () => untrackToast(id))
  );
};

/**
 * Alias for `toast.close()`. Provided for Sonner API compatibility.
 */
toast.dismiss = toast.close;

/**
 * Get the IDs of all currently active toasts.
 */
toast.getToasts = (): string[] => {
  return Array.from(getActiveToastIds());
};

export { toast };
