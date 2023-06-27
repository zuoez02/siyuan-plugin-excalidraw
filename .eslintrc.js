module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    React: true,
    siyuan: true,
    ReactDOM: true,
  },
  rules: {
    "react/jsx-no-undef": false,
  },
};
