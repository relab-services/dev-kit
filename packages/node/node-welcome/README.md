# @relab/node-welcome

Prints a welcome message along with the configuration parameters. 

## Requirements

- Node 18+

## Installation

### NPM

```
npm install --save @relab/node-welcome
```

### PNPM

```
npm add @relab/node-welcome
```

## Usage

```typescript
import { welcome } from '@relab/node-welcome'
import process from 'process'

welcome('My Application', process.env.VERSION || '1.0.0', [
    { key: 'Environment', value: process.env.NODE_ENV },
    { key: 'Log Level', value: process.env.LOG_LEVEL },
    undefined,
    { key: 'Base URL', value: process.env.BASE_URL },
    { key: 'Port', value: process.env.PORT },
    { key: 'Prefix', value: process.env.PATH_PREFIX },
    undefined,
    { key: 'Commit ID', value: process.env.COMMIT_ID },
    { key: 'Branch', value: process.env.BRANCH_NAME },
    { key: 'Build ID', value: process.env.BUILD_ID },
])
// ...
```

## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
