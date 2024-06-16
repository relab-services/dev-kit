# @relab/eslint-config

Shareable configuration for eslint

## Usage

1. Install packages `eslint` and `@relab/eslint-config`
```bash
npm install eslint --save-dev
npm install @relab/eslint-config --save-dev
```
2. Update `package.json` 

**Node project:**
```json
{
  "scripts": {
    "lint": "eslint . --ext ts,tsx"
  },
  "eslintConfig": {
    "extends": "@relab/eslint-config/node"
  }
}
```

**Next project:**
```json
{
  "scripts": {
    "lint": "eslint . --ext ts,tsx"
  },
  "eslintConfig": {
    "extends": "@relab/eslint-config/next"
  }
}
```

## Available configurations

- Node: `@relab/eslint-config/node`
- Next: `@relab/eslint-config/next`

## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
