module.exports = {
    ...require('../../tooling/eslint/.eslintrc'),
    overrides: [
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3',
        },
    ],
    plugins: ['svelte3', '@typescript-eslint'],
    parserOptions: {
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'],
    },
    settings: {
        'svelte3/typescript': () => require('typescript'),
    },
};