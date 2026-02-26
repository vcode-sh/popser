import { getManager, resetManager } from "./manager.js";

describe("manager", () => {
  beforeEach(() => {
    resetManager();
  });

  describe("singleton behavior", () => {
    it("returns a manager object", () => {
      const manager = getManager();
      expect(manager).toBeDefined();
      expect(typeof manager).toBe("object");
    });

    it("returns the same instance on subsequent calls", () => {
      const first = getManager();
      const second = getManager();
      expect(first).toBe(second);
    });

    it("has add, close, update, and promise methods", () => {
      const manager = getManager();
      expect(typeof manager.add).toBe("function");
      expect(typeof manager.close).toBe("function");
      expect(typeof manager.update).toBe("function");
      expect(typeof manager.promise).toBe("function");
    });
  });

  describe("reset behavior", () => {
    it("returns a new manager instance", () => {
      const original = getManager();
      const reset = resetManager();
      expect(reset).not.toBe(original);
    });

    it("causes getManager() to return the new instance after reset", () => {
      const original = getManager();
      const reset = resetManager();
      const current = getManager();
      expect(current).toBe(reset);
      expect(current).not.toBe(original);
    });
  });

  describe("manager methods", () => {
    it("add() returns a string ID", () => {
      const manager = getManager();
      const id = manager.add({ title: "Test toast" });
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("add() with custom id returns that ID", () => {
      const manager = getManager();
      const id = manager.add({ title: "Custom ID toast", id: "my-toast" });
      expect(id).toBe("my-toast");
    });

    it("close() can be called without error", () => {
      const manager = getManager();
      const id = manager.add({ title: "Toast to close" });
      expect(() => manager.close(id)).not.toThrow();
    });

    it("update() can be called without error", () => {
      const manager = getManager();
      const id = manager.add({ title: "Toast to update" });
      expect(() =>
        manager.update(id, { title: "Updated toast" })
      ).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // v0.2.0: Generic manager type (T1)
  // ---------------------------------------------------------------------------

  describe("generic manager type (T1)", () => {
    it("manager accepts data with __popser typed field", () => {
      const manager = getManager();
      const id = manager.add({
        title: "Typed toast",
        data: {
          __popser: {
            icon: "test-icon",
            className: "typed-class",
            dismissible: true,
          },
          customField: "value",
        },
      });
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("manager update accepts typed data", () => {
      const manager = getManager();
      const id = manager.add({ title: "Original" });
      expect(() =>
        manager.update(id, {
          title: "Updated",
          data: {
            __popser: { icon: "updated-icon" },
          },
        })
      ).not.toThrow();
    });

    it("manager still works with plain data (no __popser)", () => {
      const manager = getManager();
      const id = manager.add({
        title: "Plain data toast",
        data: { foo: "bar" },
      });
      expect(typeof id).toBe("string");
    });
  });
});
