import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env['CI']),
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    reducedMotion: 'reduce',
  },
  expect: {toHaveScreenshot: {animations: 'disabled', maxDiffPixelRatio: 0.001}},
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
})
