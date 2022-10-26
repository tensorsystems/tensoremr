const nxPreset = require('@nrwl/jest/preset').default;

module.exports = { 
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
  ...nxPreset 
};
