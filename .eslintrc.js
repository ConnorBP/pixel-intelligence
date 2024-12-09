module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                caseSensitive: true,
            },
        },
    },
    plugins: ['react', 'react-hooks', 'import'],
    rules: {
        'react/jsx-no-target-blank': 'off',
        'react/prop-types': 0,
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'import/no-unresolved': [
            'warn',
            { caseSensitive: true },
        ],
    },
};