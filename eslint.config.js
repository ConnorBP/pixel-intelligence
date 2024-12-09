import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import cssModules from 'eslint-plugin-css-modules';

export default [
    { ignores: ['dist', 'frontend/dist'] },
    {
        files: ['frontend/**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: {
            react: { version: '18.3' },
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.css'],
                    caseSensitive: true
                }
            }
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'import': importPlugin,
            'css-modules': cssModules
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react/jsx-no-target-blank': 'off',
            'react/prop-types': 0,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'css-modules/no-unused-class': 'warn',
            'css-modules/no-undef-class': 'error',
            'import/no-unresolved': [
                'warn',
                { caseSensitive: true }
            ]
        }
    }
];
