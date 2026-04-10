module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    // NativeWind 4 does not use a babel plugin — CSS transform is handled
    // by withNativeWind() in metro.config.js, JSX by jsxImportSource above.
    // Reanimated plugin must be listed last to transform worklet functions.
    plugins: ['react-native-reanimated/plugin'],
  };
};
