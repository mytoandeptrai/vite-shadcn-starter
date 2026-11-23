import { defineConfig, devices } from '@playwright/test';

const PORT = 4317;

/**
 * Visual evidence run for the driving simulator: every test records a video and the specs
 * write full-page screenshots to e2e/artifacts/screenshots.
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/artifacts/results',
  fullyParallel: false,
  workers: 1,
  // The driving runs are closed-loop against a software-rendered scene, so allow one retry.
  retries: 1,
  timeout: 240_000,
  expect: { timeout: 20_000 },
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    video: 'on',
    // Headless Chromium has no GPU: render WebGL with SwiftShader.
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] },
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /mobile/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      testMatch: /mobile/,
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${PORT} --host 127.0.0.1 --strictPort`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
