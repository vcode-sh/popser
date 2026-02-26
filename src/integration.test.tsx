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

describe("Integration tests", () => {
  describe("basic toast rendering", () => {
    it("renders a toast title in the DOM after calling toast()", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("Hello");
      });

      const title = document.querySelector("[data-popser-title]");
      expect(title).toBeTruthy();
      expect(title?.textContent).toBe("Hello");
    });

    it("renders toast with data-type attribute for typed toasts", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.success("Done");
      });

      const toastRoot = document.querySelector("[data-popser-root]");
      expect(toastRoot).toBeTruthy();
      expect(toastRoot?.getAttribute("data-type")).toBe("success");
    });

    it("renders the correct icon for a success toast", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.success("Done");
      });

      const icon = document.querySelector("[data-popser-icon]");
      expect(icon).toBeTruthy();
      const svg = icon?.querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("aria-label")).toBe("Success");
    });

    it("renders the correct icon for an error toast", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.error("Failed");
      });

      const icon = document.querySelector("[data-popser-icon]");
      expect(icon).toBeTruthy();
      const svg = icon?.querySelector("svg");
      expect(svg?.getAttribute("aria-label")).toBe("Error");
    });

    it("renders the correct icon for an info toast", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.info("Note");
      });

      const icon = document.querySelector("[data-popser-icon]");
      expect(icon).toBeTruthy();
      const svg = icon?.querySelector("svg");
      expect(svg?.getAttribute("aria-label")).toBe("Info");
    });

    it("renders the correct icon for a warning toast", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.warning("Watch out");
      });

      const icon = document.querySelector("[data-popser-icon]");
      expect(icon).toBeTruthy();
      const svg = icon?.querySelector("svg");
      expect(svg?.getAttribute("aria-label")).toBe("Warning");
    });

    it("renders a spinner for a loading toast", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.loading("Loading...");
      });

      const spinner = document.querySelector("[data-popser-spinner]");
      expect(spinner).toBeTruthy();
      const bars = spinner?.querySelectorAll("[data-popser-spinner-bar]");
      expect(bars?.length).toBe(12);
    });
  });

  describe("toast with description", () => {
    it("renders description when provided", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("With desc", { description: "Details" });
      });

      const title = document.querySelector("[data-popser-title]");
      expect(title?.textContent).toBe("With desc");

      const desc = document.querySelector("[data-popser-description]");
      expect(desc).toBeTruthy();
      expect(desc?.textContent).toBe("Details");
    });

    it("does not render description when not provided", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("No desc");
      });

      const desc = document.querySelector("[data-popser-description]");
      expect(desc).toBeNull();
    });
  });

  describe("toast.close()", () => {
    it("removes a specific toast from the DOM", () => {
      act(() => {
        root.render(<Toaster />);
      });
      let id: string;
      act(() => {
        id = toast("Dismissable");
      });

      expect(document.querySelector("[data-popser-root]")).toBeTruthy();

      act(() => {
        toast.close(id!);
      });

      // After closing, the toast should be removed from the DOM
      const remaining = document.querySelectorAll("[data-popser-root]");
      expect(remaining.length).toBe(0);
    });

    it("removes all toasts when close is called without args", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("First");
        toast("Second");
        toast("Third");
      });

      const before = document.querySelectorAll("[data-popser-root]");
      expect(before.length).toBe(3);

      act(() => {
        toast.close();
      });

      // All toasts should be removed from the DOM
      const after = document.querySelectorAll("[data-popser-root]");
      expect(after.length).toBe(0);
    });
  });

  describe("toast.promise()", () => {
    it("shows loading state then transitions to success", async () => {
      act(() => {
        root.render(<Toaster />);
      });

      let resolve: (value: string) => void;
      const p = new Promise<string>((r) => {
        resolve = r;
      });

      act(() => {
        toast.promise(p, {
          loading: "Loading...",
          success: "Done!",
          error: "Failed",
        });
      });

      // Loading state should be rendered
      const loadingTitle = document.querySelector("[data-popser-title]");
      expect(loadingTitle?.textContent).toBe("Loading...");

      // Check loading type is set
      const loadingRoot = document.querySelector("[data-popser-root]");
      expect(loadingRoot?.getAttribute("data-type")).toBe("loading");

      // Resolve the promise
      await act(async () => {
        resolve!("ok");
        await p;
      });

      // After resolution, the toast should show success
      const successTitle = document.querySelector("[data-popser-title]");
      expect(successTitle?.textContent).toBe("Done!");

      const successRoot = document.querySelector("[data-popser-root]");
      expect(successRoot?.getAttribute("data-type")).toBe("success");
    });

    it("shows loading state then transitions to error on rejection", async () => {
      act(() => {
        root.render(<Toaster />);
      });

      let reject: (err: Error) => void;
      const p = new Promise<string>((_r, rej) => {
        reject = rej;
      });

      act(() => {
        toast
          .promise(p, {
            loading: "Loading...",
            success: "Done!",
            error: "Something broke",
          })
          .catch(() => {});
      });

      // Loading state should be rendered
      const loadingTitle = document.querySelector("[data-popser-title]");
      expect(loadingTitle?.textContent).toBe("Loading...");

      // Reject the promise
      await act(async () => {
        reject!(new Error("boom"));
        try {
          await p;
        } catch {
          // expected
        }
      });

      // After rejection, the toast should show error
      const errorTitle = document.querySelector("[data-popser-title]");
      expect(errorTitle?.textContent).toBe("Something broke");

      const errorRoot = document.querySelector("[data-popser-root]");
      expect(errorRoot?.getAttribute("data-type")).toBe("error");
    });
  });

  describe("action button", () => {
    it("renders action button and fires onClick", () => {
      const onClick = vi.fn();
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("Action toast", {
          action: { label: "Undo", onClick },
        });
      });

      const actionBtn = document.querySelector(
        "[data-popser-action]"
      ) as HTMLElement;
      expect(actionBtn).toBeTruthy();
      expect(actionBtn.textContent).toBe("Undo");

      // Click the action button
      act(() => {
        actionBtn.click();
      });

      expect(onClick).toHaveBeenCalledOnce();
    });

    it("renders cancel button", () => {
      const onCancel = vi.fn();
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("Cancel toast", {
          cancel: { label: "Dismiss", onClick: onCancel },
        });
      });

      const cancelBtn = document.querySelector(
        "[data-popser-cancel]"
      ) as HTMLElement;
      expect(cancelBtn).toBeTruthy();
      expect(cancelBtn.textContent).toBe("Dismiss");
    });

    it("renders both action and cancel buttons together", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("Both buttons", {
          action: { label: "Retry", onClick: vi.fn() },
          cancel: { label: "Cancel", onClick: vi.fn() },
        });
      });

      const actionBtn = document.querySelector("[data-popser-action]");
      const cancelBtn = document.querySelector("[data-popser-cancel]");
      expect(actionBtn).toBeTruthy();
      expect(cancelBtn).toBeTruthy();
      expect(actionBtn?.textContent).toBe("Retry");
      expect(cancelBtn?.textContent).toBe("Cancel");
    });
  });

  describe("toast structure and classNames", () => {
    it("renders the full toast structure (root > content > header)", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.success("Structured");
      });

      expect(document.querySelector("[data-popser-root]")).toBeTruthy();
      expect(document.querySelector("[data-popser-content]")).toBeTruthy();
      expect(document.querySelector("[data-popser-header]")).toBeTruthy();
      expect(document.querySelector("[data-popser-title]")).toBeTruthy();
      expect(document.querySelector("[data-popser-icon]")).toBeTruthy();
      expect(document.querySelector("[data-popser-close]")).toBeTruthy();
    });

    it("applies custom classNames to toast elements", () => {
      act(() => {
        root.render(
          <Toaster
            classNames={{
              root: "custom-root",
              content: "custom-content",
              title: "custom-title",
              description: "custom-desc",
              closeButton: "custom-close",
            }}
          />
        );
      });
      act(() => {
        toast("Styled", { description: "With classes" });
      });

      const rootEl = document.querySelector("[data-popser-root]");
      expect(rootEl?.classList.contains("custom-root")).toBe(true);

      const content = document.querySelector("[data-popser-content]");
      expect(content?.classList.contains("custom-content")).toBe(true);

      const title = document.querySelector("[data-popser-title]");
      expect(title?.classList.contains("custom-title")).toBe(true);

      const desc = document.querySelector("[data-popser-description]");
      expect(desc?.classList.contains("custom-desc")).toBe(true);

      const close = document.querySelector("[data-popser-close]");
      expect(close?.classList.contains("custom-close")).toBe(true);
    });

    it("applies per-toast className from options", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("Custom class", { className: "my-toast" });
      });

      const rootEl = document.querySelector("[data-popser-root]");
      expect(rootEl?.classList.contains("my-toast")).toBe(true);
    });
  });

  describe("toast.update()", () => {
    it("updates a toast title in the DOM", () => {
      act(() => {
        root.render(<Toaster />);
      });
      let id: string;
      act(() => {
        id = toast("Original");
      });

      expect(document.querySelector("[data-popser-title]")?.textContent).toBe(
        "Original"
      );

      act(() => {
        toast.update(id!, { title: "Updated" });
      });

      expect(document.querySelector("[data-popser-title]")?.textContent).toBe(
        "Updated"
      );
    });

    it("updates a toast type from loading to success", () => {
      act(() => {
        root.render(<Toaster />);
      });
      let id: string;
      act(() => {
        id = toast.loading("Processing...");
      });

      expect(
        document.querySelector("[data-popser-root]")?.getAttribute("data-type")
      ).toBe("loading");

      act(() => {
        toast.update(id!, { type: "success", title: "Done!" });
      });

      expect(
        document.querySelector("[data-popser-root]")?.getAttribute("data-type")
      ).toBe("success");
      expect(document.querySelector("[data-popser-title]")?.textContent).toBe(
        "Done!"
      );
    });
  });

  describe("custom icons", () => {
    it("uses global icon override from icons prop", () => {
      act(() => {
        root.render(
          <Toaster
            icons={{
              success: <span data-test-icon>check</span>,
            }}
          />
        );
      });
      act(() => {
        toast.success("Custom icon");
      });

      const icon = document.querySelector("[data-test-icon]");
      expect(icon).toBeTruthy();
      expect(icon?.textContent).toBe("check");
    });

    it("per-toast icon overrides global icon", () => {
      act(() => {
        root.render(
          <Toaster
            icons={{
              success: <span data-global-icon>global</span>,
            }}
          />
        );
      });
      act(() => {
        toast.success("Per-toast icon", {
          icon: <span data-per-toast-icon>local</span>,
        });
      });

      const perToast = document.querySelector("[data-per-toast-icon]");
      expect(perToast).toBeTruthy();
      expect(perToast?.textContent).toBe("local");

      const global = document.querySelector("[data-global-icon]");
      expect(global).toBeNull();
    });

    it("icon: false suppresses the icon entirely", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.success("No icon", { icon: false });
      });

      const icon = document.querySelector("[data-popser-icon]");
      expect(icon).toBeNull();
    });
  });

  describe("v0.2.0 features", () => {
    it("renders custom toast via toast.custom()", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.custom((id) => (
          <div data-custom-id={id} data-custom-toast>
            Custom content
          </div>
        ));
      });

      const customEl = document.querySelector("[data-custom-toast]");
      expect(customEl).toBeTruthy();
      expect(customEl?.textContent).toBe("Custom content");
      expect(customEl?.getAttribute("data-custom-id")).toBeTruthy();

      const toastRoot = document.querySelector("[data-popser-root]");
      expect(toastRoot?.getAttribute("data-type")).toBe("custom");
    });

    it("merges per-toast classNames with Toaster classNames", () => {
      act(() => {
        root.render(
          <Toaster
            classNames={{
              root: "toaster-root",
              title: "toaster-title",
            }}
          />
        );
      });
      act(() => {
        toast("Merged", {
          classNames: {
            root: "toast-root",
            title: "toast-title",
          },
        });
      });

      const rootEl = document.querySelector("[data-popser-root]");
      expect(rootEl?.className).toContain("toaster-root");
      expect(rootEl?.className).toContain("toast-root");

      const titleEl = document.querySelector("[data-popser-title]");
      expect(titleEl?.className).toContain("toaster-title");
      expect(titleEl?.className).toContain("toast-title");
    });

    it("renders per-toast unstyled with data-unstyled", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("Unstyled", { unstyled: true });
      });

      const toastRoot = document.querySelector("[data-popser-root]");
      expect(toastRoot?.getAttribute("data-unstyled")).toBe("true");
    });

    it("renders per-toast richColors with data-rich-colors", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.success("Rich", { richColors: true });
      });

      const toastRoot = document.querySelector("[data-popser-root]");
      expect(toastRoot?.getAttribute("data-rich-colors")).toBe("true");
    });

    it("renders ReactNode action buttons", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("ReactNode actions", {
          action: <span data-custom-action>Custom Action</span>,
          cancel: <span data-custom-cancel>Custom Cancel</span>,
        });
      });

      const actionEl = document.querySelector("[data-custom-action]");
      expect(actionEl).toBeTruthy();
      expect(actionEl?.textContent).toBe("Custom Action");

      const cancelEl = document.querySelector("[data-custom-cancel]");
      expect(cancelEl).toBeTruthy();
      expect(cancelEl?.textContent).toBe("Custom Cancel");
    });

    it("applies toastOptions defaults to all toasts", () => {
      act(() => {
        root.render(
          <Toaster
            toastOptions={{
              className: "global-class",
            }}
          />
        );
      });
      act(() => {
        toast("With global options");
      });

      const rootEl = document.querySelector("[data-popser-root]");
      expect(rootEl?.className).toContain("global-class");
    });

    it("applies toastOptions classNames merged with per-toast classNames", () => {
      act(() => {
        root.render(
          <Toaster
            toastOptions={{
              classNames: { root: "opts-root", title: "opts-title" },
            }}
          />
        );
      });
      act(() => {
        toast("With merged classNames", {
          classNames: { root: "per-toast-root" },
        });
      });

      const rootEl = document.querySelector("[data-popser-root]");
      expect(rootEl?.className).toContain("opts-root");
      expect(rootEl?.className).toContain("per-toast-root");

      const titleEl = document.querySelector("[data-popser-title]");
      expect(titleEl?.className).toContain("opts-title");
    });

    it("renders toast.message() with type default", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast.message("Simple message");
      });

      const toastRoot = document.querySelector("[data-popser-root]");
      expect(toastRoot?.getAttribute("data-type")).toBe("default");
      expect(document.querySelector("[data-popser-title]")?.textContent).toBe(
        "Simple message"
      );
    });

    it("per-toast classNames only (no Toaster classNames)", () => {
      act(() => {
        root.render(<Toaster />);
      });
      act(() => {
        toast("Only per-toast", {
          classNames: { title: "solo-title" },
        });
      });

      const titleEl = document.querySelector("[data-popser-title]");
      expect(titleEl?.className).toContain("solo-title");
    });

    it("sets mobileOffset CSS variable when provided", () => {
      act(() => {
        root.render(<Toaster mobileOffset={8} />);
      });

      const viewport = document.querySelector("[data-popser-viewport]");
      const style = viewport?.getAttribute("style") ?? "";
      expect(style).toContain("--popser-mobile-offset: 8px");
    });
  });

  describe("error boundary", () => {
    it("logs to console.error when toast rendering throws", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      act(() => {
        root.render(<Toaster />);
      });

      // Create a toast that will crash the renderer by providing
      // a jsx function that throws
      act(() => {
        toast.custom(() => {
          throw new Error("Render crash");
        });
      });

      expect(errorSpy).toHaveBeenCalled();
      const call = errorSpy.mock.calls.find(
        (args) =>
          typeof args[0] === "string" &&
          args[0].includes("[popser] Toast rendering failed:")
      );
      expect(call).toBeTruthy();

      errorSpy.mockRestore();
    });
  });

  describe("multiple toasts lifecycle", () => {
    it("renders and closes multiple toasts independently", () => {
      act(() => {
        root.render(<Toaster limit={5} />);
      });

      let id1: string;
      let id2: string;
      let id3: string;
      act(() => {
        id1 = toast("First");
        id2 = toast.success("Second");
        id3 = toast.error("Third");
      });

      expect(document.querySelectorAll("[data-popser-root]").length).toBe(3);

      // Close the middle one
      act(() => {
        toast.close(id2!);
      });

      // Remaining toasts should still be present
      const titles = document.querySelectorAll("[data-popser-title]");
      const titleTexts = Array.from(titles).map((t) => t.textContent);
      expect(titleTexts).toContain("First");
      expect(titleTexts).toContain("Third");
    });
  });
});
