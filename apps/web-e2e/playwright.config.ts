import type { PlaywrightTestConfig } from "@playwright/test";
import baseConfig from "../../playwright.config";

const config: PlaywrightTestConfig = {
  ...baseConfig
};

export default config;
