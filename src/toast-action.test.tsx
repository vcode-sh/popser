import { ToastActions } from "./toast-action.js";

describe("ToastActions", () => {
  it("returns null when no action and no cancel", () => {
    const result = ToastActions({
      action: undefined,
      cancel: undefined,
      classNames: undefined,
    });
    expect(result).toBeNull();
  });

  it("returns non-null when action is provided", () => {
    const result = ToastActions({
      action: { label: "Undo" },
      cancel: undefined,
      classNames: undefined,
    });
    expect(result).not.toBeNull();
    expect(result?.props["data-popser-actions"]).toBe(true);
  });

  it("returns non-null when cancel is provided", () => {
    const result = ToastActions({
      action: undefined,
      cancel: { label: "Dismiss" },
      classNames: undefined,
    });
    expect(result).not.toBeNull();
    expect(result?.props["data-popser-actions"]).toBe(true);
  });

  it("returns non-null when both action and cancel are provided", () => {
    const result = ToastActions({
      action: { label: "Undo" },
      cancel: { label: "Dismiss" },
      classNames: undefined,
    });
    expect(result).not.toBeNull();
    expect(result?.props["data-popser-actions"]).toBe(true);
  });

  it("applies classNames.actions to the wrapper div", () => {
    const result = ToastActions({
      action: { label: "Undo" },
      cancel: undefined,
      classNames: { actions: "custom-actions" },
    });
    expect(result?.props.className).toBe("custom-actions");
  });

  it("renders action child with correct label", () => {
    const result = ToastActions({
      action: { label: "Retry" },
      cancel: undefined,
      classNames: undefined,
    });
    // The children contain the Toast.Action element
    const children = result?.props.children;
    // children is an array: [cancel (falsy), action]
    const actionElement = Array.isArray(children)
      ? children.find(
          (child: any) => child && child.props?.["data-popser-action"] === true
        )
      : null;
    expect(actionElement).toBeTruthy();
    expect(actionElement?.props.children).toBe("Retry");
  });

  it("renders cancel child with correct label", () => {
    const result = ToastActions({
      action: undefined,
      cancel: { label: "Cancel" },
      classNames: undefined,
    });
    const children = result?.props.children;
    const cancelElement = Array.isArray(children)
      ? children.find(
          (child: any) => child && child.props?.["data-popser-cancel"] === true
        )
      : null;
    expect(cancelElement).toBeTruthy();
    expect(cancelElement?.props.children).toBe("Cancel");
  });

  it("applies classNames.actionButton to action element", () => {
    const result = ToastActions({
      action: { label: "Undo" },
      cancel: undefined,
      classNames: { actionButton: "my-action-btn" },
    });
    const children = result?.props.children;
    const actionElement = Array.isArray(children)
      ? children.find(
          (child: any) => child && child.props?.["data-popser-action"] === true
        )
      : null;
    expect(actionElement?.props.className).toBe("my-action-btn");
  });

  it("applies classNames.cancelButton to cancel element", () => {
    const result = ToastActions({
      action: undefined,
      cancel: { label: "Cancel" },
      classNames: { cancelButton: "my-cancel-btn" },
    });
    const children = result?.props.children;
    const cancelElement = Array.isArray(children)
      ? children.find(
          (child: any) => child && child.props?.["data-popser-cancel"] === true
        )
      : null;
    expect(cancelElement?.props.className).toBe("my-cancel-btn");
  });

  it("passes onClick handler to action element", () => {
    const onClick = vi.fn();
    const result = ToastActions({
      action: { label: "Undo", onClick },
      cancel: undefined,
      classNames: undefined,
    });
    const children = result?.props.children;
    const actionElement = Array.isArray(children)
      ? children.find(
          (child: any) => child && child.props?.["data-popser-action"] === true
        )
      : null;
    expect(actionElement?.props.onClick).toBe(onClick);
  });

  it("passes onClick handler to cancel element", () => {
    const onClick = vi.fn();
    const result = ToastActions({
      action: undefined,
      cancel: { label: "Cancel", onClick },
      classNames: undefined,
    });
    const children = result?.props.children;
    const cancelElement = Array.isArray(children)
      ? children.find(
          (child: any) => child && child.props?.["data-popser-cancel"] === true
        )
      : null;
    expect(cancelElement?.props.onClick).toBe(onClick);
  });

  // ---------------------------------------------------------------------------
  // v0.2.0: ReactNode action/cancel (Phase 2.6)
  // ---------------------------------------------------------------------------

  describe("ReactNode action/cancel (Phase 2.6)", () => {
    it("renders ReactNode action as Toast.Action children", () => {
      const actionNode = <button type="button">Custom Undo</button>;
      const result = ToastActions({
        action: actionNode,
        cancel: undefined,
        classNames: undefined,
      });
      expect(result).not.toBeNull();
      const children = result?.props.children;
      const actionElement = Array.isArray(children)
        ? children.find(
            (child: any) =>
              child && child.props?.["data-popser-action"] === true
          )
        : null;
      expect(actionElement).toBeTruthy();
      // ReactNode should be rendered as children of Toast.Action
      expect(actionElement?.props.children).toBe(actionNode);
    });

    it("renders ReactNode cancel as Toast.Close children", () => {
      const cancelNode = <button type="button">Custom Cancel</button>;
      const result = ToastActions({
        action: undefined,
        cancel: cancelNode,
        classNames: undefined,
      });
      expect(result).not.toBeNull();
      const children = result?.props.children;
      const cancelElement = Array.isArray(children)
        ? children.find(
            (child: any) =>
              child && child.props?.["data-popser-cancel"] === true
          )
        : null;
      expect(cancelElement).toBeTruthy();
      expect(cancelElement?.props.children).toBe(cancelNode);
    });

    it("object format still works with ReactNode alongside (backward compat)", () => {
      const onClick = vi.fn();
      const result = ToastActions({
        action: { label: "Object Action", onClick },
        cancel: { label: "Object Cancel", onClick },
        classNames: undefined,
      });
      const children = result?.props.children;
      const actionElement = Array.isArray(children)
        ? children.find(
            (child: any) =>
              child && child.props?.["data-popser-action"] === true
          )
        : null;
      const cancelElement = Array.isArray(children)
        ? children.find(
            (child: any) =>
              child && child.props?.["data-popser-cancel"] === true
          )
        : null;
      expect(actionElement?.props.children).toBe("Object Action");
      expect(actionElement?.props.onClick).toBe(onClick);
      expect(cancelElement?.props.children).toBe("Object Cancel");
      expect(cancelElement?.props.onClick).toBe(onClick);
    });

    it("ReactNode action does not receive onClick (no label property)", () => {
      const actionNode = <span>Custom</span>;
      const result = ToastActions({
        action: actionNode,
        cancel: undefined,
        classNames: undefined,
      });
      const children = result?.props.children;
      const actionElement = Array.isArray(children)
        ? children.find(
            (child: any) =>
              child && child.props?.["data-popser-action"] === true
          )
        : null;
      // ReactNode branch should not have an onClick prop set
      expect(actionElement?.props.onClick).toBeUndefined();
    });

    it("ReactNode cancel does not receive onClick (no label property)", () => {
      const cancelNode = <span>Custom Cancel</span>;
      const result = ToastActions({
        action: undefined,
        cancel: cancelNode,
        classNames: undefined,
      });
      const children = result?.props.children;
      const cancelElement = Array.isArray(children)
        ? children.find(
            (child: any) =>
              child && child.props?.["data-popser-cancel"] === true
          )
        : null;
      expect(cancelElement?.props.onClick).toBeUndefined();
    });

    it("applies classNames to ReactNode action", () => {
      const actionNode = <span>Custom</span>;
      const result = ToastActions({
        action: actionNode,
        cancel: undefined,
        classNames: { actionButton: "custom-btn" },
      });
      const children = result?.props.children;
      const actionElement = Array.isArray(children)
        ? children.find(
            (child: any) =>
              child && child.props?.["data-popser-action"] === true
          )
        : null;
      expect(actionElement?.props.className).toBe("custom-btn");
    });
  });
});
