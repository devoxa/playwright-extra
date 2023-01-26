import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import os from 'os'

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30 * 1000,
  fullyParallel: true,
  workers: os.cpus().length - (process.env.CI ? 0 : 2),
  forbidOnly: !!process.env.CI,
  maxFailures: process.env.CI ? 10 : undefined,

  expect: {
    timeout: 5 * 1000,
  },

  reporter: process.env.CI ? [['github']] : [['line'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3000',
    actionTimeout: 5 * 1000,
    launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] },
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'safari', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'yarn test:start-examples',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
}

export default config
