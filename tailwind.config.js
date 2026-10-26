/** @type {import('tailwindcss').Config} */
// Design tokens for NativeWind. Same values as src/theme/tokens.ts.
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#7C3AED', dark: '#6D28D9', light: '#F3EEFF' },
        accent: '#EC4899',
        background: '#F7F7FB',
        card: '#FFFFFF',
        ink: '#0F0F1A',
        muted: '#8A8AA0',
        line: '#EDEBF5',
        danger: '#F43F5E',
        success: '#10B981',
      },
    },
  },
  plugins: [],
};
