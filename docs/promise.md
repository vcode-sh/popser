# Promise Toasts

`toast.promise()` transitions through loading → success → error automatically. You provide the promise and the messages. popser handles the state machine.

```ts
import { toast } from "@vcui/popser";

toast.promise(fetchData(), {
  loading: "Fetching data...",
  success: "Data loaded",
  error: "Failed to fetch",
});
```

## Signature

```ts
toast.promise<T>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  options: PopserPromiseOptions<T>
): Promise<T> & { id: string }
```

Returns the original promise with an `id` property attached. Use it for tracking.

## Options

```ts
{
  loading: ReactNode;
  success: ReactNode | ((result: T) => ReactNode | PopserPromiseExtendedResult | undefined);
  error: ReactNode | ((error: unknown) => ReactNode | PopserPromiseExtendedResult | undefined);
  description?: ReactNode | ((data: T) => ReactNode) | ((error: unknown) => ReactNode);
  finally?: () => void | Promise<void>;
  id?: string;
  signal?: AbortSignal;
  aborted?: ReactNode | ((reason: unknown) => ReactNode | PopserPromiseExtendedResult | undefined);
  onAbort?: (reason: unknown) => void;
}
```

## Dynamic Messages

Pass a function to `success` or `error` to compute the message from the result:

```ts
toast.promise(saveUser(data), {
  loading: "Saving...",
  success: (user) => `Saved ${user.name}`,
  error: (err) => `Failed: ${err.message}`,
});
```

## JSX Results

Handlers accept `ReactNode`, not just strings:

```ts
toast.promise(saveUser(data), {
  loading: "Saving...",
  success: (user) => <span>Saved <strong>{user.name}</strong></span>,
  error: (err) => <span className="text-red-500">{err.message}</span>,
});
```

## Extended Results

Return an object with `title` plus additional options to fully control the resulting toast:

```ts
toast.promise(uploadFile(file), {
  loading: "Uploading...",
  success: (result) => ({
    title: "Uploaded",
    description: result.filename,
    timeout: 8000,
    icon: <FileIcon />,
    action: {
      label: "View",
      onClick: () => openFile(result.url),
    },
  }),
  error: (err) => ({
    title: "Upload failed",
    description: err.message,
    timeout: 0, // persistent until dismissed
  }),
});
```

Extended results are detected by the presence of a `title` property (and not being a React element). You can include `description`, `timeout`, `icon`, `action`, `cancel`, and any other `PopserOptions` field.

## Conditional Skip

Return `undefined` from a handler to dismiss the toast silently instead of showing a success or error state:

```ts
toast.promise(fetchData(), {
  loading: "Loading...",
  success: (data) => data.silent ? undefined : "Done!",
  error: (err) => err.name === "AbortError" ? undefined : `Error: ${err.message}`,
});
```

Useful for background operations where the user doesn't need confirmation, or for suppressing expected abort errors.

## Per-State Descriptions

The `description` field can be a function that receives the resolved data or error:

```ts
toast.promise(fetchItems(), {
  loading: "Loading items...",
  success: "Done",
  description: (items) => `${items.length} items loaded`,
  error: "Failed",
});
```

For error state, the function receives the error:

```ts
toast.promise(save(), {
  loading: "Saving...",
  success: "Saved",
  error: "Failed",
  description: (err) => err instanceof Error ? err.message : "Unknown error",
});
```

## Finally Handler

Runs after the promise settles, regardless of success or error:

```ts
toast.promise(uploadFile(file), {
  loading: "Uploading...",
  success: "Done",
  error: "Failed",
  finally: () => {
    cleanup();
  },
});
```

## Lazy Promises

Pass a function instead of a promise to delay execution:

```ts
toast.promise(
  () => fetchData(), // not called until toast is created
  {
    loading: "Loading...",
    success: "Done",
    error: "Failed",
  },
);
```

## AbortSignal

Cancel a promise toast with an `AbortSignal`. When the signal fires, the loading toast is replaced with the `aborted` content (or dismissed if no `aborted` is provided).

```ts
const controller = new AbortController();

toast.promise(fetchData(), {
  loading: "Fetching...",
  success: "Done",
  error: "Failed",
  signal: controller.signal,
  aborted: "Request cancelled",
});

// Later
controller.abort();
```

### Dynamic aborted content

`aborted` accepts a function that receives the abort reason:

```ts
toast.promise(fetchData(), {
  loading: "Fetching...",
  success: "Done",
  error: "Failed",
  signal: controller.signal,
  aborted: (reason) => `Cancelled: ${reason}`,
});

controller.abort("User navigated away");
```

### Extended aborted result

Return an object for full control over the aborted toast:

```ts
toast.promise(fetchData(), {
  loading: "Fetching...",
  success: "Done",
  error: "Failed",
  signal: controller.signal,
  aborted: (reason) => ({
    title: "Cancelled",
    description: String(reason),
    timeout: 5000,
  }),
});
```

### onAbort callback

Run side effects when the signal fires:

```ts
toast.promise(fetchData(), {
  loading: "Uploading...",
  success: "Done",
  error: "Failed",
  signal: controller.signal,
  aborted: "Upload cancelled",
  onAbort: (reason) => {
    cleanup();
    analytics.track("upload_cancelled", { reason });
  },
});
```

The aborted toast defaults to type `"warning"`. Return `undefined` from the `aborted` handler to dismiss silently.

## Custom ID

Provide a custom ID for tracking:

```ts
const result = toast.promise(save(), {
  loading: "Saving...",
  success: "Saved",
  error: "Failed",
  id: "save-operation",
});

console.log(result.id); // "save-operation"
```
