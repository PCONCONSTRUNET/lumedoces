import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/index.func",
      publicDir: ".vercel/output/static"
    }
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
