import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true,
  external: ["react", "react-dom", "@base-ui/react"],
  onSuccess: "mkdir -p dist/styles && cp src/styles/*.css dist/styles/",
});
