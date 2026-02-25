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
});
