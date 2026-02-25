import { act } from "react";
import { createRoot } from "react-dom/client";
import { ToastIcon } from "./toast-icon.js";

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
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

describe("ToastIcon", () => {
  it("returns null when type is undefined and no icon", () => {
    act(() => {
      root.render(<ToastIcon />);
    });
    expect(container.innerHTML).toBe("");
  });

  it("renders custom icon when icon prop is provided", () => {
    act(() => {
      root.render(
        <ToastIcon icon={<span data-testid="custom">Custom</span>} />
      );
    });
    const wrapper = container.querySelector("[data-popser-icon]");
    expect(wrapper).toBeTruthy();
    const custom = container.querySelector("[data-testid='custom']");
    expect(custom).toBeTruthy();
    expect(custom?.textContent).toBe("Custom");
  });

  it("returns null when icon is false", () => {
    act(() => {
      root.render(<ToastIcon icon={false} type="success" />);
    });
    expect(container.innerHTML).toBe("");
  });

  it("renders built-in success SVG icon", () => {
    act(() => {
      root.render(<ToastIcon type="success" />);
    });
    const wrapper = container.querySelector("[data-popser-icon]");
    expect(wrapper).toBeTruthy();
    expect(wrapper?.getAttribute("data-type")).toBe("success");
    const svg = wrapper?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("aria-label")).toBe("Success");
  });

  it("renders built-in error SVG icon", () => {
    act(() => {
      root.render(<ToastIcon type="error" />);
    });
    const wrapper = container.querySelector("[data-popser-icon]");
    expect(wrapper).toBeTruthy();
    expect(wrapper?.getAttribute("data-type")).toBe("error");
    const svg = wrapper?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("aria-label")).toBe("Error");
  });

  it("renders built-in info SVG icon", () => {
    act(() => {
      root.render(<ToastIcon type="info" />);
    });
    const wrapper = container.querySelector("[data-popser-icon]");
    expect(wrapper).toBeTruthy();
    expect(wrapper?.getAttribute("data-type")).toBe("info");
    const svg = wrapper?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("aria-label")).toBe("Info");
  });

  it("renders built-in warning SVG icon", () => {
    act(() => {
      root.render(<ToastIcon type="warning" />);
    });
    const wrapper = container.querySelector("[data-popser-icon]");
    expect(wrapper).toBeTruthy();
    expect(wrapper?.getAttribute("data-type")).toBe("warning");
    const svg = wrapper?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("aria-label")).toBe("Warning");
  });

  it("renders spinner for loading type", () => {
    act(() => {
      root.render(<ToastIcon type="loading" />);
    });
    const wrapper = container.querySelector("[data-popser-icon]");
    expect(wrapper).toBeTruthy();
    const spinner = wrapper?.querySelector("[data-popser-spinner]");
    expect(spinner).toBeTruthy();
    const bars = spinner?.querySelectorAll("[data-popser-spinner-bar]");
    expect(bars?.length).toBe(12);
  });

  it("renders global icon override when provided", () => {
    act(() => {
      root.render(
        <ToastIcon
          globalIcons={{
            success: <span data-testid="global-success">GS</span>,
          }}
          type="success"
        />
      );
    });
    const wrapper = container.querySelector("[data-popser-icon]");
    expect(wrapper).toBeTruthy();
    const globalIcon = container.querySelector(
      "[data-testid='global-success']"
    );
    expect(globalIcon).toBeTruthy();
    expect(globalIcon?.textContent).toBe("GS");
    // Should NOT have data-type since it uses the globalIcons branch
    expect(wrapper?.getAttribute("data-type")).toBeNull();
  });

  it("per-toast icon takes priority over global icon", () => {
    act(() => {
      root.render(
        <ToastIcon
          globalIcons={{ success: <span data-testid="global">Global</span> }}
          icon={<span data-testid="per-toast">PerToast</span>}
          type="success"
        />
      );
    });
    const perToast = container.querySelector("[data-testid='per-toast']");
    expect(perToast).toBeTruthy();
    expect(perToast?.textContent).toBe("PerToast");
    const global = container.querySelector("[data-testid='global']");
    expect(global).toBeNull();
  });
});
