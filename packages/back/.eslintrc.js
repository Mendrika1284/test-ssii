module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  plugins: ["prettier", "@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "test/tsconfig.json"],
  },
  ignorePatterns: [".eslintrc.js"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  settings: {
    "import/resolver": {
      alias: [["@", "./src/"]],
    },
  },
  rules: {
    "import/no-unresolved": 0,
    "@typescript-eslint/restrict-template-expressions": ["warn", { allowAny: true }],
    "@typescript-eslint/no-namespace": "off",
  },
};
