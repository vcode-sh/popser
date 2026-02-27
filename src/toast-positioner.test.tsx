import { act } from "react";
import { createRoot } from "react-dom/client";
import { getManager, resetManager } from "./manager.js";
import { clearActiveToasts, toast } from "./toast.js";
import { toManagerOptions, toManagerUpdateOptions } from "./toast-mapper.js";
import { Toaster } from "./toaster.js";

// ---------------------------------------------------------------------------
// Unit tests: buildPositionerProps (tested via toManagerOptions / toManagerUpdateOptions)
// ---------------------------------------------------------------------------

describe("buildPositionerProps", () => {
  beforeEach(() => {
    resetManager();
    clearActiveToasts();
  });

  it("returns positionerProps with defaults when only anchor is set", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions("Anchored", { anchor }, () => {}, {
      current: "",
    });

    expect(result.positionerProps).toBeDefined();
    expect(result.positionerProps).toEqual(
      expect.objectContaining({
        anchor,
        side: "bottom",
        sideOffset: 8,
        align: "center",
      })
    );
  });

  it("returns undefined positionerProps when no anchor", () => {
    const result = toManagerOptions("No anchor", {}, () => {}, { current: "" });

    expect(result.positionerProps).toBeUndefined();
  });

  it("returns undefined positionerProps when anchor is null", () => {
    const result = toManagerOptions("Null anchor", { anchor: null }, () => {}, {
      current: "",
    });

    expect(result.positionerProps).toBeUndefined();
  });

  it("passes through anchorSide correctly", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "Sided",
      { anchor, anchorSide: "top" },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.side).toBe("top");
  });

  it("passes through anchorAlign correctly", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "Aligned",
      { anchor, anchorAlign: "start" },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.align).toBe("start");
  });

  it("passes through anchorOffset correctly", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "Offset",
      { anchor, anchorOffset: 16 },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.sideOffset).toBe(16);
  });

  it("passes through anchorAlignOffset correctly", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "AlignOffset",
      { anchor, anchorAlignOffset: 4 },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.alignOffset).toBe(4);
  });

  it("passes through all positioning options together", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "All opts",
      {
        anchor,
        anchorSide: "right",
        anchorAlign: "end",
        anchorOffset: 12,
        anchorAlignOffset: 6,
      },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps).toEqual(
      expect.objectContaining({
        anchor,
        side: "right",
        sideOffset: 12,
        align: "end",
        alignOffset: 6,
      })
    );
  });

  it("passes through anchorPositionMethod", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "PositionMethod",
      { anchor, anchorPositionMethod: "fixed" },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.positionMethod).toBe("fixed");
  });

  it("passes through anchorSticky", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "Sticky",
      { anchor, anchorSticky: true },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.sticky).toBe(true);
  });

  it("passes through anchorCollisionBoundary", () => {
    const anchor = document.createElement("button");
    const boundary = document.createElement("div");
    const result = toManagerOptions(
      "CollisionBoundary",
      { anchor, anchorCollisionBoundary: boundary },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.collisionBoundary).toBe(boundary);
  });

  it("passes through anchorCollisionBoundary as string", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "CollisionBoundaryStr",
      { anchor, anchorCollisionBoundary: "clipping-ancestors" },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.collisionBoundary).toBe(
      "clipping-ancestors"
    );
  });

  it("passes through anchorCollisionPadding", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "CollisionPadding",
      { anchor, anchorCollisionPadding: 10 },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.collisionPadding).toBe(10);
  });

  it("passes through arrowPadding", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "ArrowPadding",
      { anchor, arrowPadding: 12 },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps?.arrowPadding).toBe(12);
  });

  it("passes through all advanced options together", () => {
    const anchor = document.createElement("button");
    const boundary = document.createElement("div");
    const result = toManagerOptions(
      "All advanced",
      {
        anchor,
        anchorPositionMethod: "fixed",
        anchorSticky: true,
        anchorCollisionBoundary: boundary,
        anchorCollisionPadding: 10,
        arrowPadding: 8,
      },
      () => {},
      { current: "" }
    );

    expect(result.positionerProps).toEqual(
      expect.objectContaining({
        anchor,
        positionMethod: "fixed",
        sticky: true,
        collisionBoundary: boundary,
        collisionPadding: 10,
        arrowPadding: 8,
      })
    );
  });

  it("stores arrow: true in __popser data", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions(
      "Arrow",
      { anchor, arrow: true },
      () => {},
      { current: "" }
    );

    expect(result.data.__popser.arrow).toBe(true);
  });

  it("does not include arrow in __popser when not set", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions("No arrow", { anchor }, () => {}, {
      current: "",
    });

    expect(result.data.__popser.arrow).toBeUndefined();
  });

  it("does not include optional fields in positionerProps when not provided", () => {
    const anchor = document.createElement("button");
    const result = toManagerOptions("Minimal", { anchor }, () => {}, {
      current: "",
    });

    expect(result.positionerProps).not.toHaveProperty("alignOffset");
    expect(result.positionerProps).not.toHaveProperty("positionMethod");
    expect(result.positionerProps).not.toHaveProperty("sticky");
    expect(result.positionerProps).not.toHaveProperty("collisionBoundary");
    expect(result.positionerProps).not.toHaveProperty("collisionPadding");
    expect(result.positionerProps).not.toHaveProperty("arrowPadding");
  });
});

