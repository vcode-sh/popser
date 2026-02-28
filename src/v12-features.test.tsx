import { act } from "react";
import { createRoot } from "react-dom/client";
import { getManager, resetManager } from "./manager.js";
import { clearActiveToasts, clearManualCloseFlags, toast } from "./toast.js";
import {
  clearHistory,
  getHistoryLimit,
  setHistoryLimit,
} from "./toast-tracker.js";
import { Toaster } from "./toaster.js";

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
  vi.useFakeTimers();
  resetManager();
  clearActiveToasts();
  clearManualCloseFlags();
  clearHistory();
  setHistoryLimit(0);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// 1. Popover API Support
// ---------------------------------------------------------------------------
describe("Popover API support", () => {
  it("sets popover='manual' attribute on viewport", () => {
    act(() => {
      root.render(<Toaster />);
    });
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    expect(viewport.getAttribute("popover")).toBe("manual");
  });

  it("calls showPopover on mount", () => {
    const showPopoverSpy = vi.fn();
    const origShowPopover = HTMLElement.prototype.showPopover;
    HTMLElement.prototype.showPopover = showPopoverSpy;

    act(() => {
      root.render(<Toaster />);
    });

    expect(showPopoverSpy).toHaveBeenCalled();
    HTMLElement.prototype.showPopover = origShowPopover;
  });

  it("does not throw when showPopover is unsupported", () => {
    // Delete showPopover to simulate older browsers
    const origShowPopover = HTMLElement.prototype.showPopover;
    // @ts-expect-error -- testing missing API
    delete HTMLElement.prototype.showPopover;

    expect(() => {
      act(() => {
        root.render(<Toaster />);
      });
    }).not.toThrow();

    HTMLElement.prototype.showPopover = origShowPopover;
  });
});

