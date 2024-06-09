module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended",
        "next/core-web-vitals",
        "prettier"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "@typescript-eslint/array-type": [ "warn", { default: "array" } ],
        "@typescript-eslint/ban-types": [ "error", { "types": { "{}": false }, "extendDefaults": true } ],
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "@typescript-eslint/dot-notation": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/no-extraneous-class": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/promise-function-async": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        "@typescript-eslint/unbound-method": "off",
        "import/no-anonymous-default-export": "off",
        "no-extra-boolean-cast": "warn",
        "no-undef-init": "warn",
        "no-useless-escape": "warn",
        "no-void": "off",
        "prefer-const": "warn",
        "react-hooks/exhaustive-deps": "error",
        "spaced-comment": "warn"
    },
    "ignorePatterns": [
        "node_modules/",
        "**/node_modules/",
        "/**/node_modules/*"
    ]
}
