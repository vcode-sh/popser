import { createElement } from "react";
import { getManager, resetManager } from "./manager.js";
import {
  clearActiveToasts,
  clearManualCloseFlags,
  getActiveToastCount,
  getActiveToastTitles,
  isActiveToast,
  toast,
} from "./toast.js";

describe("toast", () => {
  beforeEach(() => {
    resetManager();
    clearActiveToasts();
    clearManualCloseFlags();
  });

  describe("basic toast creation", () => {
    it("returns a string ID", () => {
      const id = toast("Hello");
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("returns custom ID when provided", () => {
      const id = toast("Hello", { id: "custom" });
      expect(id).toBe("custom");
    });

    it("returns unique IDs for each call", () => {
      const id1 = toast("First");
      const id2 = toast("Second");
      const id3 = toast("Third");
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });
  });

  describe("type shortcuts", () => {
    it("toast.success sets type to success", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.success("Done");
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success", title: "Done" })
      );
    });

    it("toast.error sets type to error", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.error("Failed");
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error", title: "Failed" })
      );
    });

    it("toast.info sets type to info", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.info("Note");
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "info", title: "Note" })
      );
    });

    it("toast.warning sets type to warning", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.warning("Careful");
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "warning", title: "Careful" })
      );
    });

    it("toast.loading sets type to loading", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.loading("Please wait");
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "loading", title: "Please wait" })
      );
    });

    it("type shortcuts return a string ID", () => {
      expect(typeof toast.success("s")).toBe("string");
      expect(typeof toast.error("e")).toBe("string");
      expect(typeof toast.info("i")).toBe("string");
      expect(typeof toast.warning("w")).toBe("string");
      expect(typeof toast.loading("l")).toBe("string");
    });
  });

  describe("options mapping", () => {
    it("passes description through to manager", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { description: "Details here" });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ description: "Details here" })
      );
    });

    it("passes timeout through to manager", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { timeout: 5000 });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ timeout: 5000 })
      );
    });

    it("passes priority through to manager", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { priority: "high" });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ priority: "high" })
      );
    });

    it("stores icon in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { icon: "star-icon" });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ icon: "star-icon" }),
          }),
        })
      );
    });

    it("stores action in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const action = { label: "Undo", onClick: vi.fn() };
      toast("Title", { action });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ action }),
          }),
        })
      );
    });

    it("stores cancel in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const cancel = { label: "Cancel", onClick: vi.fn() };
      toast("Title", { cancel });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ cancel }),
          }),
        })
      );
    });

    it("stores className in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { className: "my-toast" });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ className: "my-toast" }),
          }),
        })
      );
    });

    it("stores style in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const style = { backgroundColor: "red" };
      toast("Title", { style });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ style }),
          }),
        })
      );
    });

    it("stores dismissible in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { dismissible: false });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ dismissible: false }),
          }),
        })
      );
    });

    it("stores dismissible: true in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { dismissible: true });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ dismissible: true }),
          }),
        })
      );
    });

    it("wraps onClose to remove from activeToasts and call original", () => {
      const onClose = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const id = toast("Title", { onClose });

      // Extract the wrapped onClose from the call
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      expect(callArgs.onClose).toBeDefined();

      // Verify the ID is tracked
      expect(isActiveToast(id)).toBe(true);

      // Trigger the wrapped onClose
      callArgs.onClose?.();

      // Original should be called
      expect(onClose).toHaveBeenCalledOnce();

      // ID should be removed from activeToasts
      expect(isActiveToast(id)).toBe(false);
    });

    it("onClose wrapper works even without original onClose", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const id = toast("Title");

      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      expect(isActiveToast(id)).toBe(true);

      // Should not throw when no original onClose
      expect(() => callArgs.onClose?.()).not.toThrow();
      expect(isActiveToast(id)).toBe(false);
    });

    it("merges custom data with popser-specific data fields", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", {
        data: { custom: "value" },
        icon: "my-icon",
        className: "my-class",
      });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            custom: "value",
            __popser: expect.objectContaining({
              icon: "my-icon",
              className: "my-class",
            }),
          }),
        })
      );
    });
  });

  describe("active toast tracking", () => {
    it("adds ID to activeToasts after toast()", () => {
      const id = toast("Hello");
      expect(isActiveToast(id)).toBe(true);
    });

    it("tracks multiple toast IDs", () => {
      const id1 = toast("First");
      const id2 = toast("Second");
      expect(isActiveToast(id1)).toBe(true);
      expect(isActiveToast(id2)).toBe(true);
      expect(getActiveToastCount()).toBe(2);
    });

    it("tracks toasts from type shortcuts", () => {
      const id = toast.success("Done");
      expect(isActiveToast(id)).toBe(true);
    });

    it("removes ID from activeToasts after toast.close(id)", () => {
      const id = toast("Hello");
      expect(isActiveToast(id)).toBe(true);
      toast.close(id);
      expect(isActiveToast(id)).toBe(false);
    });

    it("clears all active toasts after toast.close()", () => {
      toast("First");
      toast("Second");
      toast("Third");
      expect(getActiveToastCount()).toBe(3);
      toast.close();
      expect(getActiveToastCount()).toBe(0);
    });
  });

  describe("close behavior", () => {
    it("calls manager.close with the ID", () => {
      const manager = getManager();
      const closeSpy = vi.spyOn(manager, "close");
      const id = toast("Hello");
      toast.close(id);
      expect(closeSpy).toHaveBeenCalledWith(id);
    });

    it("calls manager.close for every active toast when no ID given", () => {
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

    it("activeToasts is empty after toast.close()", () => {
      toast("First");
      toast("Second");
      toast.close();
      expect(getActiveToastCount()).toBe(0);
    });

    it("only removes the specified ID when closing one toast", () => {
      const id1 = toast("First");
      const id2 = toast("Second");
      toast.close(id1);
      expect(isActiveToast(id1)).toBe(false);
      expect(isActiveToast(id2)).toBe(true);
    });
  });

  describe("update behavior", () => {
    it("calls manager.update with title", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Original");
      toast.update(id, { title: "Updated" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ title: "Updated" })
      );
    });

    it("calls manager.update with description", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, { description: "New description" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ description: "New description" })
      );
    });

    it("calls manager.update with type", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, { type: "success" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ type: "success" })
      );
    });

    it("calls manager.update with timeout", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, { timeout: 3000 });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ timeout: 3000 })
      );
    });

    it("calls manager.update with priority", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, { priority: "high" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ priority: "high" })
      );
    });

    it("puts icon in data on update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, { icon: "new-icon" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ icon: "new-icon" }),
          }),
        })
      );
    });

    it("puts action in data on update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      const action = { label: "Retry", onClick: vi.fn() };
      toast.update(id, { action });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ action }),
          }),
        })
      );
    });

    it("puts cancel in data on update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      const cancel = { label: "Dismiss", onClick: vi.fn() };
      toast.update(id, { cancel });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ cancel }),
          }),
        })
      );
    });

    it("puts className in data on update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, { className: "updated-class" });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ className: "updated-class" }),
          }),
        })
      );
    });

    it("puts style in data on update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      const style = { color: "blue" };
      toast.update(id, { style });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ style }),
          }),
        })
      );
    });

    it("puts dismissible in data on update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, { dismissible: false });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ dismissible: false }),
          }),
        })
      );
    });

    it("does not include undefined fields in manager.update call", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, { title: "New" });
      const updateArgs = updateSpy.mock.calls[0]?.[1] as Record<
        string,
        unknown
      >;
      expect(updateArgs).not.toHaveProperty("description");
      expect(updateArgs).not.toHaveProperty("timeout");
      expect(updateArgs).not.toHaveProperty("priority");
      expect(updateArgs).toHaveProperty("title", "New");
    });
  });

  describe("promise toast", () => {
    it("calls manager.promise with correct loading mapping", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.resolve("result");
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

    it("maps success string to title and type success", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.resolve("ok");
      await toast.promise(p, {
        loading: "Loading...",
        success: "It worked!",
        error: "Nope",
      });
      expect(promiseSpy).toHaveBeenCalledWith(
        p,
        expect.objectContaining({
          success: { title: "It worked!", type: "success" },
        })
      );
    });

    it("maps error string to title and type error", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.reject(new Error("boom"));
      // Catch the rejection to avoid unhandled rejection
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

    it("wraps success function to return title and type success", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.resolve(42);
      await toast.promise(p, {
        loading: "Loading...",
        success: (result: number) => `Got ${result}`,
        error: "Failed",
      });
      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        success: (result: number) => { title: string; type: string };
      };
      // When success is a function, it should be wrapped
      expect(typeof callArgs.success).toBe("function");
      const mapped = callArgs.success(42);
      expect(mapped).toEqual({ title: "Got 42", type: "success" });
    });

    it("wraps error function to return title and type error", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const err = new Error("test error");
      const p = Promise.reject(err);
      await toast
        .promise(p, {
          loading: "Loading...",
          success: "Done",
          error: (e: unknown) =>
            `Error: ${e instanceof Error ? e.message : "unknown"}`,
        })
        .catch(() => {});
      const callArgs = promiseSpy.mock.calls[0]?.[1] as {
        error: (err: unknown) => { title: string; type: string };
      };
      expect(typeof callArgs.error).toBe("function");
      const mapped = callArgs.error(err);
      expect(mapped).toEqual({ title: "Error: test error", type: "error" });
    });

    it("returns the original promise value on success", async () => {
      const result = await toast.promise(Promise.resolve("hello"), {
        loading: "Loading...",
        success: "Done",
        error: "Failed",
      });
      expect(result).toBe("hello");
    });

    it("rejects with the original error on failure", async () => {
      const err = new Error("boom");
      await expect(
        toast.promise(Promise.reject(err), {
          loading: "Loading...",
          success: "Done",
          error: "Failed",
        })
      ).rejects.toThrow("boom");
    });

    it("accepts ReactNode as static success value", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const jsxNode = { type: "span", props: { children: "Done!" } };
      const p = Promise.resolve("ok");
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
      const jsxNode = { type: "span", props: { children: "Error!" } };
      const p = Promise.reject(new Error("boom"));
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

    it("wraps success function returning ReactNode", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const jsxNode = { type: "strong", props: { children: "42" } };
      const p = Promise.resolve(42);
      await toast.promise(p, {
        loading: "Loading...",
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

    it("dismisses toast when success function returns undefined", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const p = Promise.resolve("skip-me");
      await toast.promise(p, {
        loading: "Loading...",
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
      const mapped = callArgs.success("skip-me");
      expect(mapped).toEqual({ title: "", type: "success", timeout: 1 });
    });

    it("dismisses toast when error function returns undefined", async () => {
      const manager = getManager();
      const promiseSpy = vi.spyOn(manager, "promise");
      const err = new Error("ignored");
      const p = Promise.reject(err);
      await toast
        .promise(p, {
          loading: "Loading...",
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
      expect(mapped).toEqual({ title: "", type: "error", timeout: 1 });
    });
  });

  describe("deduplication", () => {
    it("toast with deduplicate: true and same title returns same ID", () => {
      const id1 = toast("Duplicate me", { deduplicate: true });
      const id2 = toast("Duplicate me", { deduplicate: true });

      expect(id1).toBe(id2);
      expect(getActiveToastCount()).toBe(1);
    });

    it("toast with deduplicate: true but different title creates new toast", () => {
      const id1 = toast("First title", { deduplicate: true });
      const id2 = toast("Second title", { deduplicate: true });

      expect(id1).not.toBe(id2);
      expect(getActiveToastCount()).toBe(2);
    });

    it("toast without deduplicate option allows duplicates (default behavior)", () => {
      const id1 = toast("Same title");
      const id2 = toast("Same title");

      expect(id1).not.toBe(id2);
      expect(getActiveToastCount()).toBe(2);
    });

    it("after closing deduplicated toast, same title creates new toast", () => {
      const id1 = toast("Reusable", { deduplicate: true });
      toast.close(id1);

      expect(getActiveToastCount()).toBe(0);
      expect(getActiveToastTitles().size).toBe(0);

      const id2 = toast("Reusable", { deduplicate: true });

      expect(id2).not.toBe(id1);
      expect(getActiveToastCount()).toBe(1);
    });

    it("deduplication only works for string titles (ReactNode titles are not deduped)", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      const node = createElement("span", null, "Hello");
      toast(node, { deduplicate: true });
      toast(node, { deduplicate: true });

      // Both calls should go through to manager.add since title is not a string
      expect(addSpy).toHaveBeenCalledTimes(2);
      expect(getActiveToastCount()).toBe(2);
    });

    it("toast.close() properly cleans up dedup tracking", () => {
      toast("Tracked A", { deduplicate: true });
      toast("Tracked B", { deduplicate: true });

      expect(getActiveToastTitles().size).toBe(2);

      toast.close();

      expect(getActiveToastTitles().size).toBe(0);
      expect(getActiveToastCount()).toBe(0);
    });

    it("toast.close(id) cleans up dedup tracking for that specific toast", () => {
      const id1 = toast("Alpha", { deduplicate: true });
      toast("Beta", { deduplicate: true });

      expect(getActiveToastTitles().size).toBe(2);

      toast.close(id1);

      expect(getActiveToastTitles().size).toBe(1);
      expect(getActiveToastTitles().has("Alpha")).toBe(false);
      expect(getActiveToastTitles().has("Beta")).toBe(true);
    });

    it("onClose callback cleans up dedup tracking", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("Auto dismiss dedup", { deduplicate: true });

      expect(getActiveToastTitles().size).toBe(1);

      // Simulate Base UI firing onClose (e.g., auto-dismiss or swipe)
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose: () => void };
      callArgs.onClose();

      expect(getActiveToastTitles().size).toBe(0);
      expect(getActiveToastCount()).toBe(0);
    });

    it("deduplicate works with type shortcuts", () => {
      const id1 = toast.success("Done", { deduplicate: true });
      const id2 = toast.success("Done", { deduplicate: true });

      expect(id1).toBe(id2);
      expect(getActiveToastCount()).toBe(1);
    });

    it("does not deduplicate across different types with same title", () => {
      const id1 = toast.success("Notification", { deduplicate: true });
      const id2 = toast.error("Notification", { deduplicate: true });

      // Same title but dedup map stores title -> ID; the first one wins
      // since the title key is the same. This is the intended behavior:
      // content-based dedup uses title as the key regardless of type.
      expect(id1).toBe(id2);
      expect(getActiveToastCount()).toBe(1);
    });

    it("manager.add is not called for deduplicated toasts", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("Only once", { deduplicate: true });
      toast("Only once", { deduplicate: true });
      toast("Only once", { deduplicate: true });

      expect(addSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("toast.dismiss alias", () => {
    it("is the same function reference as toast.close", () => {
      expect(toast.dismiss).toBe(toast.close);
    });
  });

  describe("duration option", () => {
    it("sets the timeout when timeout is not provided", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { duration: 3000 });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ timeout: 3000 })
      );
    });

    it("timeout takes precedence over duration when both are set", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { timeout: 5000, duration: 3000 });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ timeout: 5000 })
      );
    });
  });

  describe("onAutoClose and onDismiss callbacks", () => {
    it("onAutoClose fires when toast is auto-dismissed (not manually closed)", () => {
      const onAutoClose = vi.fn();
      const onClose = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { onAutoClose, onClose });

      // Extract the wrapped onClose from the call
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      expect(callArgs.onClose).toBeDefined();

      // Simulate Base UI firing onClose (auto-dismiss, no manual close flag)
      callArgs.onClose?.();

      expect(onAutoClose).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("onDismiss fires when toast.close(id) is called", () => {
      const onDismiss = vi.fn();
      const onClose = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const closeSpy = vi.spyOn(manager, "close");
      const id = toast("Title", { onDismiss, onClose });

      // Extract the wrapped onClose from the call
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };

      // Close manually — this sets the manual close flag
      toast.close(id);

      // Simulate Base UI firing onClose after toast.close()
      callArgs.onClose?.();

      expect(onDismiss).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("onClose fires in both auto-close and manual-close cases", () => {
      const onClose1 = vi.fn();
      const onClose2 = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      // Toast 1: will be auto-closed
      toast("Auto", { onClose: onClose1 });
      const callArgs1 = addSpy.mock.calls[0]?.[0] as {
        onClose?: () => void;
      };

      // Toast 2: will be manually closed
      const id2 = toast("Manual", { onClose: onClose2 });
      const callArgs2 = addSpy.mock.calls[1]?.[0] as {
        onClose?: () => void;
      };

      // Auto-close Toast 1
      callArgs1.onClose?.();
      expect(onClose1).toHaveBeenCalledOnce();

      // Manually close Toast 2
      toast.close(id2);
      callArgs2.onClose?.();
      expect(onClose2).toHaveBeenCalledOnce();
    });

    it("onAutoClose does not fire when toast is manually closed", () => {
      const onAutoClose = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const id = toast("Title", { onAutoClose });

      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };

      toast.close(id);
      callArgs.onClose?.();

      expect(onAutoClose).not.toHaveBeenCalled();
    });

    it("onDismiss does not fire when toast is auto-closed", () => {
      const onDismiss = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { onDismiss });

      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };

      // Simulate auto-close (no manual close flag set)
      callArgs.onClose?.();

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe("toast.update callback handling", () => {
    it("toast.update with onClose preserves internal tracking cleanup", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const updateSpy = vi.spyOn(manager, "update");

      const id = toast("Title");
      expect(isActiveToast(id)).toBe(true);

      // Update with a new onClose
      const newOnClose = vi.fn();
      toast.update(id, { onClose: newOnClose });

      // Get the update call's onClose
      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        onClose?: () => void;
      };

      // Simulate Base UI firing the updated onClose (e.g., auto-dismiss)
      // If toast.update passes raw onClose, the internal untrackToast cleanup is lost
      if (updateArgs.onClose) {
        updateArgs.onClose();
      }

      // The original wrapped onClose (from add()) should have been the one
      // to clean up activeToasts. Since update replaced it with raw onClose,
      // the toast is still tracked — this is a bug.
      // The toast SHOULD be untracked after its onClose fires.
      expect(isActiveToast(id)).toBe(false);
    });

    it("toast.update with onAutoClose retroactively fires on auto-dismiss", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const onAutoClose = vi.fn();
      const id = toast("Title");

      // Update with onAutoClose added retroactively
      toast.update(id, { onAutoClose });

      // After update, the manager's onClose for this toast should be the
      // new wrapped onClose from toManagerUpdateOptions. Simulate Base UI
      // firing the updated onClose (auto-dismiss — no manual close flag).
      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        onClose?: () => void;
      };
      expect(typeof updateArgs.onClose).toBe("function");
      updateArgs.onClose?.();

      expect(onAutoClose).toHaveBeenCalledOnce();
    });

    it("toast.close(all) fires onDismiss for each toast", () => {
      const onDismiss1 = vi.fn();
      const onDismiss2 = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");

      toast("First", { onDismiss: onDismiss1 });
      toast("Second", { onDismiss: onDismiss2 });

      // Close all
      toast.close();

      // Simulate Base UI firing onClose for both toasts
      const callArgs1 = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      const callArgs2 = addSpy.mock.calls[1]?.[0] as { onClose?: () => void };
      callArgs1.onClose?.();
      callArgs2.onClose?.();

      // Both should fire onDismiss since toast.close() is a manual action
      expect(onDismiss1).toHaveBeenCalledOnce();
      expect(onDismiss2).toHaveBeenCalledOnce();
    });

    it("toast.update with onDismiss fires on manual close", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");

      const onDismiss = vi.fn();
      const id = toast("Title");

      // Add onDismiss retroactively
      toast.update(id, { onDismiss });

      // Manually close the toast
      toast.close(id);

      // Simulate Base UI firing the updated onClose
      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        onClose?: () => void;
      };
      updateArgs.onClose?.();

      expect(onDismiss).toHaveBeenCalledOnce();
    });

    it("duration alias works in toast.update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, { duration: 8000 });
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ timeout: 8000 })
      );
    });
  });

  describe("toast.getToasts", () => {
    it("returns empty array when no toasts are active", () => {
      expect(toast.getToasts()).toEqual([]);
    });

    it("returns correct IDs after creating toasts", () => {
      const id1 = toast("First");
      const id2 = toast("Second");
      const id3 = toast("Third");

      const ids = toast.getToasts();
      expect(ids).toContain(id1);
      expect(ids).toContain(id2);
      expect(ids).toContain(id3);
      expect(ids).toHaveLength(3);
    });

    it("IDs are removed after closing", () => {
      const id1 = toast("First");
      const id2 = toast("Second");

      toast.close(id1);

      const ids = toast.getToasts();
      expect(ids).not.toContain(id1);
      expect(ids).toContain(id2);
      expect(ids).toHaveLength(1);
    });

    it("returns empty array after closing all toasts", () => {
      toast("First");
      toast("Second");

      toast.close();

      expect(toast.getToasts()).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // v0.2.0 Features
  // ---------------------------------------------------------------------------

  describe("toast.message() (Phase 3.1)", () => {
    it("creates a toast with type default", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.message("Hello");
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "default", title: "Hello" })
      );
    });

    it("returns a string ID", () => {
      const id = toast.message("Hello");
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("accepts options (description, timeout, etc.) but not type", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.message("Hello", { description: "Details", timeout: 3000 });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "default",
          title: "Hello",
          description: "Details",
          timeout: 3000,
        })
      );
    });

    it("tracks the toast in activeToasts", () => {
      const id = toast.message("Tracked message");
      expect(isActiveToast(id)).toBe(true);
    });
  });

  describe("toast.custom() (Phase 2.1)", () => {
    it("returns a string ID", () => {
      const id = toast.custom((id) => createElement("div", null, "Custom"));
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("calls manager with type __custom", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.custom((id) => createElement("div", null, "Custom"));
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "__custom" })
      );
    });

    it("stores jsx function in data.__popser.jsx", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const jsxFn = (id: string) => createElement("div", null, `Toast ${id}`);
      toast.custom(jsxFn);
      const callArgs = addSpy.mock.calls[0]?.[0] as {
        data: { __popser: { jsx: (id: string) => unknown } };
      };
      expect(typeof callArgs.data.__popser.jsx).toBe("function");
    });

    it("accepts options but not type/icon/action/cancel", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.custom((id) => createElement("div", null, "Custom"), {
        className: "custom-class",
        timeout: 5000,
      });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "__custom",
          timeout: 5000,
          data: expect.objectContaining({
            __popser: expect.objectContaining({ className: "custom-class" }),
          }),
        })
      );
    });

    it("can be closed via toast.close(id)", () => {
      const id = toast.custom((id) => createElement("div", null, "Closeable"));
      expect(isActiveToast(id)).toBe(true);
      toast.close(id);
      expect(isActiveToast(id)).toBe(false);
    });

    it("title is undefined for custom toasts", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.custom(() => createElement("div", null, "No title"));
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: undefined })
      );
    });
  });

  describe("enhanced toast.promise() (Phase 2.2)", () => {
    describe("lazy promise", () => {
      it("accepts a function that returns a promise", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const factory = vi.fn(() => Promise.resolve(42));
        await toast.promise(factory, {
          loading: "Loading...",
          success: "Done!",
          error: "Failed",
        });
        // The factory function should be called immediately
        expect(factory).toHaveBeenCalledOnce();
        // The manager.promise should receive the resolved promise, not the function
        expect(promiseSpy).toHaveBeenCalledWith(
          expect.any(Promise),
          expect.any(Object)
        );
      });

      it("lazy promise works the same as direct promise", async () => {
        const result = await toast.promise(() => Promise.resolve(42), {
          loading: "Loading...",
          success: "Done!",
          error: "Failed",
        });
        expect(result).toBe(42);
      });

      it("lazy promise rejects correctly", async () => {
        await expect(
          toast.promise(() => Promise.reject(new Error("lazy fail")), {
            loading: "Loading...",
            success: "Done",
            error: "Failed",
          })
        ).rejects.toThrow("lazy fail");
      });
    });

    describe("extended result", () => {
      it("success callback with extended result passes title, type, timeout, icon", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const iconElement = createElement("span", null, "icon");
        const p = Promise.resolve(42);
        await toast.promise(p, {
          loading: "Loading...",
          success: (result: number) => ({
            title: `Done: ${result}`,
            timeout: 3000,
            icon: iconElement,
          }),
          error: "Failed",
        });
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          success: (result: number) => Record<string, unknown>;
        };
        expect(typeof callArgs.success).toBe("function");
        const mapped = callArgs.success(42);
        expect(mapped.title).toBe("Done: 42");
        expect(mapped.type).toBe("success");
        expect(mapped.timeout).toBe(3000);
        expect(mapped.data).toEqual(
          expect.objectContaining({
            __popser: expect.objectContaining({ icon: iconElement }),
          })
        );
      });

      it("error callback with extended result passes title, type, timeout", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const err = new Error("boom");
        const p = Promise.reject(err);
        await toast
          .promise(p, {
            loading: "Loading...",
            success: "Done",
            error: () => ({
              title: "Failed",
              timeout: 10000,
            }),
          })
          .catch(() => {});
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          error: (err: unknown) => Record<string, unknown>;
        };
        expect(typeof callArgs.error).toBe("function");
        const mapped = callArgs.error(err);
        expect(mapped.title).toBe("Failed");
        expect(mapped.type).toBe("error");
        expect(mapped.timeout).toBe(10000);
      });

      it("extended result with action and cancel passes through in data.__popser", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const action = { label: "Retry", onClick: vi.fn() };
        const cancel = { label: "Cancel", onClick: vi.fn() };
        const p = Promise.resolve("ok");
        await toast.promise(p, {
          loading: "Loading...",
          success: () => ({
            title: "Done",
            action,
            cancel,
          }),
          error: "Failed",
        });
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          success: (result: string) => Record<string, unknown>;
        };
        const mapped = callArgs.success("ok") as {
          data: { __popser: Record<string, unknown> };
        };
        expect(mapped.data.__popser.action).toBe(action);
        expect(mapped.data.__popser.cancel).toBe(cancel);
      });

      it("extended result with description passes through", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const p = Promise.resolve("ok");
        await toast.promise(p, {
          loading: "Loading...",
          success: () => ({
            title: "Saved",
            description: "Your changes have been saved.",
          }),
          error: "Failed",
        });
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          success: (result: string) => Record<string, unknown>;
        };
        const mapped = callArgs.success("ok");
        expect(mapped.description).toBe("Your changes have been saved.");
      });
    });

    describe("finally clause", () => {
      it("finally is called after success", async () => {
        const cleanup = vi.fn();
        await toast.promise(Promise.resolve("ok"), {
          loading: "Loading...",
          success: "Done",
          error: "Failed",
          finally: cleanup,
        });
        expect(cleanup).toHaveBeenCalledOnce();
      });

      it("finally is called after error", async () => {
        const cleanup = vi.fn();
        await toast
          .promise(Promise.reject(new Error("fail")), {
            loading: "Loading...",
            success: "Done",
            error: "Failed",
            finally: cleanup,
          })
          .catch(() => {});
        expect(cleanup).toHaveBeenCalledOnce();
      });

      it("finally is called regardless of outcome", async () => {
        const cleanup1 = vi.fn();
        const cleanup2 = vi.fn();

        // Success path
        await toast.promise(Promise.resolve(1), {
          loading: "Loading...",
          success: "Done",
          error: "Failed",
          finally: cleanup1,
        });

        // Error path
        await toast
          .promise(Promise.reject(new Error("fail")), {
            loading: "Loading...",
            success: "Done",
            error: "Failed",
            finally: cleanup2,
          })
          .catch(() => {});

        expect(cleanup1).toHaveBeenCalledOnce();
        expect(cleanup2).toHaveBeenCalledOnce();
      });
    });

    describe("per-state description", () => {
      it("description function is called with the result on success", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const p = Promise.resolve(42);
        await toast.promise(p, {
          loading: "Loading...",
          success: (result: number) => `Got ${result}`,
          error: "Failed",
          description: (data: number) => `Result was ${data}`,
        });
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          success: (result: number) => { description?: string };
        };
        const mapped = callArgs.success(42);
        expect(mapped.description).toBe("Result was 42");
      });

      it("description function is called with the error on failure", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const err = new Error("test error");
        const p = Promise.reject(err);
        await toast
          .promise(p, {
            loading: "Loading...",
            success: "Done",
            error: (e: unknown) =>
              `Error: ${e instanceof Error ? e.message : "unknown"}`,
            description: (e: unknown) =>
              `Details: ${e instanceof Error ? e.message : "unknown"}`,
          })
          .catch(() => {});
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          error: (err: unknown) => { description?: string };
        };
        const mapped = callArgs.error(err);
        expect(mapped.description).toBe("Details: test error");
      });

      it("static description is passed through for static success", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const p = Promise.resolve("ok");
        await toast.promise(p, {
          loading: "Loading...",
          success: "Done",
          error: "Failed",
          description: "Static description",
        });
        expect(promiseSpy).toHaveBeenCalledWith(
          p,
          expect.objectContaining({
            success: expect.objectContaining({
              description: "Static description",
            }),
          })
        );
      });

      it("function description is not included in static success mapping", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const p = Promise.resolve("ok");
        await toast.promise(p, {
          loading: "Loading...",
          success: "Done",
          error: "Failed",
          description: () => "Dynamic",
        });
        // When success is static and description is a function, description
        // should not be included in the static mapping
        expect(promiseSpy).toHaveBeenCalledWith(
          p,
          expect.objectContaining({
            success: { title: "Done", type: "success" },
          })
        );
      });
    });

    describe("return type has non-enumerable id", () => {
      it("return value has a non-enumerable id property", async () => {
        const result = toast.promise(Promise.resolve("ok"), {
          loading: "Loading...",
          success: "Done",
          error: "Failed",
        });

        // id should be accessible
        expect(result).toHaveProperty("id");

        // id should be non-enumerable
        const descriptor = Object.getOwnPropertyDescriptor(result, "id");
        expect(descriptor?.enumerable).toBe(false);

        await result;
      });

      it("id is a string", async () => {
        const result = toast.promise(Promise.resolve("ok"), {
          loading: "Loading...",
          success: "Done",
          error: "Failed",
        });

        // The id should be a string (may be empty initially)
        expect(typeof result.id).toBe("string");

        await result;
      });
    });

    describe("B1 fix verification", () => {
      it("success returning undefined sets type to success (not default)", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const p = Promise.resolve("ok");
        await toast.promise(p, {
          loading: "Loading...",
          success: () => undefined,
          error: "Failed",
        });
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          success: (result: string) => { type: string; timeout: number };
        };
        const mapped = callArgs.success("ok");
        expect(mapped.type).toBe("success");
        expect(mapped.timeout).toBe(1);
      });

      it("error returning undefined sets type to error (not default)", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const err = new Error("boom");
        const p = Promise.reject(err);
        await toast
          .promise(p, {
            loading: "Loading...",
            success: "Done",
            error: () => undefined,
          })
          .catch(() => {});
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          error: (err: unknown) => { type: string; timeout: number };
        };
        const mapped = callArgs.error(err);
        expect(mapped.type).toBe("error");
        expect(mapped.timeout).toBe(1);
      });

      it("success returning undefined calls queueMicrotask to close toast", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const closeSpy = vi.spyOn(manager, "close");
        const queueMicrotaskSpy = vi.spyOn(globalThis, "queueMicrotask");
        const p = Promise.resolve("ok");
        await toast.promise(p, {
          loading: "Loading...",
          success: () => undefined,
          error: "Failed",
        });
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          success: (result: string) => unknown;
        };
        callArgs.success("ok");
        expect(queueMicrotaskSpy).toHaveBeenCalled();
        // Flush the microtask
        await new Promise((resolve) => queueMicrotask(resolve));
        expect(closeSpy).toHaveBeenCalled();
        queueMicrotaskSpy.mockRestore();
      });

      it("error returning undefined calls queueMicrotask to close toast", async () => {
        const manager = getManager();
        const promiseSpy = vi.spyOn(manager, "promise");
        const closeSpy = vi.spyOn(manager, "close");
        const queueMicrotaskSpy = vi.spyOn(globalThis, "queueMicrotask");
        const err = new Error("fail");
        const p = Promise.reject(err);
        await toast
          .promise(p, {
            loading: "Loading...",
            success: "Done",
            error: () => undefined,
          })
          .catch(() => {});
        const callArgs = promiseSpy.mock.calls[0]?.[1] as {
          error: (err: unknown) => unknown;
        };
        callArgs.error(err);
        expect(queueMicrotaskSpy).toHaveBeenCalled();
        await new Promise((resolve) => queueMicrotask(resolve));
        expect(closeSpy).toHaveBeenCalled();
        queueMicrotaskSpy.mockRestore();
      });
    });
  });

  describe("per-toast classNames (Phase 2.3)", () => {
    it("stores classNames in data.__popser.classNames", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Hello", { classNames: { root: "custom-root" } });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({
              classNames: { root: "custom-root" },
            }),
          }),
        })
      );
    });

    it("stores classNames with multiple slots", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const classNames = {
        root: "cr",
        content: "cc",
        title: "ct",
        description: "cd",
      };
      toast("Hello", { classNames });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ classNames }),
          }),
        })
      );
    });

    it("stores classNames alongside className", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Hello", {
        className: "my-toast",
        classNames: { root: "custom-root" },
      });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({
              className: "my-toast",
              classNames: { root: "custom-root" },
            }),
          }),
        })
      );
    });
  });

  describe("per-toast unstyled (Phase 2.4)", () => {
    it("stores unstyled: true in data.__popser.unstyled", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Hello", { unstyled: true });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ unstyled: true }),
          }),
        })
      );
    });

    it("stores unstyled: false in data.__popser.unstyled", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Hello", { unstyled: false });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ unstyled: false }),
          }),
        })
      );
    });
  });

  describe("action/cancel as ReactNode (Phase 2.6)", () => {
    it("stores ReactNode action in data.__popser.action", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const actionNode = createElement("button", null, "Undo");
      toast("Hello", { action: actionNode });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ action: actionNode }),
          }),
        })
      );
    });

    it("stores ReactNode cancel in data.__popser.cancel", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const cancelNode = createElement("button", null, "Cancel");
      toast("Hello", { cancel: cancelNode });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ cancel: cancelNode }),
          }),
        })
      );
    });

    it("object format still works (backward compat)", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const action = { label: "Undo", onClick: vi.fn() };
      toast("Hello", { action });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ action }),
          }),
        })
      );
    });
  });

  describe("per-toast richColors (Phase 3.3)", () => {
    it("stores richColors: true in data.__popser.richColors", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.success("Saved", { richColors: true });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ richColors: true }),
          }),
        })
      );
    });

    it("stores richColors: false in data.__popser.richColors", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast.error("Error", { richColors: false });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            __popser: expect.objectContaining({ richColors: false }),
          }),
        })
      );
    });
  });

  describe("callbacks receive toast ID (Phase 3.4)", () => {
    it("onClose callback receives the toast ID as argument", () => {
      const onClose = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const id = toast("Title", { onClose });

      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      callArgs.onClose?.();

      expect(onClose).toHaveBeenCalledWith(id);
    });

    it("onAutoClose callback receives the toast ID as argument", () => {
      const onAutoClose = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const id = toast("Title", { onAutoClose });

      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      // Simulate auto-close (no manual close flag set)
      callArgs.onClose?.();

      expect(onAutoClose).toHaveBeenCalledWith(id);
    });

    it("onDismiss callback receives the toast ID as argument", () => {
      const onDismiss = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const id = toast("Title", { onDismiss });

      // Manually close to set the flag
      toast.close(id);

      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      callArgs.onClose?.();

      expect(onDismiss).toHaveBeenCalledWith(id);
    });

    it("existing () => void callbacks still work (backward compat)", () => {
      const onClose = vi.fn();
      const onAutoClose = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { onClose, onAutoClose });

      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      callArgs.onClose?.();

      // Both should be called without errors even though they are simple () => void
      expect(onClose).toHaveBeenCalledOnce();
      expect(onAutoClose).toHaveBeenCalledOnce();
    });
  });

  describe("data collision fix (B4)", () => {
    it("user data survives alongside popser icon on create", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", {
        data: { icon: "mydata" },
        icon: "popser-icon",
      });
      const callArgs = addSpy.mock.calls[0]?.[0] as {
        data: { icon: string; __popser: { icon: string } };
      };
      // User's data.icon should be preserved at the top level
      expect(callArgs.data.icon).toBe("mydata");
      // Popser's icon should be in __popser namespace
      expect(callArgs.data.__popser.icon).toBe("popser-icon");
    });

    it("user data survives alongside popser icon on update", () => {
      const manager = getManager();
      const updateSpy = vi.spyOn(manager, "update");
      const id = toast("Title");
      toast.update(id, {
        data: { icon: "user-icon-data" },
        icon: "popser-update-icon",
      });
      const updateArgs = updateSpy.mock.calls[0]?.[1] as {
        data: { icon: string; __popser: { icon: string } };
      };
      expect(updateArgs.data.icon).toBe("user-icon-data");
      expect(updateArgs.data.__popser.icon).toBe("popser-update-icon");
    });

    it("user data with other fields is preserved alongside __popser", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", {
        data: { userId: 123, action: "custom-action-data" },
        action: { label: "Undo", onClick: vi.fn() },
      });
      const callArgs = addSpy.mock.calls[0]?.[0] as {
        data: {
          userId: number;
          action: string;
          __popser: { action: { label: string } };
        };
      };
      expect(callArgs.data.userId).toBe(123);
      expect(callArgs.data.action).toBe("custom-action-data");
      expect(callArgs.data.__popser.action).toEqual(
        expect.objectContaining({ label: "Undo" })
      );
    });
  });
});
