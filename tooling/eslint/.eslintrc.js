module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // Add this to make ESLint work with Prettier
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    // Add any custom rules here
  },
};