/** @type {import('tailwindcss').Config} */
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      scale: {
        '-1': '-1'
      },
      backgroundImage: (theme) => ({
        login: "url('./img/login_bg.jpg')",
        logo: "url('./img/logo.png')",
      }),
    },
  },
  plugins: [require("@tailwindcss/forms"), require('flowbite/plugin')],
};