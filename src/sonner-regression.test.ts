import { clearManager, getManager, resetManager } from "./manager.js";
import {
  clearActiveToasts,
  clearManualCloseFlags,
  getActiveToastCount,
  getActiveToastTitles,
  isActiveToast,
  toast,
} from "./toast.js";

/**
 * Regression tests proving popser fixes known Sonner bugs.
 *
 * Each describe block references the relevant Sonner GitHub issue number
 * where applicable. These tests are the library's selling point -- they
 * demonstrate that the exact failure modes from Sonner are handled correctly.
 */
describe("Sonner regression tests", () => {
  beforeEach(() => {
    resetManager();
    clearActiveToasts();
    clearManualCloseFlags();
  });

  // ---------------------------------------------------------------------------
  // 1. Memory leak fix (Sonner #729)
  // Sonner keeps dismissed toasts in a global `this.toasts` array forever.
  // Popser uses an `activeToasts` Set that is cleaned up on close.
  // ---------------------------------------------------------------------------
  describe("Memory leak fix (Sonner #729)", () => {
    it("removes toast ID from activeToasts after toast.close(id)", () => {
      const id = toast("Leaky toast");
      expect(isActiveToast(id)).toBe(true);
      expect(getActiveToastCount()).toBe(1);

      toast.close(id);

      expect(isActiveToast(id)).toBe(false);
      expect(getActiveToastCount()).toBe(0);
    });

    it("clears all IDs from activeToasts after toast.close() with no args", () => {
      toast("Toast 1");
      toast("Toast 2");
      toast("Toast 3");
      expect(getActiveToastCount()).toBe(3);

      toast.close();

      expect(getActiveToastCount()).toBe(0);
    });

    it("activeToasts does not grow unbounded after repeated create/close cycles", () => {
      for (let i = 0; i < 100; i++) {
        const id = toast(`Toast ${i}`);
        toast.close(id);
      }

      expect(getActiveToastCount()).toBe(0);
    });

    it("activeToasts size stays correct when mixing individual and bulk closes", () => {
      const id1 = toast("First");
      const id2 = toast("Second");
      toast("Third");

      // Close one individually
      toast.close(id1);
      expect(getActiveToastCount()).toBe(2);
      expect(isActiveToast(id1)).toBe(false);

      // Close another individually
      toast.close(id2);
      expect(getActiveToastCount()).toBe(1);

      // Close remaining via close-all
      toast.close();
      expect(getActiveToastCount()).toBe(0);
    });

    it("closing an already-closed toast ID does not throw or corrupt state", () => {
      const id = toast("Ephemeral");
      toast.close(id);
      expect(getActiveToastCount()).toBe(0);

      // Closing again should be a no-op
      expect(() => toast.close(id)).not.toThrow();
      expect(getActiveToastCount()).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Close-all works (Sonner missing feature)
  // Sonner had no `closeAll()` or `dismiss()` without args.
  // Popser's `toast.close()` (no args) iterates activeToasts and closes each.
  // ---------------------------------------------------------------------------
  describe("Close-all works (Sonner missing feature)", () => {
    it("calls manager.close() for every active toast when no ID given", () => {
      const manager = getManager();
      const closeSpy = vi.spyOn(manager, "close");

      const id1 = toast("First");
      const id2 = toast("Second");
      const id3 = toast("Third");

      toast.close();

      expect(closeSpy).toHaveBeenCalledWith(id1);
      expect(closeSpy).toHaveBeenCalledWith(id2);
      expect(closeSpy).toHaveBeenCalledWith(id3);
      expect(closeSpy).toHaveBeenCalledTimes(3);
    });

    it("close-all is idempotent when called multiple times", () => {
      const manager = getManager();
      const closeSpy = vi.spyOn(manager, "close");

      toast("One");
      toast("Two");

      toast.close();
      expect(closeSpy).toHaveBeenCalledTimes(2);

      // Second call should do nothing -- no active toasts left
      toast.close();
      expect(closeSpy).toHaveBeenCalledTimes(2);
      expect(getActiveToastCount()).toBe(0);
    });

    it("close-all works with mixed toast types", () => {
      const manager = getManager();
      const closeSpy = vi.spyOn(manager, "close");

      const id1 = toast.success("Done");
      const id2 = toast.error("Failed");
      const id3 = toast.warning("Watch out");
      const id4 = toast.info("FYI");
      const id5 = toast.loading("Working...");

      toast.close();

      expect(closeSpy).toHaveBeenCalledTimes(5);
      expect(closeSpy).toHaveBeenCalledWith(id1);
      expect(closeSpy).toHaveBeenCalledWith(id2);
      expect(closeSpy).toHaveBeenCalledWith(id3);
      expect(closeSpy).toHaveBeenCalledWith(id4);
      expect(closeSpy).toHaveBeenCalledWith(id5);
      expect(getActiveToastCount()).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Update resets type/icon (Sonner #401)
  // Sonner's loading state was not cleared when updating a toast by ID.
  // Popser's update() properly forwards type changes to the manager.
  // ---------------------------------------------------------------------------
  describe("Update resets type/icon (Sonner #401)", () => {
    it("updates type from loading to success", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast.loading("Processing...");

      toast.update(id, { type: "success", title: "Done!" });

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          type: "success",
          title: "Done!",
        })
      );
    });

    it("updates type from loading to error", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast.loading("Processing...");

      toast.update(id, { type: "error", title: "Failed" });

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          type: "error",
          title: "Failed",
        })
      );
    });

    it("updates icon in data when changing from loading to custom icon", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast.loading("Working...");

      toast.update(id, { icon: "check-icon", type: "success" });

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          type: "success",
          data: expect.objectContaining({ icon: "check-icon" }),
        })
      );
    });

    it("can suppress icon entirely with icon: false on update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast.success("Done");

      toast.update(id, { icon: false });

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          data: expect.objectContaining({ icon: false }),
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Deduplication by ID (Sonner #692)
  // Sonner's action button state bled into subsequent toasts with the same ID.
  // Popser passes the ID to Base UI which handles dedup. The activeToasts Set
  // naturally deduplicates since it's a Set.
  // ---------------------------------------------------------------------------
  describe("Deduplication by ID (Sonner #692)", () => {
    it("calls manager.add() with the same custom ID for both toasts", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("First version", { id: "dedup-test" });
      toast("Second version", { id: "dedup-test" });

      expect(addSpy).toHaveBeenCalledTimes(2);
      expect(addSpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ id: "dedup-test", title: "First version" })
      );
      expect(addSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ id: "dedup-test", title: "Second version" })
      );
    });

    it("activeToasts contains the ID only once (Set behavior)", () => {
      toast("First", { id: "unique-id" });
      toast("Second", { id: "unique-id" });

      expect(getActiveToastCount()).toBe(1);
      expect(isActiveToast("unique-id")).toBe(true);
    });

    it("closing a deduplicated ID fully removes it from tracking", () => {
      toast("First", { id: "dedup" });
      toast("Second", { id: "dedup" });

      expect(getActiveToastCount()).toBe(1);

      toast.close("dedup");

      expect(getActiveToastCount()).toBe(0);
      expect(isActiveToast("dedup")).toBe(false);
    });

    it("each toast with same ID gets fresh data (no action bleed)", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const action1 = { label: "Undo", onClick: vi.fn() };
      const action2 = { label: "Retry", onClick: vi.fn() };

      toast("First", { id: "shared", action: action1 });
      toast("Second", { id: "shared", action: action2 });

      const firstCallData = (
        addSpy.mock.calls[0]?.[0] as { data: { action: unknown } }
      ).data;
      const secondCallData = (
        addSpy.mock.calls[1]?.[0] as { data: { action: unknown } }
      ).data;

      expect(firstCallData.action).toBe(action1);
      expect(secondCallData.action).toBe(action2);
      expect(firstCallData.action).not.toBe(secondCallData.action);
    });
  });

  // ---------------------------------------------------------------------------
  // 5. toast.update() with onClose/onRemove (uncovered lines 238-239)
  // These lines pass onClose and onRemove through to manager.update() and
  // were previously uncovered by tests.
  // ---------------------------------------------------------------------------
  describe("toast.update() with onClose/onRemove", () => {
    it("passes onClose through to manager.update() (wrapped for tracking)", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const onCloseFn = vi.fn();

      const id = toast("Hello");

      toast.update(id, { onClose: onCloseFn });

      // onClose is now wrapped to include internal tracking cleanup,
      // so we verify it's a function and that invoking it calls the original
      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        onClose?: () => void;
      };
      expect(typeof updateArgs.onClose).toBe("function");
      updateArgs.onClose?.();
      expect(onCloseFn).toHaveBeenCalledOnce();
    });

    it("passes onRemove through to manager.update()", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const onRemoveFn = vi.fn();

      const id = toast("Hello");

      toast.update(id, { onRemove: onRemoveFn });

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ onRemove: onRemoveFn })
      );
    });

    it("passes both onClose and onRemove together", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const onCloseFn = vi.fn();
      const onRemoveFn = vi.fn();

      const id = toast("Hello");

      toast.update(id, { onClose: onCloseFn, onRemove: onRemoveFn });

      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        onClose?: () => void;
        onRemove?: () => void;
      };
      // onClose is wrapped, onRemove is passed raw
      expect(typeof updateArgs.onClose).toBe("function");
      updateArgs.onClose?.();
      expect(onCloseFn).toHaveBeenCalledOnce();
      expect(updateArgs.onRemove).toBe(onRemoveFn);
    });

    it("does not include onClose in update when not provided", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Hello");

      toast.update(id, { title: "Updated" });

      const updateArgs = updateSpy.mock.calls[0]?.[1] as Record<
        string,
        unknown
      >;
      expect(updateArgs).not.toHaveProperty("onClose");
      expect(updateArgs).not.toHaveProperty("onRemove");
    });
  });

  // ---------------------------------------------------------------------------
  // 6. toast.update() with partial data
  // Sonner only allowed full replacement. Popser's update() uses conditional
  // spreading so only provided fields are included in the update payload.
  // ---------------------------------------------------------------------------
  describe("toast.update() with partial data", () => {
    it("updates only icon without clobbering action or cancel", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Hello", {
        action: { label: "Undo", onClick: vi.fn() },
        cancel: { label: "Dismiss", onClick: vi.fn() },
      });

      toast.update(id, { icon: "new-icon" });

      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        data: Record<string, unknown>;
      };

      // Icon should be present in data
      expect(updateArgs.data.icon).toBe("new-icon");

      // Action and cancel should NOT be in the update payload
      // (undefined fields are not spread, so they won't overwrite existing values)
      expect(updateArgs.data).not.toHaveProperty("action");
      expect(updateArgs.data).not.toHaveProperty("cancel");
    });

    it("updates only className without affecting icon", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Hello", { icon: "original-icon" });

      toast.update(id, { className: "highlighted" });

      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        data: Record<string, unknown>;
      };

      expect(updateArgs.data.className).toBe("highlighted");
      expect(updateArgs.data).not.toHaveProperty("icon");
    });

    it("updates only style without affecting className", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Hello", { className: "my-toast" });

      toast.update(id, { style: { color: "red" } });

      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        data: Record<string, unknown>;
      };

      expect(updateArgs.data.style).toEqual({ color: "red" });
      expect(updateArgs.data).not.toHaveProperty("className");
    });

    it("updates title and type without touching data fields", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Hello", {
        icon: "star",
        action: { label: "Undo", onClick: vi.fn() },
      });

      toast.update(id, { title: "Updated", type: "success" });

      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        title: string;
        type: string;
        data: Record<string, unknown>;
      };

      expect(updateArgs.title).toBe("Updated");
      expect(updateArgs.type).toBe("success");

      // Data fields from the original toast should not appear in the update
      expect(updateArgs.data).not.toHaveProperty("icon");
      expect(updateArgs.data).not.toHaveProperty("action");
    });

    it("merges custom data with popser data fields on update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Hello");

      toast.update(id, {
        icon: "star",
        data: { custom: "value", nested: { key: true } },
      });

      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        data: Record<string, unknown>;
      };

      expect(updateArgs.data.icon).toBe("star");
      expect(updateArgs.data.custom).toBe("value");
      expect(updateArgs.data.nested).toEqual({ key: true });
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Promise toast maps types correctly
  // Verifies the full lifecycle: loading -> success or loading -> error,
  // with correct type mapping at each stage.
  // ---------------------------------------------------------------------------
  describe("Promise toast maps types correctly", () => {
    it("maps loading state to type: loading", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");

      const p = Promise.resolve("ok");
      await toast.promise(p, {
        loading: "Loading...",
        success: "Done!",
        error: "Failed",
      });

      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          loading: { title: "Loading...", type: "loading" },
        })
      );
    });

    it("maps success state to type: success (string handler)", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");

      const p = Promise.resolve("result");
      await toast.promise(p, {
        loading: "Working...",
        success: "All done!",
        error: "Oops",
      });

      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          success: { title: "All done!", type: "success" },
        })
      );
    });

    it("maps error state to type: error (string handler)", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");

      const p = Promise.reject(new Error("boom"));
      await toast
        .promise(p, {
          loading: "Working...",
          success: "Done",
          error: "Something broke",
        })
        .catch(() => {});

      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          error: { title: "Something broke", type: "error" },
        })
      );
    });

    it("maps success function handler to type: success", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");

      const p = Promise.resolve(42);
      await toast.promise(p, {
        loading: "Calculating...",
        success: (result: number) => `Answer is ${result}`,
        error: "Failed",
      });

      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        success: (result: number) => { title: string; type: string };
      };

      expect(typeof callArgs.success).toBe("function");
      const mapped = callArgs.success(42);
      expect(mapped).toEqual({ title: "Answer is 42", type: "success" });
    });

    it("maps error function handler to type: error", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");

      const err = new Error("network timeout");
      const p = Promise.reject(err);
      await toast
        .promise(p, {
          loading: "Fetching...",
          success: "Fetched!",
          error: (e: unknown) =>
            `Error: ${e instanceof Error ? e.message : "unknown"}`,
        })
        .catch(() => {});

      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        error: (e: unknown) => { title: string; type: string };
      };

      expect(typeof callArgs.error).toBe("function");
      const mapped = callArgs.error(err);
      expect(mapped).toEqual({
        title: "Error: network timeout",
        type: "error",
      });
    });

    it("full lifecycle: loading -> success preserves correct types", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");

      const p = Promise.resolve("data");
      const result = await toast.promise(p, {
        loading: "Loading data...",
        success: "Data loaded!",
        error: "Load failed",
      });

      expect(result).toBe("data");

      const options = promiseSpy.mock.calls[0]?.[1] as {
        loading: { title: string; type: string };
        success: { title: string; type: string };
        error: { title: string; type: string };
      };

      expect(options.loading.type).toBe("loading");
      expect(options.success.type).toBe("success");
      expect(options.error.type).toBe("error");
    });

    it("full lifecycle: loading -> error preserves correct types", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");

      const err = new Error("fail");
      const p = Promise.reject(err);
      await toast
        .promise(p, {
          loading: "Saving...",
          success: "Saved!",
          error: "Save failed",
        })
        .catch(() => {});

      const options = promiseSpy.mock.calls[0]?.[1] as {
        loading: { title: string; type: string };
        success: { title: string; type: string };
        error: { title: string; type: string };
      };

      expect(options.loading.type).toBe("loading");
      expect(options.success.type).toBe("success");
      expect(options.error.type).toBe("error");
    });
  });

  // ---------------------------------------------------------------------------
  // 8. Priority accessibility (Sonner missing)
  // Sonner has no priority system. Popser passes `priority: "high"` to the
  // manager so Base UI uses assertive ARIA live regions for screen readers.
  // ---------------------------------------------------------------------------
  describe("Priority accessibility (Sonner missing)", () => {
    it("passes priority: high through to manager.add()", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("Urgent notification", { priority: "high" });

      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ priority: "high" })
      );
    });

    it("passes priority: low through to manager.add()", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("Background info", { priority: "low" });

      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ priority: "low" })
      );
    });

    it("does not include priority when not specified", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("Normal toast");

      const callArgs = addSpy.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(callArgs.priority).toBeUndefined();
    });

    it("priority works with type shortcuts", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast.error("Connection lost", { priority: "high" });

      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          priority: "high",
        })
      );
    });

    it("priority can be updated on an existing toast", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Info", { priority: "low" });

      toast.update(id, { priority: "high" });

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ priority: "high" })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 9. Persistent toast (Sonner duration: Infinity workaround)
  // Sonner required `duration: Infinity` which was buggy. Popser uses
  // `timeout: 0` to mean "never auto-dismiss".
  // ---------------------------------------------------------------------------
  describe("Persistent toast (Sonner duration: Infinity workaround)", () => {
    it("passes timeout: 0 to manager for persistent toasts", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("Persistent notification", { timeout: 0 });

      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ timeout: 0 })
      );
    });

    it("persistent toast with action buttons (common pattern)", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast.error("Connection lost", {
        timeout: 0,
        action: { label: "Retry", onClick: vi.fn() },
        cancel: { label: "Dismiss" },
      });

      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          timeout: 0,
          data: expect.objectContaining({
            action: expect.objectContaining({ label: "Retry" }),
            cancel: expect.objectContaining({ label: "Dismiss" }),
          }),
        })
      );
    });

    it("persistent toast can be manually closed", () => {
      const id = toast("Sticky", { timeout: 0 });
      expect(isActiveToast(id)).toBe(true);

      toast.close(id);

      expect(isActiveToast(id)).toBe(false);
    });

    it("persistent toast can be updated to auto-dismiss", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Persistent", { timeout: 0 });

      toast.update(id, { timeout: 5000 });

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ timeout: 5000 })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 10. Active toast cleanup on onClose callback
  // When Base UI fires the onClose callback (e.g., on swipe dismiss or
  // auto-dismiss), the wrapped callback removes the ID from activeToasts
  // even if the user never explicitly called toast.close().
  // ---------------------------------------------------------------------------
  describe("Active toast cleanup on onClose callback", () => {
    it("removes ID from activeToasts when wrapped onClose fires", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const userOnClose = vi.fn();

      const id = toast("Auto-dismiss", { onClose: userOnClose });
      expect(isActiveToast(id)).toBe(true);

      // Simulate Base UI firing the onClose callback (e.g., swipe dismiss)
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      callArgs.onClose();

      expect(isActiveToast(id)).toBe(false);
      expect(userOnClose).toHaveBeenCalledOnce();
    });

    it("removes ID from activeToasts even without user-provided onClose", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const id = toast("No callback toast");
      expect(isActiveToast(id)).toBe(true);

      // Simulate Base UI auto-dismissing the toast
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      callArgs.onClose();

      expect(isActiveToast(id)).toBe(false);
    });

    it("does not throw if onClose fires after manual toast.close()", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const id = toast("Double close");

      // Manually close first
      toast.close(id);
      expect(isActiveToast(id)).toBe(false);

      // Then Base UI's onClose fires (race condition scenario)
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      expect(() => callArgs.onClose()).not.toThrow();
      expect(isActiveToast(id)).toBe(false);
    });

    it("onClose callback correctly resolves ID for auto-generated IDs", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      // Create toast without explicit ID (auto-generated)
      const id = toast("Auto ID");
      expect(id.length).toBeGreaterThan(0);
      expect(isActiveToast(id)).toBe(true);

      // The wrapped onClose should have captured the resolved ID
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      callArgs.onClose();

      expect(isActiveToast(id)).toBe(false);
    });

    it("onClose cleanup works correctly across multiple toasts", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const id1 = toast("Toast 1");
      const id2 = toast("Toast 2");
      const id3 = toast("Toast 3");

      expect(getActiveToastCount()).toBe(3);

      // Simulate only the middle toast being dismissed by Base UI
      const secondCallArgs = addSpy.mock.calls[1]?.[0] as {
        onClose: () => void;
      };
      secondCallArgs.onClose();

      expect(isActiveToast(id1)).toBe(true);
      expect(isActiveToast(id2)).toBe(false);
      expect(isActiveToast(id3)).toBe(true);
      expect(getActiveToastCount()).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // 11. Toast ID in DOM (Sonner #714)
  // Sonner does not expose toast IDs as data attributes, making it impossible
  // for e2e tests (Playwright/Cypress) to target specific toasts. Popser
  // renders `data-popser-id` on every toast root element.
  // ---------------------------------------------------------------------------
  describe("Toast ID in DOM (Sonner #714)", () => {
    it("toast() returns a string ID that can be used as a DOM selector", () => {
      const id = toast("Testable toast");
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
      // The ID should be a valid CSS attribute selector value
      expect(id).not.toContain('"');
    });

    it("custom ID is preserved for use as data-popser-id", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("Custom ID toast", { id: "playwright-target" });

      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ id: "playwright-target" })
      );
    });

    it("each toast gets a unique ID for independent DOM targeting", () => {
      const id1 = toast("First");
      const id2 = toast("Second");
      const id3 = toast("Third");

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it("typed toast variants all return IDs for DOM targeting", () => {
      const successId = toast.success("Done");
      const errorId = toast.error("Failed");
      const warningId = toast.warning("Careful");
      const infoId = toast.info("Note");
      const loadingId = toast.loading("Working...");

      for (const id of [successId, errorId, warningId, infoId, loadingId]) {
        expect(typeof id).toBe("string");
        expect(id.length).toBeGreaterThan(0);
      }

      // All unique
      const ids = new Set([successId, errorId, warningId, infoId, loadingId]);
      expect(ids.size).toBe(5);
    });

    it("custom ID survives update and remains the same for DOM queries", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Original", { id: "stable-id" });
      expect(id).toBe("stable-id");

      toast.update(id, { title: "Updated" });

      // update() is called with the same ID -- the DOM selector stays valid
      expect(updateSpy).toHaveBeenCalledWith("stable-id", expect.anything());
    });
  });

  // ---------------------------------------------------------------------------
  // 12. Pre-mount guard (Sonner #723)
  // Sonner silently drops toasts called before `<Toaster>` mounts.
  // Popser's manager is a lazy singleton created on first `toast()` call,
  // so toasts are never lost even if no Provider/Toaster is mounted yet.
  // ---------------------------------------------------------------------------
  describe("Pre-mount guard (Sonner #723)", () => {
    beforeEach(() => {
      clearManager();
      clearActiveToasts();
    });

    it("calling toast() before any Toaster mount returns a valid ID", () => {
      // Manager is null (no Toaster has mounted), simulating pre-mount state
      const id = toast("Pre-mount toast");

      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("toast() before mount adds the ID to activeToasts", () => {
      const id = toast("Queued toast");

      expect(isActiveToast(id)).toBe(true);
      expect(getActiveToastCount()).toBe(1);
    });

    it("manager is lazily created on first toast() call", () => {
      // Before any toast call, getManager will create one on demand.
      // The key behavior: calling toast() triggers getManager() which
      // creates the manager if it doesn't exist yet.
      const id = toast("Lazy creation");

      // After the first toast(), the manager exists and works
      const manager = getManager();
      expect(manager).toBeDefined();
      expect(typeof manager.add).toBe("function");
      expect(typeof manager.close).toBe("function");

      // The toast was tracked
      expect(isActiveToast(id)).toBe(true);
    });

    it("multiple toast() calls before mount all get tracked", () => {
      const id1 = toast("First pre-mount");
      const id2 = toast.success("Second pre-mount");
      const id3 = toast.error("Third pre-mount");
      const id4 = toast.warning("Fourth pre-mount");
      const id5 = toast.info("Fifth pre-mount");

      expect(getActiveToastCount()).toBe(5);
      expect(isActiveToast(id1)).toBe(true);
      expect(isActiveToast(id2)).toBe(true);
      expect(isActiveToast(id3)).toBe(true);
      expect(isActiveToast(id4)).toBe(true);
      expect(isActiveToast(id5)).toBe(true);
    });

    it("toasts created before mount can be closed", () => {
      const id = toast("Closable pre-mount");
      expect(isActiveToast(id)).toBe(true);

      toast.close(id);
      expect(isActiveToast(id)).toBe(false);
      expect(getActiveToastCount()).toBe(0);
    });

    it("toasts created before mount can be updated", () => {
      const id = toast.loading("Loading before mount...");
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      toast.update(id, { type: "success", title: "Done!" });

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          type: "success",
          title: "Done!",
        })
      );
    });

    it("close-all works on toasts created before mount", () => {
      toast("Pre-mount 1");
      toast("Pre-mount 2");
      toast("Pre-mount 3");
      expect(getActiveToastCount()).toBe(3);

      toast.close();
      expect(getActiveToastCount()).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // 13. Headless mode behavior intact (Sonner #632, #633)
  // Sonner gates positioning/stacking CSS behind `data-styled='true'`, breaking
  // unstyled/headless mode. Popser's imperative API works identically regardless
  // of whether CSS is imported, because styling is decoupled from data flow.
  // ---------------------------------------------------------------------------
  describe("Headless mode behavior intact (Sonner #632, #633)", () => {
    it("createToast works with all option fields when no styles imported", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const action = { label: "Undo", onClick: vi.fn() };
      const cancel = { label: "Dismiss", onClick: vi.fn() };
      const onCloseFn = vi.fn();
      const onRemoveFn = vi.fn();

      const id = toast("Headless toast", {
        type: "success",
        description: "No styles needed",
        timeout: 5000,
        priority: "high",
        icon: "custom-icon",
        action,
        cancel,
        onClose: onCloseFn,
        onRemove: onRemoveFn,
        className: "my-toast",
        style: { background: "red" },
        data: { custom: "field" },
      });

      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Headless toast",
          type: "success",
          description: "No styles needed",
          timeout: 5000,
          priority: "high",
          onRemove: onRemoveFn,
          data: expect.objectContaining({
            icon: "custom-icon",
            action,
            cancel,
            className: "my-toast",
            style: { background: "red" },
            custom: "field",
          }),
        })
      );
    });

    it("icon can be suppressed with icon: false", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("No icon toast", { icon: false });

      const callArgs = addSpy.mock.calls[0]?.[0] as {
        data: { icon: unknown };
      };
      expect(callArgs.data.icon).toBe(false);
    });

    it("custom className replaces default via data pass-through", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("Styled toast", { className: "custom-class" });

      const callArgs = addSpy.mock.calls[0]?.[0] as {
        data: { className: string };
      };
      expect(callArgs.data.className).toBe("custom-class");
    });

    it("unstyled toast still gets proper type and data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast.error("Unstyled error", {
        icon: "error-icon",
        className: "unstyled-toast",
      });

      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          title: "Unstyled error",
          data: expect.objectContaining({
            icon: "error-icon",
            className: "unstyled-toast",
          }),
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 14. Undefined ID handling (Sonner #679)
  // Sonner's `{ id: undefined }` overwrites auto-generated ID, causing
  // duplicates and broken close/update behavior. Popser passes `id: undefined`
  // through to Base UI which ignores it and auto-generates a valid ID.
  // ---------------------------------------------------------------------------
  describe("Undefined ID handling (Sonner #679)", () => {
    it("passing { id: undefined } does not corrupt the returned ID", () => {
      const id = toast("Auto ID toast", { id: undefined });

      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
      expect(id).not.toBe("undefined");
    });

    it("passing { id: undefined } still adds toast to activeToasts", () => {
      const id = toast("Tracked toast", { id: undefined });

      expect(isActiveToast(id)).toBe(true);
      expect(getActiveToastCount()).toBe(1);
    });

    it("passing explicit string ID works correctly", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const id = toast("Explicit ID", { id: "my-explicit-id" });

      expect(id).toBe("my-explicit-id");
      expect(isActiveToast("my-explicit-id")).toBe(true);
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ id: "my-explicit-id" })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 15. Action button state isolation (Sonner #692 extended)
  // Sonner's action buttons bleed state between toasts with the same ID.
  // Popser creates a fresh `data` bag for every `add()` / `update()` call,
  // ensuring complete isolation.
  // ---------------------------------------------------------------------------
  describe("Action button state isolation (Sonner #692 extended)", () => {
    it("updating a toast with new action completely replaces previous action in data", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const originalAction = { label: "Undo", onClick: vi.fn() };
      const newAction = { label: "Retry", onClick: vi.fn() };

      const id = toast("Action toast", { action: originalAction });

      toast.update(id, { action: newAction });

      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        data: { action: typeof newAction };
      };
      expect(updateArgs.data.action).toBe(newAction);
      expect(updateArgs.data.action).not.toBe(originalAction);
      expect(updateArgs.data.action.label).toBe("Retry");
    });

    it("updating with cancel: undefined does not include cancel in the update payload", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Cancel toast", {
        cancel: { label: "Dismiss", onClick: vi.fn() },
      });

      // Passing cancel: undefined should not spread cancel into data
      toast.update(id, { title: "Updated" });

      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        data: Record<string, unknown>;
      };
      expect(updateArgs.data).not.toHaveProperty("cancel");
    });

    it("creating sequential toasts with same ID gets independent action handlers", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      toast("First", {
        id: "shared-id",
        action: { label: "A", onClick: handler1 },
      });
      toast("Second", {
        id: "shared-id",
        action: { label: "B", onClick: handler2 },
      });
      toast("Third", {
        id: "shared-id",
        action: { label: "C", onClick: handler3 },
      });

      const call1Data = (
        addSpy.mock.calls[0]?.[0] as {
          data: { action: { onClick: typeof handler1 } };
        }
      ).data;
      const call2Data = (
        addSpy.mock.calls[1]?.[0] as {
          data: { action: { onClick: typeof handler2 } };
        }
      ).data;
      const call3Data = (
        addSpy.mock.calls[2]?.[0] as {
          data: { action: { onClick: typeof handler3 } };
        }
      ).data;

      expect(call1Data.action.onClick).toBe(handler1);
      expect(call2Data.action.onClick).toBe(handler2);
      expect(call3Data.action.onClick).toBe(handler3);

      // All three handlers are distinct references
      expect(call1Data.action.onClick).not.toBe(call2Data.action.onClick);
      expect(call2Data.action.onClick).not.toBe(call3Data.action.onClick);
    });
  });

  // ---------------------------------------------------------------------------
  // 16. Loading toast persistence (Sonner #652)
  // Sonner's loading toasts break in headless mode -- spinner persists and
  // auto-dismiss is broken. Popser's loading type is just data; the rendering
  // layer and dismiss logic are independent.
  // ---------------------------------------------------------------------------
  describe("Loading toast persistence (Sonner #652)", () => {
    it("loading toast type is correctly set to 'loading'", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast.loading("Please wait...");

      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "loading" })
      );
    });

    it("loading toast can be updated to any other type", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast.loading("Loading...");

      toast.update(id, { type: "success", title: "Loaded!" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ type: "success", title: "Loaded!" })
      );

      toast.update(id, { type: "error", title: "Failed" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ type: "error", title: "Failed" })
      );

      toast.update(id, { type: "warning", title: "Caution" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ type: "warning", title: "Caution" })
      );

      toast.update(id, { type: "info", title: "Note" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ type: "info", title: "Note" })
      );
    });

    it("loading toast can be closed manually", () => {
      const id = toast.loading("Processing...");
      expect(isActiveToast(id)).toBe(true);

      toast.close(id);

      expect(isActiveToast(id)).toBe(false);
      expect(getActiveToastCount()).toBe(0);
    });

    it("loading toast with custom icon: icon override takes priority via data.icon", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast.loading("Custom loading...", { icon: "custom-spinner" });

      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "loading",
          data: expect.objectContaining({ icon: "custom-spinner" }),
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 17. Full options roundtrip
  // Verify that ALL PopserOptions fields are correctly forwarded through the
  // imperative API to the underlying manager, with the correct shape split
  // between top-level fields and the `data` bag.
  // ---------------------------------------------------------------------------
  describe("Full options roundtrip", () => {
    it("creates a toast with every single option field populated", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const action = { label: "Confirm", onClick: vi.fn() };
      const cancel = { label: "Cancel", onClick: vi.fn() };
      const onCloseFn = vi.fn();
      const onRemoveFn = vi.fn();
      const customStyle = { backgroundColor: "#333", color: "white" };

      const id = toast("Full options toast", {
        id: "full-roundtrip",
        type: "success",
        description: "All fields populated",
        timeout: 8000,
        priority: "high",
        icon: "star-icon",
        action,
        cancel,
        onClose: onCloseFn,
        onRemove: onRemoveFn,
        className: "full-options-class",
        style: customStyle,
        data: { customField: "hello", nested: { deep: true } },
      });

      expect(id).toBe("full-roundtrip");
      expect(addSpy).toHaveBeenCalledTimes(1);
    });

    it("manager.add() receives the correct shape for each field", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const action = { label: "OK", onClick: vi.fn() };
      const cancel = { label: "Nah" };
      const onCloseFn = vi.fn();
      const onRemoveFn = vi.fn();

      toast("Shape test", {
        id: "shape-check",
        type: "warning",
        description: "Verify shape",
        timeout: 3000,
        priority: "low",
        icon: "warn-icon",
        action,
        cancel,
        onClose: onCloseFn,
        onRemove: onRemoveFn,
        className: "shape-class",
        style: { opacity: 0.9 },
        data: { extra: 42 },
      });

      const callArgs = addSpy.mock.calls[0]?.[0] as Record<string, unknown>;

      // Top-level fields passed directly to manager
      expect(callArgs.id).toBe("shape-check");
      expect(callArgs.title).toBe("Shape test");
      expect(callArgs.type).toBe("warning");
      expect(callArgs.description).toBe("Verify shape");
      expect(callArgs.timeout).toBe(3000);
      expect(callArgs.priority).toBe("low");
      expect(callArgs.onRemove).toBe(onRemoveFn);
      // onClose is wrapped, so it won't be the exact same reference
      expect(typeof callArgs.onClose).toBe("function");
    });

    it("data bag contains icon, action, cancel, className, style AND custom data fields", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const action = { label: "Do it", onClick: vi.fn() };
      const cancel = { label: "Skip" };
      const customStyle = { border: "1px solid red" };

      toast("Data bag test", {
        icon: "data-icon",
        action,
        cancel,
        className: "data-class",
        style: customStyle,
        data: { userId: "abc-123", feature: "toasts", count: 7 },
      });

      const callArgs = addSpy.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };
      const dataBag = callArgs.data;

      // Popser-specific fields in data
      expect(dataBag.icon).toBe("data-icon");
      expect(dataBag.action).toBe(action);
      expect(dataBag.cancel).toBe(cancel);
      expect(dataBag.className).toBe("data-class");
      expect(dataBag.style).toEqual(customStyle);

      // Custom user data fields merged into data
      expect(dataBag.userId).toBe("abc-123");
      expect(dataBag.feature).toBe("toasts");
      expect(dataBag.count).toBe(7);
    });
  });

  // ---------------------------------------------------------------------------
  // 18. Content-based deduplication (Sonner PR #686)
  // Sonner users requested the ability to prevent duplicate toasts with the
  // same content (title). Popser supports `deduplicate: true` as a per-toast
  // opt-in option. When enabled, toasts with the same string title are
  // deduplicated -- subsequent calls return the existing toast ID without
  // creating a new toast.
  // ---------------------------------------------------------------------------
  describe("Content-based deduplication (Sonner PR #686)", () => {
    it("prevents duplicate toasts with the same title when deduplicate is true", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const id1 = toast("Connection lost", { deduplicate: true });
      const id2 = toast("Connection lost", { deduplicate: true });

      expect(id1).toBe(id2);
      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(getActiveToastCount()).toBe(1);
    });

    it("allows duplicate toasts by default (opt-in behavior)", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const id1 = toast("Connection lost");
      const id2 = toast("Connection lost");

      expect(id1).not.toBe(id2);
      expect(addSpy).toHaveBeenCalledTimes(2);
      expect(getActiveToastCount()).toBe(2);
    });

    it("allows re-creation of deduplicated toast after it is closed", () => {
      const id1 = toast("Session expired", { deduplicate: true });
      toast.close(id1);

      expect(getActiveToastCount()).toBe(0);
      expect(getActiveToastTitles().size).toBe(0);

      const id2 = toast("Session expired", { deduplicate: true });

      expect(id2).not.toBe(id1);
      expect(getActiveToastCount()).toBe(1);
    });

    it("deduplicates across type shortcuts (e.g., toast.error)", () => {
      const id1 = toast.error("Network error", { deduplicate: true });
      const id2 = toast.error("Network error", { deduplicate: true });

      expect(id1).toBe(id2);
      expect(getActiveToastCount()).toBe(1);
    });

    it("cleans up dedup tracking on close-all", () => {
      toast("Toast A", { deduplicate: true });
      toast("Toast B", { deduplicate: true });
      toast("Toast C", { deduplicate: true });

      expect(getActiveToastTitles().size).toBe(3);

      toast.close();

      expect(getActiveToastTitles().size).toBe(0);
      expect(getActiveToastCount()).toBe(0);

      // Can create them again
      const newId = toast("Toast A", { deduplicate: true });
      expect(typeof newId).toBe("string");
      expect(getActiveToastCount()).toBe(1);
    });

    it("cleans up dedup tracking when onClose fires (auto-dismiss)", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("Auto-dismiss toast", { deduplicate: true });
      expect(getActiveToastTitles().has("Auto-dismiss toast")).toBe(true);

      // Simulate Base UI auto-dismissing the toast
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      callArgs.onClose();

      expect(getActiveToastTitles().has("Auto-dismiss toast")).toBe(false);
      expect(getActiveToastCount()).toBe(0);

      // Can create the toast again after auto-dismiss
      const newId = toast("Auto-dismiss toast", { deduplicate: true });
      expect(typeof newId).toBe("string");
      expect(getActiveToastCount()).toBe(1);
    });

    it("does not deduplicate when titles are different", () => {
      const id1 = toast("Error: timeout", { deduplicate: true });
      const id2 = toast("Error: 404", { deduplicate: true });
      const id3 = toast("Error: 500", { deduplicate: true });

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(getActiveToastCount()).toBe(3);
    });

    it("rapid duplicate calls all return the same ID", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const ids: string[] = [];
      for (let i = 0; i < 10; i++) {
        ids.push(toast("Rapid fire", { deduplicate: true }));
      }

      // All IDs should be identical
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(1);

      // Manager should only be called once
      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(getActiveToastCount()).toBe(1);
    });
  });

  // ---------------------------------------------------------------------------
  // 19. Promise toast ReactNode support (Sonner #607)
  // Sonner's toast.promise() only accepted strings for success/error handlers.
  // JSX elements passed as success/error values were not rendered. Popser
  // accepts ReactNode in all positions (static values and function returns).
  // ---------------------------------------------------------------------------
  describe("Promise toast ReactNode support (Sonner #607)", () => {
    it("accepts ReactNode as static success value", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const jsxNode = { type: "span", props: { children: "Success!" } };
      const p = Promise.resolve("data");
      await toast.promise(p, {
        loading: "Loading...",
        success: jsxNode as unknown as React.ReactNode,
        error: "Failed",
      });
      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          success: { title: jsxNode, type: "success" },
        })
      );
    });

    it("accepts ReactNode as static error value", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const jsxNode = { type: "strong", props: { children: "Oh no!" } };
      const p = Promise.reject(new Error("fail"));
      await toast
        .promise(p, {
          loading: "Loading...",
          success: "Done",
          error: jsxNode as unknown as React.ReactNode,
        })
        .catch(() => {});
      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          error: { title: jsxNode, type: "error" },
        })
      );
    });

    it("accepts ReactNode as loading value", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const jsxNode = { type: "div", props: { children: "Please wait..." } };
      const p = Promise.resolve("ok");
      await toast.promise(p, {
        loading: jsxNode as unknown as React.ReactNode,
        success: "Done",
        error: "Failed",
      });
      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          loading: { title: jsxNode, type: "loading" },
        })
      );
    });

    it("success function can return ReactNode", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const jsxNode = { type: "em", props: { children: "Saved 42 items" } };
      const p = Promise.resolve(42);
      await toast.promise(p, {
        loading: "Saving...",
        success: () => jsxNode as unknown as React.ReactNode,
        error: "Failed",
      });
      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        success: (result: number) => { title: unknown; type: string };
      };
      expect(typeof callArgs.success).toBe("function");
      const mapped = callArgs.success(42);
      expect(mapped).toEqual({ title: jsxNode, type: "success" });
    });

    it("error function can return ReactNode", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const jsxNode = { type: "span", props: { className: "error-detail" } };
      const err = new Error("network");
      const p = Promise.reject(err);
      await toast
        .promise(p, {
          loading: "Fetching...",
          success: "Done",
          error: () => jsxNode as unknown as React.ReactNode,
        })
        .catch(() => {});
      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        error: (err: unknown) => { title: unknown; type: string };
      };
      expect(typeof callArgs.error).toBe("function");
      const mapped = callArgs.error(err);
      expect(mapped).toEqual({ title: jsxNode, type: "error" });
    });

    it("all three positions accept ReactNode simultaneously", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const loadingNode = { type: "div", props: { children: "Loading..." } };
      const successNode = { type: "div", props: { children: "Done!" } };
      const errorNode = { type: "div", props: { children: "Failed!" } };
      const p = Promise.resolve("ok");
      await toast.promise(p, {
        loading: loadingNode as unknown as React.ReactNode,
        success: successNode as unknown as React.ReactNode,
        error: errorNode as unknown as React.ReactNode,
      });
      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          loading: { title: loadingNode, type: "loading" },
          success: { title: successNode, type: "success" },
          error: { title: errorNode, type: "error" },
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 20. Promise toast skip (Sonner #669)
  // Sonner had no way to conditionally skip showing a success/error toast
  // after a promise resolved/rejected. Popser allows callback functions to
  // return `undefined` to dismiss the toast instead of showing it.
  // ---------------------------------------------------------------------------
  describe("Promise toast skip (Sonner #669)", () => {
    it("success function returning undefined triggers auto-dismiss", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.resolve("silent-success");
      await toast.promise(p, {
        loading: "Working...",
        success: () => undefined,
        error: "Failed",
      });
      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        success: (result: string) => {
          title: string;
          type: string;
          timeout?: number;
        };
      };
      expect(typeof callArgs.success).toBe("function");
      const mapped = callArgs.success("silent-success");
      expect(mapped.title).toBe("");
      expect(mapped.type).toBe("default");
      expect(mapped.timeout).toBe(1);
    });

    it("error function returning undefined triggers auto-dismiss", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const err = new Error("handled");
      const p = Promise.reject(err);
      await toast
        .promise(p, {
          loading: "Working...",
          success: "Done",
          error: () => undefined,
        })
        .catch(() => {});
      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        error: (err: unknown) => {
          title: string;
          type: string;
          timeout?: number;
        };
      };
      expect(typeof callArgs.error).toBe("function");
      const mapped = callArgs.error(err);
      expect(mapped.title).toBe("");
      expect(mapped.type).toBe("default");
      expect(mapped.timeout).toBe(1);
    });

    it("success function can conditionally skip based on result", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.resolve({ skipped: true, count: 0 });
      await toast.promise(p, {
        loading: "Processing...",
        success: (result: { skipped: boolean; count: number }) =>
          result.skipped ? undefined : `Processed ${result.count} items`,
        error: "Failed",
      });
      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        success: (result: { skipped: boolean; count: number }) => {
          title: string;
          type: string;
          timeout?: number;
        };
      };
      // Skipped case
      const skipped = callArgs.success({ skipped: true, count: 0 });
      expect(skipped).toEqual({ title: "", type: "default", timeout: 1 });

      // Non-skipped case
      const shown = callArgs.success({ skipped: false, count: 5 });
      expect(shown).toEqual({ title: "Processed 5 items", type: "success" });
    });

    it("error function can conditionally skip based on error type", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const err = new Error("AbortError");
      const p = Promise.reject(err);
      await toast
        .promise(p, {
          loading: "Fetching...",
          success: "Done",
          error: (e: unknown) =>
            e instanceof Error && e.message === "AbortError"
              ? undefined
              : "Something went wrong",
        })
        .catch(() => {});
      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        error: (err: unknown) => {
          title: string;
          type: string;
          timeout?: number;
        };
      };
      // AbortError should be skipped
      const abortResult = callArgs.error(new Error("AbortError"));
      expect(abortResult).toEqual({ title: "", type: "default", timeout: 1 });

      // Other errors should show
      const otherResult = callArgs.error(new Error("NetworkError"));
      expect(otherResult).toEqual({
        title: "Something went wrong",
        type: "error",
      });
    });

    it("non-undefined return from success function shows toast normally", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.resolve("ok");
      await toast.promise(p, {
        loading: "Loading...",
        success: (result: string) => `Result: ${result}`,
        error: "Failed",
      });
      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        success: (result: string) => { title: string; type: string };
      };
      const mapped = callArgs.success("ok");
      expect(mapped).toEqual({ title: "Result: ok", type: "success" });
    });

    it("static string success still works (no regression)", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.resolve("ok");
      await toast.promise(p, {
        loading: "Loading...",
        success: "All done!",
        error: "Failed",
      });
      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          success: { title: "All done!", type: "success" },
        })
      );
    });

    it("static string error still works (no regression)", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.reject(new Error("fail"));
      await toast
        .promise(p, {
          loading: "Loading...",
          success: "Done",
          error: "Something broke",
        })
        .catch(() => {});
      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          error: { title: "Something broke", type: "error" },
        })
      );
    });
  });
});
