import type { ToastHistoryEntry } from "./types.js";

/**
 * Tracks active toast IDs so `toast.close()` (no args) can close all.
 */
const activeToasts = new Set<string>();

/**
 * Maps stringified toast title -> toast ID for content-based deduplication.
 * Only populated when `deduplicate: true` is set on a toast with a string title.
 */
const activeToastTitles = new Map<string, string>();

/**
 * Reverse map: toast ID -> title string for O(1) cleanup in `untrackToast`.
 * Without this, untracking requires O(n) iteration over `activeToastTitles`.
 */
const toastIdToTitle = new Map<string, string>();

/**
 * Tracks toast IDs that were closed via `toast.close(id)` (user action)
 * so the onClose callback can distinguish manual closes from auto-dismissals.
 */
const manuallyClosedToasts = new Set<string>();

/** Check if a toast was manually closed. */
export function isManuallyClosedToast(id: string): boolean {
  return manuallyClosedToasts.has(id);
}

/** Remove the manual close flag for a toast after it has been consumed. */
export function removeManualCloseFlag(id: string): void {
  manuallyClosedToasts.delete(id);
}

/** Mark a toast as manually closed. */
export function markManuallyClosedToast(id: string): void {
  manuallyClosedToasts.add(id);
}

/** @internal -- exposed for testing only */
export function clearManualCloseFlags(): void {
  manuallyClosedToasts.clear();
}

/** @internal -- exposed for testing only */
export function getActiveToastCount(): number {
  return activeToasts.size;
}

/** @internal -- exposed for testing only */
export function isActiveToast(id: string): boolean {
  return activeToasts.has(id);
}

/** @internal -- exposed for testing only */
export function getActiveToastTitles(): Map<string, string> {
  return activeToastTitles;
}

/** @internal -- exposed for testing only */
export function clearActiveToasts(): void {
  activeToasts.clear();
  activeToastTitles.clear();
  toastIdToTitle.clear();
}

/**
 * Returns the existing toast ID if deduplication is enabled and a toast
 * with the same string title is already active. Otherwise returns undefined.
 */
export function findDuplicate(
  title: unknown,
  deduplicate?: boolean
): string | undefined {
  if (deduplicate === true && typeof title === "string") {
    const existingId = activeToastTitles.get(title);
    if (existingId !== undefined && activeToasts.has(existingId)) {
      return existingId;
    }
  }
  return undefined;
}

/**
 * Register a toast as active, optionally tracking its title for deduplication.
 */
export function trackToast(
  id: string,
  title: unknown,
  deduplicate?: boolean
): void {
  activeToasts.add(id);
  if (deduplicate === true && typeof title === "string") {
    activeToastTitles.set(title, id);
    toastIdToTitle.set(id, title);
  }
}

/**
 * Remove a single toast from tracking and clean up its dedup entry.
 * Uses reverse map for O(1) lookup instead of iterating activeToastTitles.
 */
export function untrackToast(id: string): void {
  activeToasts.delete(id);
  const title = toastIdToTitle.get(id);
  if (title !== undefined) {
    activeToastTitles.delete(title);
    toastIdToTitle.delete(id);
  }
}

/**
 * Returns all active toast IDs for bulk operations.
 */
export function getActiveToastIds(): Iterable<string> {
  return activeToasts;
}

// ---------------------------------------------------------------------------
// Toast History (opt-in ring buffer)
// ---------------------------------------------------------------------------

let historyLimit = 0;
const historyBuffer: ToastHistoryEntry[] = [];

/** Set the maximum number of history entries. 0 disables history. */
export function setHistoryLimit(limit: number): void {
  historyLimit = Math.max(0, limit);
  // Trim if needed
  while (historyBuffer.length > historyLimit) {
    historyBuffer.shift();
  }
}

/** @internal -- exposed for testing only */
export function getHistoryLimit(): number {
  return historyLimit;
}

/** Record a toast creation in history. No-op if history is disabled. */
export function recordToastCreation(
  id: string,
  title: unknown,
  type?: string
): void {
  if (historyLimit <= 0) {
    return;
  }

  const entry: ToastHistoryEntry = {
    id,
    title,
    type,
    createdAt: Date.now(),
  };

  historyBuffer.push(entry);

  // Evict oldest when over capacity
  while (historyBuffer.length > historyLimit) {
    historyBuffer.shift();
  }
}

/** Update a history entry when a toast is closed. */
export function recordToastClosure(
  id: string,
  closedBy: "auto" | "manual" | "limit"
): void {
  if (historyLimit <= 0) {
    return;
  }

  // Find the most recent entry with this ID (search from end)
  for (let i = historyBuffer.length - 1; i >= 0; i--) {
    const entry = historyBuffer[i];
    if (entry && entry.id === id && entry.closedAt === undefined) {
      entry.closedAt = Date.now();
      entry.closedBy = closedBy;
      break;
    }
  }
}

/** Get an immutable snapshot of the toast history. */
export function getHistory(): readonly ToastHistoryEntry[] {
  return historyBuffer.map((entry) => ({ ...entry }));
}

/** Clear all history entries. */
export function clearHistory(): void {
  historyBuffer.length = 0;
}
