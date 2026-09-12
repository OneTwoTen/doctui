import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const entry = fileURLToPath(new URL("./src/index.ts", import.meta.url));

export default defineConfig({
  build: {
    lib: { entry, formats: ["es"], fileName: "index" },
    rollupOptions: {
      external: [
        "@modelcontextprotocol/server",
        "@modelcontextprotocol/server/stdio",
        "node:fs",
        "node:path",
        "node:process",
        "node:url",
      ],
    },
    sourcemap: true,
  },
});
