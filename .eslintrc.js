module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:react/recommended", "standard"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["react"],
    rules: {
        indent: ["warn", 4, { SwitchCase: 1 }],
        quotes: ["error", "double"],
        "comma-dangle": ["warn", "always-multiline"],
        semi: ["error", "always", { omitLastInOneLineBlock: true }],
        "react/react-in-jsx-scope": "off",
    },
};