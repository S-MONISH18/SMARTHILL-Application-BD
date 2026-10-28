module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-community|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|react-native-reanimated|react-native-vector-icons|react-native-svg)/)',
  ],
};
