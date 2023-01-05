module.exports = {
  stories: [],
  addons: ["@storybook/addon-essentials"],
  // uncomment the property below if you want to apply some webpack config globally
  // webpackFinal: async (config, { configType }) => {
  //   // Make whatever fine-grained changes you need that should apply to all storybook configs

  //   // Return the altered config
  //   return config;
  // },
  env: config => ({
    ...config,
    NEXT_PUBLIC_APP_SERVER_URL: 'http://localhost:8081',
    NEXT_PUBLIC_FHIR_URL: 'http://localhost:8081/fhir-server/api/v4',
    NEXT_PUBLIC_EXTENSION_URL: 'http://localhost:8082/extensions',
    EXAMPLE_VAR: 'An environment variable configured in Storybook'
  }),
  core: {
    builder: 'webpack5'
  }
};