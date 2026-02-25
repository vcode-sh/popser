import { ToastCloseButton } from "./toast-close.js";

describe("ToastCloseButton", () => {
  it("returns null when mode is never", () => {
    const result = ToastCloseButton({ mode: "never" });
    expect(result).toBeNull();
  });

  it("renders when mode is always", () => {
    const result = ToastCloseButton({ mode: "always" });
    expect(result).not.toBeNull();
    expect(result?.props["data-close-button"]).toBe("always");
    expect(result?.props["data-popser-close"]).toBe(true);
  });

  it("renders when mode is hover (default)", () => {
    const result = ToastCloseButton({});
    expect(result).not.toBeNull();
    expect(result?.props["data-close-button"]).toBe("hover");
    expect(result?.props["data-popser-close"]).toBe(true);
  });

  it("has correct aria-label", () => {
    const result = ToastCloseButton({ mode: "always" });
    expect(result?.props["aria-label"]).toBe("Close notification");
  });

  it("renders default CloseIcon when no custom icon provided", () => {
    const result = ToastCloseButton({ mode: "always" });
    // children should be the default CloseIcon (an SVG element)
    const children = result?.props.children;
    // The default icon is rendered via <CloseIcon /> which returns an svg
    expect(children).toBeTruthy();
    // CloseIcon is a React element with type being the CloseIcon function
    expect(children.type).toBeDefined();
  });

  it("uses custom icon when provided", () => {
    const customIcon = "X";
    const result = ToastCloseButton({ mode: "always", icon: customIcon });
    expect(result?.props.children).toBe("X");
  });

  it("applies className when provided", () => {
    const result = ToastCloseButton({
      mode: "always",
      className: "custom-close",
    });
    expect(result?.props.className).toBe("custom-close");
  });

  it("defaults mode to hover when not specified", () => {
    const result = ToastCloseButton({});
    expect(result?.props["data-close-button"]).toBe("hover");
  });

  it("renders custom ReactNode icon", () => {
    const result = ToastCloseButton({
      mode: "always",
      icon: "Close me",
    });
    expect(result?.props.children).toBe("Close me");
  });
});
