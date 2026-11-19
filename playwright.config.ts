import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * The backend (database/api.py in TeamSydVattenRepo) is started automatically
 * if the repo is cloned next to this one. Set BACKEND_DIR if it lives
 * somewhere else. If it is not found, only the frontend is started, and tests
 * that need data from the API will fail.
 */
const backendDir = resolve(process.env.BACKEND_DIR ?? '../TeamSydVattenRepo');
const backendPython =
  process.platform === 'win32' ? '.venv\\Scripts\\python' : '.venv/bin/python';

const backendServer = existsSync(backendDir)
  ? [
      {
        command: `${backendPython} -m uvicorn database.api:app --port 8000`,
        cwd: backendDir,
        url: 'http://127.0.0.1:8000/',
        reuseExistingServer: !process.env.CI,
      },
    ]
  : [];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['./reporters/dokumentation-reporter.ts'],
  ],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
    ...backendServer,
  ],
});