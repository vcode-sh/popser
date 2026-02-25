import { getManager, resetManager } from "./manager.js";
import { activeToasts, toast } from "./toast.js";

describe("toast", () => {
  beforeEach(() => {
    resetManager();
    activeToasts.clear();
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

    it("wraps onClose to remove from activeToasts and call original", () => {
      const onClose = vi.fn();
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const id = toast("Title", { onClose });

      // Extract the wrapped onClose from the call
      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      expect(callArgs.onClose).toBeDefined();

      // Verify the ID is tracked
      expect(activeToasts.has(id)).toBe(true);

      // Trigger the wrapped onClose
      callArgs.onClose?.();

      // Original should be called
      expect(onClose).toHaveBeenCalledOnce();

      // ID should be removed from activeToasts
      expect(activeToasts.has(id)).toBe(false);
    });

    it("onClose wrapper works even without original onClose", () => {
      const manager = getManager();
      const addSpy = vi.spyOn(manager, "add");
      const id = toast("Title");

      const callArgs = addSpy.mock.calls[0]?.[0] as { onClose?: () => void };
      expect(activeToasts.has(id)).toBe(true);

      // Should not throw when no original onClose
      expect(() => callArgs.onClose?.()).not.toThrow();
      expect(activeToasts.has(id)).toBe(false);
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
      expect(activeToasts.has(id)).toBe(true);
    });

    it("tracks multiple toast IDs", () => {
      const id1 = toast("First");
      const id2 = toast("Second");
      expect(activeToasts.has(id1)).toBe(true);
      expect(activeToasts.has(id2)).toBe(true);
      expect(activeToasts.size).toBe(2);
    });

    it("tracks toasts from type shortcuts", () => {
      const id = toast.success("Done");
      expect(activeToasts.has(id)).toBe(true);
    });

    it("removes ID from activeToasts after toast.close(id)", () => {
      const id = toast("Hello");
      expect(activeToasts.has(id)).toBe(true);
      toast.close(id);
      expect(activeToasts.has(id)).toBe(false);
    });

    it("clears all active toasts after toast.close()", () => {
      toast("First");
      toast("Second");
      toast("Third");
      expect(activeToasts.size).toBe(3);
      toast.close();
      expect(activeToasts.size).toBe(0);
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
      expect(activeToasts.size).toBe(0);
    });

    it("only removes the specified ID when closing one toast", () => {
      const id1 = toast("First");
      const id2 = toast("Second");
      toast.close(id1);
      expect(activeToasts.has(id1)).toBe(false);
      expect(activeToasts.has(id2)).toBe(true);
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
  });
});
