const js = require('@eslint/js');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  js.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['node_modules/', 'babel.config.js', 'metro.config.js', 'jest.config.js'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ✅ REGRAS DE IMPORT QUE FUNCIONAM COM FLAT CONFIG
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // Pode causar problemas com React Native
      'import/named': 'error',
      'import/default': 'error',
      
      // 🎯 ALTERNATIVA PARA DETECTAR EXPORTS NÃO USADOS
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          // Detecta variáveis/funções exportadas mas não usadas localmente
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],

      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [{ pattern: 'react', group: 'external', position: 'before' }],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      'react-native/split-platform-components': 'warn',
      'react-native/no-color-literals': 'off',
      'react-native/no-raw-text': 'off',

      'no-console': 'off',
      'no-empty-function': 'warn',
    },
  },

  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        module: 'writable',
        require: 'readonly',
        exports: 'writable',
      },
    },
  },
];