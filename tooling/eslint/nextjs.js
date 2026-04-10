import baseConfig from './base.js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
];
