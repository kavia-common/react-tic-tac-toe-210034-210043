import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/**
 * Minimal ESLint flat config that:
 * - Covers JS/TS/JSX/TSX files
 * - Keeps rules light to avoid conflicts with CRA/Jest setup
 * - Enables React JSX usage rules and disables legacy React-in-scope requirements
 * - Recognizes Jest/RTL globals to reduce false positives
 * Note: We do NOT bring in heavy TypeScript rulesets to avoid churn.
 */
export default [
  // Apply to all source files including TS/TSX
  { files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"] },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      },
      // Keep a minimal globals set to avoid noisy errors in tests and browser code
      globals: {
        document: true,
        window: true,
        navigator: true,
        console: true,
        // Jest globals
        describe: true,
        test: true,
        it: true,
        expect: true,
        beforeAll: true,
        beforeEach: true,
        afterAll: true,
        afterEach: true,
        jest: true,
        // RTL and jest-dom helpers commonly used in tests
        screen: true
      }
    },
    rules: {
      // Keep unused-vars strict but avoid noise around React symbol, allow underscore args
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "React|App", args: "none", ignoreRestSiblings: true, caughtErrors: "none" }
      ]
    }
  },
  // Base JS recommended
  pluginJs.configs.recommended,
  // React plugin minimal rules
  {
    plugins: { react: pluginReact },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  // Ignore config for build outputs and lock files if any appear
  {
    ignores: ["build/**", "node_modules/**", "coverage/**"]
  }
];
