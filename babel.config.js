module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        src: ['./src'],
        onboarding: ['./src/app/onboarding'],
        lib: ['./src/lib'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
