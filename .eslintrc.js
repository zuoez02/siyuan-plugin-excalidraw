module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
    node: true,
    es6: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: 'module',
  },
  "globals": {
    "React": true,
    "ExcalidrawLib": true,
    "siyuan": true,
    "ReactDOM": true,
  },
  rules: {},
};
