import { act } from "react";
import { createRoot } from "react-dom/client";
import { resetManager } from "./manager.js";
import { clearActiveToasts, toast } from "./toast.js";
import { ToastCloseButton } from "./toast-close.js";
import { Toaster } from "./toaster.js";

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
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
});

describe("ToastCloseButton", () => {
  it("renders close button with default hover mode", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Hello");
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    expect(closeBtn).toBeTruthy();
    expect(closeBtn?.getAttribute("data-close-button")).toBe("hover");
  });

  it("renders close button with always mode", () => {
    act(() => {
      root.render(<Toaster closeButton="always" />);
    });
    act(() => {
      toast("Hello");
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    expect(closeBtn).toBeTruthy();
    expect(closeBtn?.getAttribute("data-close-button")).toBe("always");
  });

  it("does not render close button when mode is never", () => {
    act(() => {
      root.render(<Toaster closeButton="never" />);
    });
    act(() => {
      toast("Hello");
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    expect(closeBtn).toBeNull();
  });

  it("has correct aria-label on close button", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Hello");
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    expect(closeBtn?.getAttribute("aria-label")).toBe("Close notification");
  });

  it("renders default CloseIcon SVG when no custom icon provided", () => {
    act(() => {
      root.render(<Toaster />);
    });
    act(() => {
      toast("Hello");
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    const svg = closeBtn?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("width")).toBe("14");
    expect(svg?.getAttribute("height")).toBe("14");
    // Verify it has the two X-shape paths
    const paths = svg?.querySelectorAll("path");
    expect(paths?.length).toBe(2);
  });

  it("uses custom close icon when provided via icons prop", () => {
    act(() => {
      root.render(
        <Toaster icons={{ close: <span data-custom-close>X</span> }} />
      );
    });
    act(() => {
      toast("Hello");
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    const customIcon = closeBtn?.querySelector("[data-custom-close]");
    expect(customIcon).toBeTruthy();
    expect(customIcon?.textContent).toBe("X");
    // Default SVG should not be present
    const svg = closeBtn?.querySelector("svg");
    expect(svg).toBeNull();
  });

  it("applies closeButton className from classNames prop", () => {
    act(() => {
      root.render(<Toaster classNames={{ closeButton: "custom-close" }} />);
    });
    act(() => {
      toast("Hello");
    });
    const closeBtn = document.querySelector("[data-popser-close]");
    expect(closeBtn?.classList.contains("custom-close")).toBe(true);
  });

  it("returns null directly when called as function with mode never", () => {
    const result = ToastCloseButton({ mode: "never" });
    expect(result).toBeNull();
  });
});
