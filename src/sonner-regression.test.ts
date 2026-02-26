import { clearManager, getManager, resetManager } from "./manager.js";
import { activeToasts, toast } from "./toast.js";

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
    activeToasts.clear();
  });

  // ---------------------------------------------------------------------------
  // 1. Memory leak fix (Sonner #729)
  // Sonner keeps dismissed toasts in a global `this.toasts` array forever.
  // Popser uses an `activeToasts` Set that is cleaned up on close.
  // ---------------------------------------------------------------------------
  describe("Memory leak fix (Sonner #729)", () => {
    it("removes toast ID from activeToasts after toast.close(id)", () => {
      const id = toast("Leaky toast");
      expect(activeToasts.has(id)).toBe(true);
      expect(activeToasts.size).toBe(1);

      toast.close(id);

      expect(activeToasts.has(id)).toBe(false);
      expect(activeToasts.size).toBe(0);
    });

    it("clears all IDs from activeToasts after toast.close() with no args", () => {
      toast("Toast 1");
      toast("Toast 2");
      toast("Toast 3");
      expect(activeToasts.size).toBe(3);

      toast.close();

      expect(activeToasts.size).toBe(0);
    });

    it("activeToasts does not grow unbounded after repeated create/close cycles", () => {
      for (let i = 0; i < 100; i++) {
        const id = toast(`Toast ${i}`);
        toast.close(id);
      }

      expect(activeToasts.size).toBe(0);
    });

    it("activeToasts size stays correct when mixing individual and bulk closes", () => {
      const id1 = toast("First");
      const id2 = toast("Second");
      toast("Third");

      // Close one individually
      toast.close(id1);
      expect(activeToasts.size).toBe(2);
      expect(activeToasts.has(id1)).toBe(false);

      // Close another individually
      toast.close(id2);
      expect(activeToasts.size).toBe(1);

      // Close remaining via close-all
      toast.close();
      expect(activeToasts.size).toBe(0);
    });

    it("closing an already-closed toast ID does not throw or corrupt state", () => {
      const id = toast("Ephemeral");
      toast.close(id);
      expect(activeToasts.size).toBe(0);

      // Closing again should be a no-op
      expect(() => toast.close(id)).not.toThrow();
      expect(activeToasts.size).toBe(0);
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
      expect(activeToasts.size).toBe(0);
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
      expect(activeToasts.size).toBe(0);
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

      expect(activeToasts.size).toBe(1);
      expect(activeToasts.has("unique-id")).toBe(true);
    });

    it("closing a deduplicated ID fully removes it from tracking", () => {
      toast("First", { id: "dedup" });
      toast("Second", { id: "dedup" });

      expect(activeToasts.size).toBe(1);

      toast.close("dedup");

      expect(activeToasts.size).toBe(0);
      expect(activeToasts.has("dedup")).toBe(false);
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
    it("passes onClose through to manager.update()", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const onCloseFn = vi.fn();

      const id = toast("Hello");

      toast.update(id, { onClose: onCloseFn });

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ onClose: onCloseFn })
      );
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

      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          onClose: onCloseFn,
          onRemove: onRemoveFn,
        })
      );
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
      expect(activeToasts.has(id)).toBe(true);

      toast.close(id);

      expect(activeToasts.has(id)).toBe(false);
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
      expect(activeToasts.has(id)).toBe(true);

      // Simulate Base UI firing the onClose callback (e.g., swipe dismiss)
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      callArgs.onClose();

      expect(activeToasts.has(id)).toBe(false);
      expect(userOnClose).toHaveBeenCalledOnce();
    });

    it("removes ID from activeToasts even without user-provided onClose", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const id = toast("No callback toast");
      expect(activeToasts.has(id)).toBe(true);

      // Simulate Base UI auto-dismissing the toast
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      callArgs.onClose();

      expect(activeToasts.has(id)).toBe(false);
    });

    it("does not throw if onClose fires after manual toast.close()", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const id = toast("Double close");

      // Manually close first
      toast.close(id);
      expect(activeToasts.has(id)).toBe(false);

      // Then Base UI's onClose fires (race condition scenario)
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      expect(() => callArgs.onClose()).not.toThrow();
      expect(activeToasts.has(id)).toBe(false);
    });

    it("onClose callback correctly resolves ID for auto-generated IDs", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      // Create toast without explicit ID (auto-generated)
      const id = toast("Auto ID");
      expect(id.length).toBeGreaterThan(0);
      expect(activeToasts.has(id)).toBe(true);

      // The wrapped onClose should have captured the resolved ID
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      callArgs.onClose();

      expect(activeToasts.has(id)).toBe(false);
    });

    it("onClose cleanup works correctly across multiple toasts", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const id1 = toast("Toast 1");
      const id2 = toast("Toast 2");
      const id3 = toast("Toast 3");

      expect(activeToasts.size).toBe(3);

      // Simulate only the middle toast being dismissed by Base UI
      const secondCallArgs = addSpy.mock.calls[1]?.[0] as {
        onClose: () => void;
      };
      secondCallArgs.onClose();

      expect(activeToasts.has(id1)).toBe(true);
      expect(activeToasts.has(id2)).toBe(false);
      expect(activeToasts.has(id3)).toBe(true);
      expect(activeToasts.size).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // 11. Pre-mount guard (Sonner #723)
  // Sonner silently drops toasts called before `<Toaster>` mounts.
  // Popser's manager is a lazy singleton created on first `toast()` call,
  // so toasts are never lost even if no Provider/Toaster is mounted yet.
  // ---------------------------------------------------------------------------
  describe("Pre-mount guard (Sonner #723)", () => {
    beforeEach(() => {
      clearManager();
      activeToasts.clear();
    });

    it("calling toast() before any Toaster mount returns a valid ID", () => {
      // Manager is null (no Toaster has mounted), simulating pre-mount state
      const id = toast("Pre-mount toast");

      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("toast() before mount adds the ID to activeToasts", () => {
      const id = toast("Queued toast");

      expect(activeToasts.has(id)).toBe(true);
      expect(activeToasts.size).toBe(1);
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
      expect(activeToasts.has(id)).toBe(true);
    });

    it("multiple toast() calls before mount all get tracked", () => {
      const id1 = toast("First pre-mount");
      const id2 = toast.success("Second pre-mount");
      const id3 = toast.error("Third pre-mount");
      const id4 = toast.warning("Fourth pre-mount");
      const id5 = toast.info("Fifth pre-mount");

      expect(activeToasts.size).toBe(5);
      expect(activeToasts.has(id1)).toBe(true);
      expect(activeToasts.has(id2)).toBe(true);
      expect(activeToasts.has(id3)).toBe(true);
      expect(activeToasts.has(id4)).toBe(true);
      expect(activeToasts.has(id5)).toBe(true);
    });

    it("toasts created before mount can be closed", () => {
      const id = toast("Closable pre-mount");
      expect(activeToasts.has(id)).toBe(true);

      toast.close(id);
      expect(activeToasts.has(id)).toBe(false);
      expect(activeToasts.size).toBe(0);
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
      expect(activeToasts.size).toBe(3);

      toast.close();
      expect(activeToasts.size).toBe(0);
    });
  });
});
