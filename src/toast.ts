import type { ReactNode } from "react";
import { getManager } from "./manager.js";
import type {
  PopserOptions,
  PopserPromiseOptions,
  PopserUpdateOptions,
} from "./types.js";

/**
 * Tracks active toast IDs so `toast.close()` (no args) can close all.
 */
const activeToasts = new Set<string>();

/**
 * Converts PopserOptions into the shape expected by Base UI's
 * `ToastManager.add()`. Popser-specific fields (icon, action, cancel,
 * className, style) are stored inside `data` so that our renderer
 * components can read them back.
 */
function toManagerOptions(
  title: ReactNode,
  options: PopserOptions,
  resolvedId: { current: string }
) {
  const {
    id,
    type,
    description,
    timeout,
    priority,
    icon,
    action,
    cancel,
    onClose,
    onRemove,
    className,
    style,
    data,
  } = options;

  return {
    id,
    title,
    type,
    description,
    timeout,
    priority,
    onClose: () => {
      activeToasts.delete(resolvedId.current);
      onClose?.();
    },
    onRemove,
    data: {
      ...data,
      icon,
      action,
      cancel,
      className,
      style,
    },
  };
}

/**
 * Internal helper that calls `getManager().add()` and keeps
 * `activeToasts` in sync.
 */
function createToast(title: ReactNode, options: PopserOptions = {}): string {
  // Use a ref-like object so the onClose callback always sees the real ID
  const resolvedId = { current: "" };
  const managerOptions = toManagerOptions(title, options, resolvedId);
  const id = getManager().add(managerOptions);
  resolvedId.current = id;
  activeToasts.add(id);
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

/**
 * Show a success toast.
 */
toast.success = (
  title: ReactNode,
  options?: Omit<PopserOptions, "type">
): string => {
  return createToast(title, { ...options, type: "success" });
};

/**
 * Show an error toast.
 */
toast.error = (
  title: ReactNode,
  options?: Omit<PopserOptions, "type">
): string => {
  return createToast(title, { ...options, type: "error" });
};

/**
 * Show an informational toast.
 */
toast.info = (
  title: ReactNode,
  options?: Omit<PopserOptions, "type">
): string => {
  return createToast(title, { ...options, type: "info" });
};

/**
 * Show a warning toast.
 */
toast.warning = (
  title: ReactNode,
  options?: Omit<PopserOptions, "type">
): string => {
  return createToast(title, { ...options, type: "warning" });
};

/**
 * Show a loading toast. Loading toasts do not auto-dismiss.
 */
toast.loading = (
  title: ReactNode,
  options?: Omit<PopserOptions, "type">
): string => {
  return createToast(title, { ...options, type: "loading" });
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
 */
toast.promise = <T>(
  promise: Promise<T>,
  options: PopserPromiseOptions<T>
): Promise<T> => {
  const { success, error } = options;

  const successHandler =
    typeof success === "function"
      ? (result: T) => ({
          title: success(result),
          type: "success" as const,
        })
      : { title: success, type: "success" as const };

  const errorHandler =
    typeof error === "function"
      ? (err: unknown) => ({
          title: error(err),
          type: "error" as const,
        })
      : { title: error, type: "error" as const };

  return getManager().promise(promise, {
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
  if (id) {
    getManager().close(id);
    activeToasts.delete(id);
  } else {
    for (const toastId of activeToasts) {
      getManager().close(toastId);
    }
    activeToasts.clear();
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
  const {
    title,
    type,
    description,
    timeout,
    priority,
    icon,
    action,
    cancel,
    onClose,
    onRemove,
    className,
    style,
    data,
    ...rest
  } = options;

  getManager().update(id, {
    ...rest,
    ...(title !== undefined && { title }),
    ...(type !== undefined && { type }),
    ...(description !== undefined && { description }),
    ...(timeout !== undefined && { timeout }),
    ...(priority !== undefined && { priority }),
    ...(onClose !== undefined && { onClose }),
    ...(onRemove !== undefined && { onRemove }),
    data: {
      ...data,
      ...(icon !== undefined && { icon }),
      ...(action !== undefined && { action }),
      ...(cancel !== undefined && { cancel }),
      ...(className !== undefined && { className }),
      ...(style !== undefined && { style }),
    },
  });
};

export { activeToasts, toast };
