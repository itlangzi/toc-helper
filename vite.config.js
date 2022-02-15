import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "lib",
    lib: {
      entry: "./src/index.js",
      name: "TocHelper",
      formats: ["es", "umd"],
      fileName: (format) => `${format}/index.js`,
    },
    emptyOutDir: true,
    rollupOptions: {
      output: {
        compact: true,
      },
    },
  },
  plugins: [svelte({ emitCss: false })],
});
