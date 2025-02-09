module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["airbnb", "prettier", "plugin:node/recommended"],
  rules: {
    "prettier/prettier": ["warn", { endOfLine: "auto" }],
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["warn", { object: true, array: false }],
    "prefer-object-spread": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "req|res|next|val" }],
    "parser": "babel-eslint",
    "parserOptions": {
      sourceType: "module",
      allowImportExportEverywhere: true,
    },
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
