import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const entry = fileURLToPath(new URL("./src/public-index.ts", import.meta.url));

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry,
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rollupOptions: {
      external: ["vue"],
    },
    sourcemap: true,
  },
});
