/**
 * Tracks active toast IDs so `toast.close()` (no args) can close all.
 */
const activeToasts = new Set<string>();

/**
 * Maps stringified toast title -> toast ID for content-based deduplication.
 * Only populated when `deduplicate: true` is set on a toast with a string title.
 */
const activeToastTitles = new Map<string, string>();

/** @internal — exposed for testing only */
export function getActiveToastCount(): number {
  return activeToasts.size;
}

/** @internal — exposed for testing only */
export function isActiveToast(id: string): boolean {
  return activeToasts.has(id);
}

/** @internal — exposed for testing only */
export function getActiveToastTitles(): Map<string, string> {
  return activeToastTitles;
}

/** @internal — exposed for testing only */
export function clearActiveToasts(): void {
  activeToasts.clear();
  activeToastTitles.clear();
}

/**
 * Returns the existing toast ID if deduplication is enabled and a toast
 * with the same string title is already active. Otherwise returns undefined.
 */
export function findDuplicate(
  title: unknown,
  deduplicate?: boolean,
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
  deduplicate?: boolean,
): void {
  activeToasts.add(id);
  if (deduplicate === true && typeof title === "string") {
    activeToastTitles.set(title, id);
  }
}

/**
 * Remove a single toast from tracking and clean up its dedup entry.
 */
export function untrackToast(id: string): void {
  activeToasts.delete(id);
  for (const [key, value] of activeToastTitles) {
    if (value === id) {
      activeToastTitles.delete(key);
      break;
    }
  }
}

/**
 * Returns all active toast IDs for bulk operations.
 */
export function getActiveToastIds(): Iterable<string> {
  return activeToasts;
}
