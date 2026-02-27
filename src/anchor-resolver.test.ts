import { resolveAnchor } from "./anchor-resolver.js";

describe("resolveAnchor", () => {
  it("returns null for null input", () => {
    expect(resolveAnchor(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(resolveAnchor(undefined as any)).toBeNull();
  });

  it("passes through a real DOM Element without cleanup", () => {
    const el = document.createElement("button");
    const result = resolveAnchor(el);

    expect(result).not.toBeNull();
    expect(result!.element).toBe(el);
    expect(result!.cleanup).toBeUndefined();
  });

  it("creates a synthetic anchor from a MouseEvent", () => {
    const event = new MouseEvent("click", { clientX: 100, clientY: 200 });
    const result = resolveAnchor(event);

    expect(result).not.toBeNull();
    expect(result!.element).toBeInstanceOf(Element);
    expect(result!.element.getAttribute("data-popser-synthetic-anchor")).toBe(
      ""
    );
    expect(result!.element.parentNode).toBe(document.body);
    expect((result!.element as HTMLElement).style.transform).toBe(
      "translate(100px, 200px)"
    );
    expect((result!.element as HTMLElement).style.position).toBe("fixed");
    expect((result!.element as HTMLElement).style.width).toBe("0px");
    expect((result!.element as HTMLElement).style.height).toBe("0px");
    expect((result!.element as HTMLElement).style.pointerEvents).toBe("none");
    expect(result!.cleanup).toBeDefined();

    // Cleanup removes element from DOM
    result!.cleanup!();
    expect(result!.element.parentNode).toBeNull();
  });

  it("creates a synthetic anchor from MouseEvent-like object (duck-typing)", () => {
    const eventLike = { clientX: 50, clientY: 75, type: "click", target: null };
    const result = resolveAnchor(eventLike as any);

    expect(result).not.toBeNull();
    expect(result!.element).toBeInstanceOf(Element);
    expect((result!.element as HTMLElement).style.transform).toBe(
      "translate(50px, 75px)"
    );
    expect(result!.cleanup).toBeDefined();

    result!.cleanup!();
  });

  it("creates a synthetic anchor from {x, y} coordinates", () => {
    const result = resolveAnchor({ x: 300, y: 150 });

    expect(result).not.toBeNull();
    expect(result!.element).toBeInstanceOf(Element);
    expect(result!.element.getAttribute("data-popser-synthetic-anchor")).toBe(
      ""
    );
    expect(result!.element.parentNode).toBe(document.body);
    expect((result!.element as HTMLElement).style.transform).toBe(
      "translate(300px, 150px)"
    );
    expect(result!.cleanup).toBeDefined();

    // Cleanup removes element from DOM
    result!.cleanup!();
    expect(result!.element.parentNode).toBeNull();
  });

  it("creates a synthetic anchor at {x: 0, y: 0}", () => {
    const result = resolveAnchor({ x: 0, y: 0 });

    expect(result).not.toBeNull();
    expect((result!.element as HTMLElement).style.transform).toBe(
      "translate(0px, 0px)"
    );
    expect(result!.cleanup).toBeDefined();

    result!.cleanup!();
  });

  it("returns null for unknown shapes (graceful degradation)", () => {
    expect(resolveAnchor({ foo: "bar" } as any)).toBeNull();
    expect(resolveAnchor("not-an-anchor" as any)).toBeNull();
    expect(resolveAnchor(42 as any)).toBeNull();
  });

  it("cleanup is idempotent (calling twice does not throw)", () => {
    const result = resolveAnchor({ x: 10, y: 20 });
    expect(result).not.toBeNull();

    result!.cleanup!();
    // Second call should not throw
    expect(() => result!.cleanup!()).not.toThrow();
  });

  it("distinguishes MouseEvent from {x, y} coordinates", () => {
    // An object with both clientX/clientY and x/y should be treated as MouseEvent
    const event = new MouseEvent("click", { clientX: 100, clientY: 200 });
    const result = resolveAnchor(event);

    expect(result).not.toBeNull();
    expect((result!.element as HTMLElement).style.transform).toBe(
      "translate(100px, 200px)"
    );

    result!.cleanup!();
  });
});
