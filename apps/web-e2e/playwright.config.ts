import { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL || "http://localhost:4200/";

const baseConfig: PlaywrightTestConfig = {
  retries: 3,
  maxFailures: 2,
  timeout: 120000,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use prepared auth state.
        storageState: './.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // Use prepared auth state.
        storageState: './.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ]
};

export default baseConfig;

