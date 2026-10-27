/** @type {import('tailwindcss').Config} */
// Tailwind is only used for the reset and a few utilities. The look lives in src/index.css tokens.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
  corePlugins: { container: false },
};
