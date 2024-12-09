import { defineConfig } from 'eslint-define-config';
// import js from '@eslint/js';
// import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import cssModules from 'eslint-plugin-css-modules';

export default defineConfig({
    files: ['**/*.{js,jsx}'],
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
    plugins: {
        react,
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        'import': importPlugin,
        'css-modules': cssModules
    },
    rules: {
        'react/jsx-no-target-blank': 'off',
        'react/prop-types': 'off',
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'import/no-unresolved': [
            'error',
            { caseSensitive: true },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
});
