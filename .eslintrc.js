module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint",
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "rules": {
        "no-extra-boolean-cast": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-irregular-whitespace": "off",
        "no-empty": "off",
        "@typescript-eslint/ban-types": "off",
        "typescript-eslint/no-unused-vars": "off"
    },
};