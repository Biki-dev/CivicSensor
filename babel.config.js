module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@theme': './src/theme',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@appTypes': './src/types',
          '@constants': './src/constants',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@assets': './src/assets',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};