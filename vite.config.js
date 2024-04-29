/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    environment: 'jsdom', // no browser here
  },
});
