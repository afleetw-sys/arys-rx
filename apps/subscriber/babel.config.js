module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    // NativeWind 4 does not use a babel plugin — the CSS transform is
    // handled by withNativeWind() in metro.config.js and the JSX
    // transform by jsxImportSource above.
  };
};
