import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

import eslintPluginJest from 'eslint-plugin-jest'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginSecurity from 'eslint-plugin-security'
import eslintPluginImport from 'eslint-plugin-import'

export default defineConfig([
    globalIgnores(['dist', 'node_modules']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        ignores: [
            '**/dist',
            '**/vite.config.ts',
            'eslint.config.mjs',
            'postcss.config.js',
        ],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: import.meta.dirname,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    // eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylisticTypeChecked,
    tseslint.configs.strictTypeChecked,
    eslintPluginImport.flatConfigs.recommended,
    eslintPluginReact.configs.flat.recommended,
    eslintPluginPrettier,
    eslintPluginSecurity.configs.recommended,
    {
        plugins: {
            'react-hooks': eslintPluginReactHooks,
        },
        rules: eslintPluginReactHooks.configs.recommended.rules,
    },
    {
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        plugins: {
            'jsx-a11y': eslintPluginJsxA11y,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            'jsx-a11y/alt-text': 'error',
        },
    },
    {
        files: ['**/*.spec.js', '**/*.test.js'],
        plugins: { jest: eslintPluginJest },
        languageOptions: {
            globals: eslintPluginJest.environments.globals.globals,
        },
        rules: {
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/prefer-to-have-length': 'warn',
            'jest/valid-expect': 'error',
        },
    },
    {
        rules: {
            // Empty functions frequently used as placeholder values on props.
            '@typescript-eslint/no-empty-function': 'off',

            // Allow empty TS interfaces.
            '@typescript-eslint/no-empty-object-type': 'off',

            // Many redux utilities are floating promises, e.g. dispatch().
            '@typescript-eslint/no-floating-promises': 'off',

            // Allows redux thunked actions with no 'await'.
            '@typescript-eslint/require-await': 'off',

            // Disallows inline blocks without curly brackets, e.g. inline 'if'.
            'curly': [
                'error',
                'all',
            ],

            // Previously required as TS runtime was having issues identifying some NPM package imports despite them existing.
            'import/no-unresolved': 'off',

            'import/order': [
                'error',
                {
                    named: true,
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                    },
                    groups: [
                        'builtin',
                        'external',
                        'type',
                        'internal',
                        'parent',
                        'index',
                        'object',
                        'sibling',
                    ],
                    pathGroups: [
                        {
                            group: 'external',
                            pattern: '@mui/**',
                            position: 'before',
                        },
                        {
                            group: 'internal',
                            pattern: 'src/**',
                            position: 'before',
                        },
                        {
                            group: 'builtin',
                            pattern: 'react*',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['react'],
                },
            ],

            // Set standard indentation at 4 - SPACES
            // 'indent': ['error', 4],

            // Enforce single quotes.
            'jsx-quotes': [
                'error',
                'prefer-single',
            ],

            // Warn against use of console except for console.error and console.warn. 
            'no-console': [
                'warn',
                {
                    'allow': ['error', 'warn'],
                },
            ],

            // Disallows multiple blank lines.
            'no-multi-spaces': [
                'warn',
                {
                    exceptions: {
                        'Property': true,
                        'ValueDeclarator': true,
                        'ImportDeclaration': true,
                    },
                },
            ],

            // Disallow the use of the add operand vs template strings.
            'prefer-template': 'error',

            // Override prettier settings
            'prettier/prettier': [
                'error',
                {
                    disableLanguages: ['html', 'scss'],
                    endOfLine: 'crlf',
                    jsxSingleQuote: true,
                    printWidth: 80,
                    singleQuote: true,
                    tabWidth: 4,
                    trailingComma: 'all',
                    useTabs: false,
                },
            ],

            // Enforce explicit Fragment tags instead of implicit 'empty' tags.
            'react/jsx-fragments': ['warn', 'element'],

            // No requirement to have react in scope.
            'react/react-in-jsx-scope': 'off',

            // Allow dynamic object access.
            'security/detect-object-injection': 'off',

            // Ensure a space after comments.
            'spaced-comment': [
                'error',
                'always',
                {
                    markers: ['/'],
                },
            ],
        },
    },
]);
