import { act } from "react";
import { createRoot } from "react-dom/client";
import { resetManager } from "./manager.js";
import { Toaster } from "./toaster.js";

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
  resetManager();
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
});
