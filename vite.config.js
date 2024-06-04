/// <reference types="vitest" />
// import { defineConfig } from 'vitest/config'
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // https://remix.run/docs/en/main/start/quickstart
  plugins: [remix()],
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    environment: 'jsdom', // no browser here
  },
});
