module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add any other plugins here
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
