/* eslint-disable quote-props */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/node_modules/**",
    "jest.config.js",
    "babel.config.js",
  ],
  plugins: ["@typescript-eslint", "import", "unused-imports", "prettier", "jsdoc", "prefer-arrow"],
  rules: {
    // error rules
    "no-debugger": "error",
    "no-var": "error",
    "no-irregular-whitespace": [
      "error",
      {
        skipStrings: true,
        skipComments: true,
        skipRegExps: true,
        skipTemplates: true,
      },
    ],

    // warn rules
    "no-console": ["warn", { allow: ["error", "warn", "info"] }],
    "generator-star-spacing": ["warn", { before: false, after: true }],
    "prefer-const": "warn",
    "padded-blocks": [
      "off",
      {
        blocks: "always",
        classes: "always",
        switches: "never",
      },
    ],
    "no-multi-spaces": "warn",
    "comma-dangle": "warn",
    "no-trailing-spaces": "warn",
    indent: ["warn", 2, { SwitchCase: 1 }],
    semi: ["warn", "always"],
    "comma-spacing": "warn",
    "max-len": [
      "warn",
      {
        code: 120,
        ignoreStrings: true,
      },
    ],
    quotes: ["warn", "double"],
    "object-curly-spacing": ["warn", "always"],
    "keyword-spacing": "warn",
    "no-empty": "warn",
    "space-before-function-paren": "off",
    "brace-style": "off",
    capIsNew: 0,
    capIsNewExceptions: 0,
    "operator-linebreak": ["warn", "after", { overrides: { "?": "before", ":": "before" } }],
    // jsdoc-plugin に設定を依存する
    "valid-jsdoc": [0],
    "require-jsdoc": [0],

    // prettier
    "prettier/prettier": [
      "warn",
      {
        semi: true,
        singleQuote: false,
        trailingComma: "es5",
        printWidth: 120,
        tabWidth: 2,
        bracketSpacing: true,
        bracketSameLine: true,
        useTabs: false,
      },
      {
        usePrettierrc: false,
      },
    ],

    // typescript
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-namespace": [0],
    "@typescript-eslint/no-empty-function": ["warn", { allow: ["private-constructors", "protected-constructors"] }],

    // import
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", ["internal", "parent", "sibling", "index", "object", "type"]],
        "newlines-between": "always",
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: { order: "asc", caseInsensitive: true },
        pathGroups: [{ pattern: "src/config.ts", group: "external", position: "before" }],
      },
    ],
    "import/no-unresolved": 0,
    "import/prefer-default-export": 0,

    // unused-import
    "unused-imports/no-unused-imports": "warn",

    // jsdoc
    "jsdoc/require-jsdoc": [
      "warn",
      {
        publicOnly: { esm: true, cjs: true },
        require: {
          ArrowFunctionExpression: false,
          ClassDeclaration: true,
          ClassExpression: false,
          FunctionDeclaration: false,
          FunctionExpression: false,
          MethodDefinition: false,
        },
        contexts: ["TSInterfaceDeclaration"],
      },
    ],
    "jsdoc/require-description": [
      "warn",
      {
        contexts: ["PropertyDefinition", "TSInterfaceDeclaration"],
      },
    ],

    // prefer-arrow
    "prefer-arrow/prefer-arrow-functions": [
      "error",
      {
        disallowPrototype: false,
        singleReturnOnly: false,
        classPropertiesAllowed: true,
        allowStandaloneDeclarations: true,
      },
    ],
  },
};
