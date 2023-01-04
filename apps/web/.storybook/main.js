const rootMain = require("../../../.storybook/main");

const path = require("path");

module.exports = {
  ...rootMain,
  core: { ...rootMain.core, builder: "webpack5" },
  stories: [
    ...rootMain.stories,
    "../components/**/*.stories.mdx",
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../pages/**/*.stories.mdx",
    "../pages/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    ...rootMain.addons,
    "@nrwl/react/plugins/storybook",

    "storybook-addon-swc",
    {
      name: "storybook-addon-next",
      options: {
        nextConfigPath: path.resolve(__dirname, "../next.config.js"),
      },
    },
  ],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

    // add your own webpack tweaks if needed

    return config;
  },
  env: (config) => ({
    ...config,
    STORYBOOK_ENV: true,
    NEXT_PUBLIC_APP_SERVER_URL: 'http://localhost:8081',
    NEXT_PUBLIC_FHIR_URL: 'http://localhost:8081/fhir-server/api/v4',
    NEXT_PUBLIC_EXTENSION_URL: 'http://localhost:8082/extensions',
    EXAMPLE_VAR: 'An environment variable configured in Storybook',
  }),
};
