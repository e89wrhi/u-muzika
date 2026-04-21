import { defineConfig, globalIgnores } from 'eslint/config';
import nextPlugin from '@next/eslint-plugin-next';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

// Define ignore patterns to skip directories that produce big output / are not relevant
const ignorePatterns = [
  'node_modules/',
  '.next/',
  'dist/',
  'build/',
  'coverage/',
  'env.mjs',
];

export default defineConfig([
  globalIgnores(ignorePatterns),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // pull in recommended rules from each plugin
      ...tsEslintPlugin.configs.recommended.rules,
      //...tsEslintPlugin.configs.stylistic.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // overrides
      'react/react-in-jsx-scope': 'off',
    },
  },

  // Must place formatting / style override last
  prettierRecommended,
]);
