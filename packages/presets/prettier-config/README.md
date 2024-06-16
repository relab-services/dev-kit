# @relab/prettier-config

Shareable prettier configuration

## Usage

1. Install package `@relab/prettier-config`
```bash
npm install @relab/prettier-config --save-dev
```
2. Specify prettier configuration in `package.json`
```json
{
  "name": "your-package-name",
  "prettier": "@relab/prettier-config",
  "scripts": {
    "format": "prettier --write \"**/*.ts*\""
  }
}
```

## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