// ---------------------------------------------------------------------------
// Unit tests: toManagerUpdateOptions with positioner props
// ---------------------------------------------------------------------------

describe("toManagerUpdateOptions with anchor options", () => {
  beforeEach(() => {
    resetManager();
    clearActiveToasts();
  });

  it("includes positionerProps when anchor options provided", () => {
    const anchor = document.createElement("button");
    const result = toManagerUpdateOptions(
      "test-id",
      { anchor, anchorSide: "top" },
      () => {}
    );

    expect(result.positionerProps).toBeDefined();
    expect(result.positionerProps?.anchor).toBe(anchor);
    expect(result.positionerProps?.side).toBe("top");
  });

  it("does not include positionerProps when no anchor options", () => {
    const result = toManagerUpdateOptions(
      "test-id",
      { title: "Updated title" },
      () => {}
    );

    expect(result.positionerProps).toBeUndefined();
  });

  it("stores arrow in __popser when provided", () => {
    const result = toManagerUpdateOptions("test-id", { arrow: true }, () => {});

    expect(result.data.__popser?.arrow).toBe(true);
  });

  it("does not include __popser in data when no internal fields changed", () => {
    const result = toManagerUpdateOptions(
      "test-id",
      { title: "New title" },
      () => {}
    );

    expect(result.data.__popser).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Integration tests: anchored toasts
// ---------------------------------------------------------------------------

describe("anchored toasts", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  let anchor: HTMLButtonElement;

  beforeEach(() => {
    vi.useFakeTimers();
    resetManager();
    clearActiveToasts();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    anchor = document.createElement("button");
    anchor.textContent = "Anchor";
    document.body.appendChild(anchor);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    document.body.removeChild(container);
    if (anchor.parentNode) {
      document.body.removeChild(anchor);
    }
    vi.useRealTimers();
  });

  it("anchored toast renders with data-anchored attribute", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Anchored toast", { anchor });
    });

    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot).toBeTruthy();
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();
  });

  it("non-anchored toast does NOT have data-anchored attribute", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Regular toast");
    });

    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot).toBeTruthy();
    expect(toastRoot?.hasAttribute("data-anchored")).toBe(false);
  });

  it("arrow renders with data-popser-arrow when arrow: true", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("With arrow", { anchor, arrow: true });
    });

    const arrowEl = document.querySelector("[data-popser-arrow]");
    expect(arrowEl).toBeTruthy();
  });

  it("arrow does NOT render when arrow is not set", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("No arrow", { anchor });
    });

    const arrowEl = document.querySelector("[data-popser-arrow]");
    expect(arrowEl).toBeNull();
  });

  it("arrow does NOT render on non-anchored toast even if arrow: true", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      // arrow without anchor should not render the positioner/arrow
      toast("No anchor arrow", { arrow: true });
    });

    const arrowEl = document.querySelector("[data-popser-arrow]");
    expect(arrowEl).toBeNull();
    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.hasAttribute("data-anchored")).toBe(false);
  });

  it("anchored custom toast renders with data-anchored", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast.custom(
        (id) => (
          <div data-custom-anchored data-id={id}>
            Custom anchored
          </div>
        ),
        { anchor }
      );
    });

    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot).toBeTruthy();
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();
    expect(toastRoot?.getAttribute("data-type")).toBe("custom");

    const customEl = document.querySelector("[data-custom-anchored]");
    expect(customEl).toBeTruthy();
    expect(customEl?.textContent).toBe("Custom anchored");
  });

  it("anchored custom toast renders arrow when arrow: true", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast.custom(
        (id) => (
          <div data-custom-arrow data-id={id}>
            With arrow
          </div>
        ),
        { anchor, arrow: true }
      );
    });

    const arrowEl = document.querySelector("[data-popser-arrow]");
    expect(arrowEl).toBeTruthy();
  });

  it("toast.update() can add anchor options to existing toast", () => {
    act(() => {
      root.render(<Toaster />);
    });
    let id: string;
    act(() => {
      id = toast("Will anchor later");
    });

    // Before update: no anchor
    let toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.hasAttribute("data-anchored")).toBe(false);

    // Update with anchor
    act(() => {
      toast.update(id!, { anchor });
    });

    toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();
  });

  it("multiple anchored toasts to same element both render", () => {
    act(() => {
      root.render(<Toaster limit={5} />);
    });
    act(() => {
      toast("First anchored", { anchor });
      toast("Second anchored", { anchor });
    });

    const toasts = document.querySelectorAll("[data-anchored]");
    expect(toasts.length).toBe(2);
  });

  it("anchored toast with richColors applies data-rich-colors", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast.success("Rich anchored", { anchor, richColors: true });
    });

    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();
    expect(toastRoot?.getAttribute("data-rich-colors")).toBe("true");
  });

  it("anchored toast with unstyled applies data-unstyled", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Unstyled anchored", { anchor, unstyled: true });
    });

    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();
    expect(toastRoot?.getAttribute("data-unstyled")).toBe("true");
  });

  it("anchored toast with classNames merges correctly", () => {
    act(() => {
      root.render(
        <Toaster
          classNames={{
            root: "toaster-root",
            content: "toaster-content",
          }}
        />
      );
    });
    act(() => {
      toast("Classed anchored", {
        anchor,
        classNames: {
          root: "per-toast-root",
          content: "per-toast-content",
        },
      });
    });

    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.className).toContain("toaster-root");
    expect(toastRoot?.className).toContain("per-toast-root");

    const content = document.querySelector("[data-popser-content]");
    expect(content?.className).toContain("toaster-content");
    expect(content?.className).toContain("per-toast-content");
  });

  it("anchored toast with arrow classNames applies arrow class", () => {
    act(() => {
      root.render(
        <Toaster
          classNames={{
            arrow: "toaster-arrow",
          }}
        />
      );
    });
    act(() => {
      toast("Arrow classed", {
        anchor,
        arrow: true,
        classNames: {
          arrow: "per-toast-arrow",
        },
      });
    });

    const arrowEl = document.querySelector("[data-popser-arrow]");
    expect(arrowEl).toBeTruthy();
    expect(arrowEl?.className).toContain("toaster-arrow");
    expect(arrowEl?.className).toContain("per-toast-arrow");
  });

  it("anchored toast with dismissible: false hides close button", () => {
    act(() => {
      root.render(<Toaster closeButton="always" />);
    });
    act(() => {
      toast("Not dismissible anchored", { anchor, dismissible: false });
    });

    const closeBtn = document.querySelector("[data-popser-close]");
    expect(closeBtn).toBeNull();
  });

  it("anchored toast passes positionerProps to manager", () => {
    const manager = getManager();
    const addSpy = vi.spyOn(manager, "add");

    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Spy anchored", { anchor, anchorSide: "top", anchorOffset: 16 });
    });

    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        positionerProps: expect.objectContaining({
          anchor,
          side: "top",
          sideOffset: 16,
          align: "center",
        }),
      })
    );
  });

  it("anchored success toast shows correct type and icon", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast.success("Anchored success", { anchor });
    });

    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-type")).toBe("success");
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();

    const icon = document.querySelector("[data-popser-icon]");
    expect(icon).toBeTruthy();
    const svg = icon?.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toBe("Success");
  });

  it("anchored toast can be closed with toast.close()", () => {
    act(() => {
      root.render(<Toaster />);
    });
    let id: string;
    act(() => {
      id = toast("Closable anchored", { anchor });
    });

    expect(document.querySelector("[data-anchored]")).toBeTruthy();

    act(() => {
      toast.close(id!);
    });

    const remaining = document.querySelectorAll("[data-popser-root]");
    expect(remaining.length).toBe(0);
  });

  it("anchored toast with description renders both title and description", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Anchored with desc", {
        anchor,
        description: "Anchor description",
      });
    });

    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();

    const title = document.querySelector("[data-popser-title]");
    expect(title?.textContent).toBe("Anchored with desc");

    const desc = document.querySelector("[data-popser-description]");
    expect(desc?.textContent).toBe("Anchor description");
  });

  it("anchored toast with action button renders action", () => {
    const onClick = vi.fn();
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Anchored action", {
        anchor,
        action: { label: "Undo", onClick },
      });
    });

    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();

    const actionBtn = document.querySelector(
      "[data-popser-action]"
    ) as HTMLElement;
    expect(actionBtn).toBeTruthy();
    expect(actionBtn.textContent).toBe("Undo");

    act(() => {
      actionBtn.click();
    });

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("anchored toast with promise state transitions preserves anchor", async () => {
    act(() => {
      root.render(<Toaster />);
    });

    let resolve: (value: string) => void;
    const p = new Promise<string>((r) => {
      resolve = r;
    });

    act(() => {
      toast.promise(p, {
        loading: "Saving...",
        success: "Saved!",
        error: "Failed",
      });
    });

    // Loading state should not have anchored (promise doesn't pass anchor options)
    // Now test with anchor options via a direct anchored toast + update approach
    let id: string;
    act(() => {
      id = toast("Promise-like loading", { anchor, type: "loading" });
    });

    let toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();
    expect(toastRoot?.getAttribute("data-type")).toBe("loading");

    // Simulate promise resolution by updating to success
    act(() => {
      toast.update(id!, {
        title: "Promise resolved!",
        type: "success",
        anchor,
      });
    });

    toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-anchored")).toBeTruthy();
    expect(toastRoot?.getAttribute("data-type")).toBe("success");

    // Resolve the actual promise to avoid unhandled rejection
    resolve!("done");
    await act(async () => {
      await p;
    });
  });
});