// ---------------------------------------------------------------------------
// 2. Expanded Limit
// ---------------------------------------------------------------------------
describe("expandedLimit", () => {
  it("uses limit for --popser-visible-count when not expanded", () => {
    act(() => {
      root.render(<Toaster expandedLimit={10} limit={3} />);
    });
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    expect(viewport.style.getPropertyValue("--popser-visible-count")).toBe("3");
  });

  it("uses expandedLimit for --popser-visible-count when expanded", () => {
    act(() => {
      root.render(<Toaster expand expandedLimit={10} limit={3} />);
    });
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    expect(viewport.style.getPropertyValue("--popser-visible-count")).toBe(
      "10"
    );
  });

  it("clamps expandedLimit to at least limit", () => {
    act(() => {
      root.render(<Toaster expand expandedLimit={1} limit={5} />);
    });
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    // Math.max(5, 1) = 5
    expect(viewport.style.getPropertyValue("--popser-visible-count")).toBe("5");
  });

  it("switches visible count on hover", () => {
    act(() => {
      root.render(<Toaster expandedLimit={8} limit={3} />);
    });
    act(() => {
      toast("Test");
    });

    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    const toastRoot = document.querySelector(
      "[data-popser-root]"
    ) as HTMLElement;

    // Before hover: collapsed
    expect(viewport.style.getPropertyValue("--popser-visible-count")).toBe("3");

    // Hover to expand
    act(() => {
      toastRoot.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });
    expect(viewport.style.getPropertyValue("--popser-visible-count")).toBe("8");

    // Leave to collapse
    act(() => {
      viewport.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(viewport.style.getPropertyValue("--popser-visible-count")).toBe("3");
  });
});

// ---------------------------------------------------------------------------
// 3. Close Button Position
// ---------------------------------------------------------------------------
describe("closeButtonPosition", () => {
  it("renders close button in header by default", () => {
    act(() => {
      root.render(<Toaster closeButton="always" />);
    });
    act(() => {
      toast("Test");
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    expect(closeBtn?.getAttribute("data-close-position")).toBe("header");
    // Should be inside the header (inside content)
    const header = document.querySelector("[data-popser-header]");
    expect(header?.contains(closeBtn!)).toBe(true);
  });

  it("renders close button in corner position", () => {
    act(() => {
      root.render(
        <Toaster closeButton="always" closeButtonPosition="corner" />
      );
    });
    act(() => {
      toast("Test");
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    expect(closeBtn?.getAttribute("data-close-position")).toBe("corner");
    // Should be outside content (direct child of Toast.Root)
    const header = document.querySelector("[data-popser-header]");
    expect(header?.contains(closeBtn!)).toBe(false);
  });

  it("per-toast closeButtonPosition overrides Toaster", () => {
    act(() => {
      root.render(
        <Toaster closeButton="always" closeButtonPosition="header" />
      );
    });
    act(() => {
      toast("Test", { closeButtonPosition: "corner" });
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    expect(closeBtn?.getAttribute("data-close-position")).toBe("corner");
    const header = document.querySelector("[data-popser-header]");
    expect(header?.contains(closeBtn!)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. Toast Entry Direction (enterFrom)
// ---------------------------------------------------------------------------
describe("enterFrom", () => {
  it("sets data-enter-from attribute when enterFrom is specified", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Slide left", { enterFrom: "left" });
    });
    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-enter-from")).toBe("left");
  });

  it("does not set data-enter-from when enterFrom is not specified", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Default");
    });
    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-enter-from")).toBeNull();
  });

  it("supports all four directions", () => {
    act(() => {
      root.render(<Toaster />);
    });
    for (const dir of ["top", "bottom", "left", "right"] as const) {
      act(() => {
        toast(`From ${dir}`, { enterFrom: dir, id: dir });
      });
      const el = document.querySelector(`[data-popser-id="${dir}"]`);
      expect(el?.getAttribute("data-enter-from")).toBe(dir);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. AbortSignal for Promise Toasts
// ---------------------------------------------------------------------------
describe("AbortSignal for toast.promise()", () => {
  it("dismisses toast when signal is aborted and no aborted handler", async () => {
    const controller = new AbortController();
    const manager = getManager();
    const closeSpy = vi.spyOn(manager, "close");

    const promise = new Promise<string>((resolve) => {
      setTimeout(() => resolve("done"), 10000);
    });

    act(() => {
      toast.promise(promise, {
        loading: "Loading...",
        success: "Done!",
        error: "Failed",
        signal: controller.signal,
      });
    });

    // Abort before promise resolves
    act(() => {
      controller.abort("cancelled");
    });

    // Process microtasks
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(closeSpy).toHaveBeenCalled();
  });

  it("shows aborted content when signal is aborted with aborted handler", () => {
    const controller = new AbortController();
    const manager = getManager();
    const updateSpy = vi.spyOn(manager, "update");

    const promise = new Promise<string>((resolve) => {
      setTimeout(() => resolve("done"), 10000);
    });

    act(() => {
      toast.promise(promise, {
        loading: "Loading...",
        success: "Done!",
        error: "Failed",
        signal: controller.signal,
        aborted: "Operation cancelled",
      });
    });

    act(() => {
      controller.abort("cancelled");
    });

    expect(updateSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        title: "Operation cancelled",
        type: "warning",
      })
    );
  });

  it("calls onAbort callback when signal is aborted", () => {
    const controller = new AbortController();
    const onAbort = vi.fn();

    const promise = new Promise<string>((resolve) => {
      setTimeout(() => resolve("done"), 10000);
    });

    act(() => {
      toast.promise(promise, {
        loading: "Loading...",
        success: "Done!",
        error: "Failed",
        signal: controller.signal,
        onAbort,
      });
    });

    act(() => {
      controller.abort("reason-x");
    });

    expect(onAbort).toHaveBeenCalledWith("reason-x");
  });

  it("is a no-op when abort fires after promise resolves", async () => {
    const controller = new AbortController();
    const manager = getManager();
    const updateSpy = vi.spyOn(manager, "update");

    let resolvePromise: (val: string) => void;
    const promise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });

    act(() => {
      toast.promise(promise, {
        loading: "Loading...",
        success: "Done!",
        error: "Failed",
        signal: controller.signal,
        aborted: "Cancelled",
      });
    });

    // Resolve first
    await act(async () => {
      resolvePromise!("ok");
      await Promise.resolve();
    });

    const updateCallsBefore = updateSpy.mock.calls.length;

    // Abort after resolve -- should be no-op
    act(() => {
      controller.abort("too late");
    });

    // The update spy should not have been called with "Cancelled" type "warning"
    const abortUpdates = updateSpy.mock.calls
      .slice(updateCallsBefore)
      .filter(([, opts]) => (opts as { type?: string }).type === "warning");
    expect(abortUpdates.length).toBe(0);
  });

  it("handles pre-aborted signal immediately", async () => {
    const controller = new AbortController();
    controller.abort("pre-aborted");

    const manager = getManager();
    const closeSpy = vi.spyOn(manager, "close");

    const promise = new Promise<string>((resolve) => {
      setTimeout(() => resolve("done"), 10000);
    });

    act(() => {
      toast.promise(promise, {
        loading: "Loading...",
        success: "Done!",
        error: "Failed",
        signal: controller.signal,
      });
    });

    // Process microtasks
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(closeSpy).toHaveBeenCalled();
  });

  it("supports function aborted handler with extended result", () => {
    const controller = new AbortController();
    const manager = getManager();
    const updateSpy = vi.spyOn(manager, "update");

    const promise = new Promise<string>((resolve) => {
      setTimeout(() => resolve("done"), 10000);
    });

    act(() => {
      toast.promise(promise, {
        loading: "Loading...",
        success: "Done!",
        error: "Failed",
        signal: controller.signal,
        aborted: (reason) => ({
          title: `Cancelled: ${reason}`,
          description: "Try again later",
        }),
      });
    });

    act(() => {
      controller.abort("timeout");
    });

    expect(updateSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        title: "Cancelled: timeout",
        type: "warning",
      })
    );
  });

  it("dismisses when function aborted handler returns undefined", async () => {
    const controller = new AbortController();
    const manager = getManager();
    const closeSpy = vi.spyOn(manager, "close");

    const promise = new Promise<string>((resolve) => {
      setTimeout(() => resolve("done"), 10000);
    });

    act(() => {
      toast.promise(promise, {
        loading: "Loading...",
        success: "Done!",
        error: "Failed",
        signal: controller.signal,
        aborted: () => undefined,
      });
    });

    act(() => {
      controller.abort();
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(closeSpy).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 6. RTL Support
// ---------------------------------------------------------------------------
describe("RTL support", () => {
  it("sets data-dir='rtl' when dir='rtl'", () => {
    act(() => {
      root.render(<Toaster dir="rtl" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-dir")).toBe("rtl");
  });

  it("does not set data-dir when dir is undefined", () => {
    act(() => {
      root.render(<Toaster />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-dir")).toBeNull();
  });

  it("does not set data-dir when dir='ltr'", () => {
    act(() => {
      root.render(<Toaster dir="ltr" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-dir")).toBeNull();
  });

  it("flips position from right to left in RTL", () => {
    act(() => {
      root.render(<Toaster dir="rtl" position="bottom-right" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-position")).toBe("bottom-left");
  });

  it("flips position from left to right in RTL", () => {
    act(() => {
      root.render(<Toaster dir="rtl" position="top-left" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-position")).toBe("top-right");
  });

  it("does not flip center positions in RTL", () => {
    act(() => {
      root.render(<Toaster dir="rtl" position="top-center" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-position")).toBe("top-center");
  });

  it("sets dir attribute on viewport", () => {
    act(() => {
      root.render(<Toaster dir="rtl" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("dir")).toBe("rtl");
  });

  it("auto detects document direction", () => {
    const origDir = document.documentElement.dir;
    document.documentElement.dir = "rtl";

    act(() => {
      root.render(<Toaster dir="auto" position="bottom-right" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-dir")).toBe("rtl");
    expect(viewport?.getAttribute("data-position")).toBe("bottom-left");

    document.documentElement.dir = origDir;
  });

  it("defaults to ltr for auto when document has no dir", () => {
    const origDir = document.documentElement.dir;
    document.documentElement.dir = "";

    act(() => {
      root.render(<Toaster dir="auto" position="bottom-right" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-dir")).toBeNull();
    expect(viewport?.getAttribute("data-position")).toBe("bottom-right");

    document.documentElement.dir = origDir;
  });
});

// ---------------------------------------------------------------------------
// 7. Toast History
// ---------------------------------------------------------------------------
describe("toast.getHistory()", () => {
  it("returns empty array when history is disabled", () => {
    const history = toast.getHistory();
    expect(history).toEqual([]);
  });

  it("records toast creation when history is enabled", () => {
    setHistoryLimit(50);
    toast("Hello");
    const history = toast.getHistory();
    expect(history.length).toBe(1);
    expect(history[0]?.title).toBe("Hello");
    expect(history[0]?.createdAt).toBeGreaterThan(0);
    expect(history[0]?.closedAt).toBeUndefined();
  });

  it("records toast closure with closedBy=manual", () => {
    setHistoryLimit(50);
    const id = toast("Close me");
    toast.close(id);
    const history = toast.getHistory();
    expect(history.length).toBe(1);
    expect(history[0]?.closedAt).toBeGreaterThan(0);
    expect(history[0]?.closedBy).toBe("manual");
  });

  it("respects historyLength limit (ring buffer)", () => {
    setHistoryLimit(3);
    toast("One");
    toast("Two");
    toast("Three");
    toast("Four");
    const history = toast.getHistory();
    expect(history.length).toBe(3);
    expect(history[0]?.title).toBe("Two");
    expect(history[2]?.title).toBe("Four");
  });

  it("returns immutable snapshot", () => {
    setHistoryLimit(10);
    toast("Test");
    const h1 = toast.getHistory();
    const h2 = toast.getHistory();
    expect(h1).not.toBe(h2);
    expect(h1[0]).not.toBe(h2[0]);
    expect(h1).toEqual(h2);
  });

  it("clearHistory empties the buffer", () => {
    setHistoryLimit(10);
    toast("One");
    toast("Two");
    expect(toast.getHistory().length).toBe(2);
    toast.clearHistory();
    expect(toast.getHistory().length).toBe(0);
  });

  it("records type from typed shortcuts", () => {
    setHistoryLimit(10);
    toast.success("Done");
    toast.error("Failed");
    const history = toast.getHistory();
    expect(history[0]?.type).toBe("success");
    expect(history[1]?.type).toBe("error");
  });

  it("Toaster historyLength prop configures history", () => {
    act(() => {
      root.render(<Toaster historyLength={20} />);
    });
    expect(getHistoryLimit()).toBe(20);
  });

  it("does not record when historyLength is 0", () => {
    act(() => {
      root.render(<Toaster historyLength={0} />);
    });
    act(() => {
      toast("No history");
    });
    expect(toast.getHistory().length).toBe(0);
  });

  it("records closedBy=manual for toast.close() with no args", () => {
    setHistoryLimit(10);
    toast("A");
    toast("B");
    toast.close();
    const history = toast.getHistory();
    expect(history.every((e) => e.closedBy === "manual")).toBe(true);
  });
});
