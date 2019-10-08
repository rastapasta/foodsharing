module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:mocha/recommended'
  ],
  plugins: [
    'mocha',
    'jest'
  ],
  env: {
    'browser': true,
    'detox/detox': true,
    'es6': true,
    'jest/globals': true,
    'node': true,
  }
}
