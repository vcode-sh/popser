import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: resolve(import.meta.dirname),
  resolve: {
    alias: [
      {
        find: "popser/styles",
        replacement: resolve(import.meta.dirname, "../src/styles/popser.css"),
      },
      {
        find: "popser/tokens",
        replacement: resolve(import.meta.dirname, "../src/styles/tokens.css"),
      },
      {
        find: "popser",
        replacement: resolve(import.meta.dirname, "../src/index.ts"),
      },
    ],
  },
});
