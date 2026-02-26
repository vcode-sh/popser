import { act } from "react";
import { createRoot } from "react-dom/client";
import { resetManager } from "./manager.js";
import { clearActiveToasts, toast } from "./toast.js";
import { Toaster } from "./toaster.js";

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
  vi.useFakeTimers();
  resetManager();
  clearActiveToasts();
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

describe("Toaster", () => {
  it("renders without errors", () => {
    expect(() => {
      act(() => {
        root.render(<Toaster />);
      });
    }).not.toThrow();
  });

  it("renders viewport with data-popser-viewport", () => {
    act(() => {
      root.render(<Toaster />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport).toBeTruthy();
  });

  it("renders viewport with default position bottom-right", () => {
    act(() => {
      root.render(<Toaster />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-position")).toBe("bottom-right");
  });

  it("renders viewport with custom position", () => {
    act(() => {
      root.render(<Toaster position="top-center" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-position")).toBe("top-center");
  });

  it("renders viewport with default theme system", () => {
    act(() => {
      root.render(<Toaster />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-theme")).toBe("system");
  });

  it("renders viewport with custom theme", () => {
    act(() => {
      root.render(<Toaster theme="dark" />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-theme")).toBe("dark");
  });

  it("does not set data-expanded by default", () => {
    act(() => {
      root.render(<Toaster />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-expanded")).toBeNull();
  });

  it("sets data-expanded when expand is true", () => {
    act(() => {
      root.render(<Toaster expand />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-expanded")).toBe("true");
  });

  it("does not set data-rich-colors by default", () => {
    act(() => {
      root.render(<Toaster />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-rich-colors")).toBeNull();
  });

  it("sets data-rich-colors when richColors is true", () => {
    act(() => {
      root.render(<Toaster richColors />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.getAttribute("data-rich-colors")).toBe("true");
  });

  it("applies CSS custom properties for offset and gap", () => {
    act(() => {
      root.render(<Toaster gap={12} offset={24} />);
    });
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    expect(viewport).toBeTruthy();
    expect(viewport.style.getPropertyValue("--popser-offset")).toBe("24px");
    expect(viewport.style.getPropertyValue("--popser-gap")).toBe("12px");
  });

  it("applies string offset value directly", () => {
    act(() => {
      root.render(<Toaster offset="2rem" />);
    });
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    expect(viewport.style.getPropertyValue("--popser-offset")).toBe("2rem");
  });

  it("applies viewport className from classNames prop", () => {
    act(() => {
      root.render(<Toaster classNames={{ viewport: "my-viewport" }} />);
    });
    const viewport = document.querySelector("[data-popser-viewport]");
    expect(viewport?.classList.contains("my-viewport")).toBe(true);
  });

  it("does not set CSS custom properties when unstyled is true", () => {
    act(() => {
      root.render(<Toaster unstyled />);
    });
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    expect(viewport.style.getPropertyValue("--popser-offset")).toBe("");
    expect(viewport.style.getPropertyValue("--popser-gap")).toBe("");
  });

  it("applies custom style to viewport", () => {
    act(() => {
      root.render(<Toaster style={{ zIndex: 9999 }} />);
    });
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    expect(viewport.style.zIndex).toBe("9999");
  });

  it("renders toast DOM elements when toasts are created via the manager", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Hello World");
    });
    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot).toBeTruthy();
    const title = document.querySelector("[data-popser-title]");
    expect(title?.textContent).toBe("Hello World");
  });

  it("renders multiple toasts", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("First");
      toast("Second");
    });
    const toastRoots = document.querySelectorAll("[data-popser-root]");
    expect(toastRoots.length).toBe(2);
  });

  it("sets data-expanded on mouseEnter over a toast root", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Hover me");
    });
    const toastRoot = document.querySelector(
      "[data-popser-root]"
    ) as HTMLElement;
    expect(toastRoot).toBeTruthy();

    // Use mouseover (bubbles) to trigger React's onMouseEnter in happy-dom
    act(() => {
      toastRoot.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });

    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    expect(viewport.getAttribute("data-expanded")).toBe("true");
  });

  it("clears data-expanded on mouseLeave after debounce", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Hover me");
    });
    const toastRoot = document.querySelector(
      "[data-popser-root]"
    ) as HTMLElement;

    // Enter via mouseover (bubbles)
    act(() => {
      toastRoot.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });

    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;
    expect(viewport.getAttribute("data-expanded")).toBe("true");

    // Leave via mouseout (bubbles) triggers onMouseLeave with 100ms debounce
    act(() => {
      viewport.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    });

    // Still expanded before debounce fires
    expect(viewport.getAttribute("data-expanded")).toBe("true");

    // Advance timers past the 100ms debounce
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(viewport.getAttribute("data-expanded")).toBeNull();
  });

  it("cancels mouseLeave debounce on mouseEnter (prevents flicker)", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Hover me");
    });
    const toastRoot = document.querySelector(
      "[data-popser-root]"
    ) as HTMLElement;
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;

    // Enter
    act(() => {
      toastRoot.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });
    expect(viewport.getAttribute("data-expanded")).toBe("true");

    // Leave (starts 100ms debounce)
    act(() => {
      viewport.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    });

    // Re-enter before debounce fires (clears timeout)
    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      toastRoot.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });

    // Advance past when the original debounce would have fired
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should still be expanded because mouseEnter cancelled the leave debounce
    expect(viewport.getAttribute("data-expanded")).toBe("true");
  });

  it("renders data-popser-id on toast root element", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Hello World");
    });
    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot).toBeTruthy();
    expect(toastRoot?.hasAttribute("data-popser-id")).toBe(true);
    expect(toastRoot?.getAttribute("data-popser-id")).toBeTruthy();
  });

  it("renders data-popser-id matching the toast ID returned by toast()", () => {
    act(() => {
      root.render(<Toaster />);
    });
    let id: string;
    act(() => {
      id = toast("Identified toast");
    });
    const toastRoot = document.querySelector("[data-popser-root]");
    expect(toastRoot?.getAttribute("data-popser-id")).toBe(id!);
  });

  it("renders data-popser-id with custom ID", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Custom ID toast", { id: "my-custom-id" });
    });
    const toastRoot = document.querySelector('[data-popser-id="my-custom-id"]');
    expect(toastRoot).toBeTruthy();
  });

  it("renders unique data-popser-id for each toast", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("First");
      toast("Second");
    });
    const toastRoots = document.querySelectorAll("[data-popser-root]");
    expect(toastRoots.length).toBe(2);
    const id1 = toastRoots[0]?.getAttribute("data-popser-id");
    const id2 = toastRoots[1]?.getAttribute("data-popser-id");
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it("allows selecting toast by data-popser-id for e2e testing", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast.success("Done", { id: "e2e-toast" });
    });
    const toastRoot = document.querySelector(
      '[data-popser-id="e2e-toast"]'
    ) as HTMLElement;
    expect(toastRoot).toBeTruthy();
    expect(toastRoot.getAttribute("data-type")).toBe("success");
    expect(toastRoot.getAttribute("data-popser-root")).not.toBeNull();
  });

  it("cleans up hover timeout on unmount", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Cleanup test");
    });
    const toastRoot = document.querySelector(
      "[data-popser-root]"
    ) as HTMLElement;
    const viewport = document.querySelector(
      "[data-popser-viewport]"
    ) as HTMLElement;

    // Enter then leave (creates a pending timeout)
    act(() => {
      toastRoot.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });
    act(() => {
      viewport.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    });

    // Unmount before timeout fires -- should not throw
    expect(() => {
      act(() => {
        root.unmount();
      });
    }).not.toThrow();
  });
});
