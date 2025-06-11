/**
 * Travel Planning App - ESLint Configuration
 * Strict configuration following project standards in CLAUDE.md
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  ignorePatterns: ['!**/.server', '!**/.client', 'build/', 'node_modules/'],

  // Base config with Prettier integration
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],

  rules: {
    // Prettier integration
    'prettier/prettier': 'error',

    // General code quality
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'off', // Handled by TypeScript
    'prefer-const': 'error',
    'no-var': 'error',
  },

  overrides: [
    // React
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: ['react', 'jsx-a11y', 'prettier'],
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'prettier',
      ],
      settings: {
        react: {
          version: 'detect',
        },
        formComponents: ['Form'],
        linkComponents: [
          { name: 'Link', linkAttribute: 'to' },
          { name: 'NavLink', linkAttribute: 'to' },
        ],
        'import/resolver': {
          typescript: {},
        },
      },
      rules: {
        // React-specific strict rules
        'react/prop-types': 'off', // Using TypeScript instead
        'react/jsx-uses-react': 'off', // React 17+ JSX transform
        'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
        'react-hooks/exhaustive-deps': 'error',
        'jsx-a11y/anchor-is-valid': 'off', // Remix Link components
      },
    },

    // TypeScript - Strict Configuration
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint', 'import', 'prettier'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      settings: {
        'import/internal-regex': '^~/',
        'import/resolver': {
          node: {
            extensions: ['.ts', '.tsx'],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
      ],
      rules: {
        // TypeScript strict rules following CLAUDE.md
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',

        // Import/Export strict rules
        'import/order': [
          'error',
          {
            groups: [
              ['builtin', 'external'],
              ['internal'],
              ['parent', 'sibling', 'index'],
              ['type'],
            ],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],
        'import/no-unresolved': 'error',
        'import/no-cycle': 'error',
        'import/prefer-default-export': 'off',
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
        ],

        // Naming conventions following CLAUDE.md
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase'], // Allow PascalCase for React components
            filter: {
              regex: '^(Index|[A-Z].*)', // Exception for React components and Index
              match: false,
            },
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'], // Allow PascalCase for React components
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'interface',
            format: ['PascalCase'],
          },
          {
            selector: 'typeAlias',
            format: ['PascalCase'],
          },
        ],
      },
    },

    // Node.js files
    {
      files: ['.eslintrc.cjs', 'vite.config.ts', 'src/db/**/*.ts'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
