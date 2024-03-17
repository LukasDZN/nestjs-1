module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true, // ?
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // Disallow async functions which have no await expression
    'require-await': 'error',
    // Disallow the use of function keyword, in order to use arrow syntax
    'prefer-arrow-callback': 'error',
    // Disallow the use of the Function constructor
    'no-restricted-syntax': [
      'error',
      {
        selector: 'FunctionDeclaration', // e.g. "function hello() {...}" is not allowed
        message:
        '"function hello() {...}" is not allowed. Please use arrow syntax instead.',
      },
    ],
  },
};
