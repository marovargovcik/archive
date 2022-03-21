module.exports = {
    env: {
        browser: true,
        es6: true,
        jquery: true,
        node: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    rules: {
        indent: [
            "error",
            4,
            {
                SwitchCase: 4,
            },
        ],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single"],
        semi: ["error", "always"],
    },
};
