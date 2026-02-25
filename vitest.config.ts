import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/**/*.spec.ts",
        "src/index.ts",
        "src/types.ts",
        "src/use-toaster.ts",
        "src/toast-root.tsx",
        "node_modules/**",
        "dist/**",
      ],
      thresholds: {
        lines: 90,
        functions: 80,
        branches: 90,
        statements: 90,
      },
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
  },
});
