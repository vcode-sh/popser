import { getManager, resetManager } from "./manager.js";
import { clearActiveToasts, getActiveToastCount, toast } from "./toast.js";

describe("performance baseline", () => {
  beforeEach(() => {
    resetManager();
    clearActiveToasts();
  });

  it("creates 100 toasts in sequence under 100ms", () => {
    const start = performance.now();

    for (let i = 0; i < 100; i++) {
      toast(`Toast ${i}`);
    }

    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
    expect(getActiveToastCount()).toBe(100);
  });

  it("creates 100 toasts and closes all under 200ms", () => {
    const start = performance.now();

    for (let i = 0; i < 100; i++) {
      toast(`Toast ${i}`);
    }

    expect(getActiveToastCount()).toBe(100);

    toast.close();

    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
    expect(getActiveToastCount()).toBe(0);
  });

  it("updates a toast 100 times under 100ms", () => {
    const id = toast("Initial");

    const start = performance.now();

    for (let i = 0; i < 100; i++) {
      toast.update(id, { title: `Update ${i}` });
    }

    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it("cleans up activeToasts after creating and closing 1000 toasts", () => {
    const ids: string[] = [];

    for (let i = 0; i < 1000; i++) {
      ids.push(toast(`Toast ${i}`));
    }

    expect(getActiveToastCount()).toBe(1000);

    for (const id of ids) {
      toast.close(id);
    }

    expect(getActiveToastCount()).toBe(0);
  });

  it("resolves 50 concurrent promise toasts correctly", async () => {
    const promises: Promise<number>[] = [];

    for (let i = 0; i < 50; i++) {
      const p = toast.promise(Promise.resolve(i), {
        loading: `Loading ${i}...`,
        success: (result: number) => `Done: ${result}`,
        error: "Failed",
      });
      promises.push(p);
    }

    const results = await Promise.all(promises);

    expect(results).toHaveLength(50);
    for (let i = 0; i < 50; i++) {
      expect(results[i]).toBe(i);
    }
  });

  it("returns the same manager instance across 1000 calls", () => {
    const first = getManager();

    for (let i = 0; i < 1000; i++) {
      expect(getManager()).toBe(first);
    }
  });

  // ---------------------------------------------------------------------------
  // v0.2.0: Toast tracker O(1) optimization (B5)
  // ---------------------------------------------------------------------------

  describe("toast tracker O(1) optimization (B5)", () => {
    it("creates 1000 deduplicated toasts, closes individually under 200ms", () => {
      const ids: string[] = [];
      const start = performance.now();

      // Create 1000 unique deduplicated toasts
      for (let i = 0; i < 1000; i++) {
        ids.push(toast(`Dedup toast ${i}`, { deduplicate: true }));
      }

      expect(getActiveToastCount()).toBe(1000);

      // Close them individually (this exercises the O(1) untrack path)
      for (const id of ids) {
        toast.close(id);
      }

      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(200);
      expect(getActiveToastCount()).toBe(0);
    });

    it("all tracking maps are cleaned up after close", () => {
      const ids: string[] = [];

      for (let i = 0; i < 100; i++) {
        ids.push(toast(`Tracked ${i}`, { deduplicate: true }));
      }

      expect(getActiveToastCount()).toBe(100);

      // Close individually
      for (const id of ids) {
        toast.close(id);
      }

      expect(getActiveToastCount()).toBe(0);

      // Verify dedup titles are cleaned up
      // Creating a new toast with a previously used title should work
      const newId = toast("Tracked 0", { deduplicate: true });
      expect(getActiveToastCount()).toBe(1);
      // Should not be the same ID as the old one
      expect(ids).not.toContain(newId);
      toast.close(newId);
    });

    it("onClose callback also cleans up O(1) tracking maps", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      for (let i = 0; i < 50; i++) {
        toast(`Auto close ${i}`, { deduplicate: true });
      }

      expect(getActiveToastCount()).toBe(50);

      // Simulate Base UI auto-close for all toasts
      for (let i = 0; i < 50; i++) {
        const callArgs = addSpy.mock.calls[i]?.[0] as {
          onClose?: () => void;
        };
        callArgs.onClose?.();
      }

      expect(getActiveToastCount()).toBe(0);
    });
  });
});
