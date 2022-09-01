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
      button: {
        base: 'group flex h-min w-full items-center justify-center p-0.5 text-center font-medium focus:z-10',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
