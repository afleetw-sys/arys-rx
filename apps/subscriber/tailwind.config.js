const uiPreset = require('@arys-rx/ui/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  // nativewind/preset must come first — NativeWind validates its presence at startup
  presets: [require('nativewind/preset'), uiPreset],
};
