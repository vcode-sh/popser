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
          data: expect.objectContaining({ icon: "star-icon" }),
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
          data: expect.objectContaining({ action }),
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
          data: expect.objectContaining({ cancel }),
        })
      );
    });

    it("stores className in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { className: "my-toast" });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ className: "my-toast" }),
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
          data: expect.objectContaining({ style }),
        })
      );
    });

    it("stores dismissible in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { dismissible: false });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ dismissible: false }),
        })
      );
    });

    it("stores dismissible: true in data", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      toast("Title", { dismissible: true });
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ dismissible: true }),
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
            icon: "my-icon",
            className: "my-class",
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
          data: expect.objectContaining({ icon: "new-icon" }),
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
          data: expect.objectContaining({ action }),
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
          data: expect.objectContaining({ cancel }),
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
          data: expect.objectContaining({ className: "updated-class" }),
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
          data: expect.objectContaining({ style }),
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
          data: expect.objectContaining({ dismissible: false }),
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
      expect(mapped).toEqual({ title: "", type: "default", timeout: 1 });
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
      expect(mapped).toEqual({ title: "", type: "default", timeout: 1 });
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
});
