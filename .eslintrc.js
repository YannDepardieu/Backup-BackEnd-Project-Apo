module.exports = {
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'airbnb-base', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['error', 4],
        'max-len': [2, 140, 4],
    },
    overrides: [
        {
            files: ['tests/**/*.test.js', 'tests/**/*.spec.js'],
            env: { jest: true, node: true, es6: true },
            plugins: ['jest'],
            extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:jest/all'],
            rules: { 'jest/no-hooks': ['error', { allow: ['beforeAll', 'afterAll'] }] },
        },
    ],
};
