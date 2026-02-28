"use client";

import { Toaster, toast } from "@vcui/popser";
import "@vcui/popser/styles";
import { useRef } from "react";

const btn =
  "rounded-lg border border-fd-border bg-fd-secondary px-4 py-2 text-sm font-medium cursor-pointer transition-colors hover:bg-fd-accent";

export function ToastDemo() {
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Basic types */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          className={btn}
          onClick={() => toast("Hello world")}
          type="button"
        >
          Default
        </button>
        <button
          className={btn}
          onClick={() => toast.success("Saved")}
          type="button"
        >
          Success
        </button>
        <button
          className={btn}
          onClick={() => toast.error("Something broke")}
          type="button"
        >
          Error
        </button>
        <button
          className={btn}
          onClick={() => toast.info("Heads up")}
          type="button"
        >
          Info
        </button>
        <button
          className={btn}
          onClick={() => toast.warning("Careful now")}
          type="button"
        >
          Warning
        </button>
      </div>

      {/* The good stuff */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          className={btn}
          onClick={() => {
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: "Uploading...",
                success: "Upload complete!",
                error: "Upload failed",
              }
            );
          }}
          type="button"
        >
          Promise
        </button>
        <button
          className={btn}
          onClick={(e) => {
            toast.success("Right where you clicked", {
              anchor: e.nativeEvent,
              anchorOffset: 16,
              arrow: true,
              timeout: 2000,
            });
          }}
          type="button"
        >
          Click-anchored
        </button>
        <button
          className={btn}
          onClick={() => {
            toast.success("Pinned to the button below", {
              anchor: anchorRef.current,
              anchorSide: "top",
              arrow: true,
              timeout: 2000,
            });
          }}
          type="button"
        >
          Element-anchored
        </button>
        <button
          className={btn}
          onClick={() =>
            toast.error("Connection lost", { deduplicate: true })
          }
          type="button"
        >
          Spam this one
        </button>
      </div>

      {/* Anchor target */}
      <div className="flex justify-center">
        <button
          className="rounded-lg border border-dashed border-purple-500/50 bg-purple-500/5 px-4 py-2 text-purple-500 text-sm"
          ref={anchorRef}
          type="button"
          onClick={() => {
            toast.info("I'm the anchor target", {
              anchor: anchorRef.current,
              anchorSide: "bottom",
              arrow: true,
              timeout: 2000,
            });
          }}
        >
          anchor target
        </button>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}
