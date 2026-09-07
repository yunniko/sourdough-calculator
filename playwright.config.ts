import { defineConfig } from "@playwright/test";

const PORT = 30093;

export default defineConfig({
  testDir: "./tests/e2e",
  retries: 1,
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
