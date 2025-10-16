import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/**
 * Minimal ESLint flat config that:
 * - Covers JS/TS/JSX/TSX files
 * - Keeps rules light to avoid conflicts with CRA/Jest setup
 * - Enables React JSX usage rules and disables legacy React-in-scope requirements
 * Note: We do NOT bring in heavy TypeScript rulesets to avoid churn.
 */
export default [
  // Set file globs for both JS and TS
  { files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"] },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      },
      globals: {
        document: true,
        window: true,
        test: true,
        expect: true,
        jest: true
      }
    },
    rules: {
      // Keep unused-vars strict but avoid noise around React symbol
      "no-unused-vars": ["error", { varsIgnorePattern: "React|App", args: "none", ignoreRestSiblings: true }]
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
  }
];
