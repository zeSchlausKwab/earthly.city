module.exports = {
  ...require('../../tooling/eslint/.eslintrc'),
  parserOptions: {
    project: './tsconfig.json',
  },
};
