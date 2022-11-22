module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-console': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id'],
      },
    ],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
  },
};
