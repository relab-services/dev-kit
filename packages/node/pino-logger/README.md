# @relab/pino-logger

Pino-based logger configuration with Loki integration.

## Requirements

- Node 18+

## Installation

### NPM

```
npm install --save @relab/pino-logger
```

### PNPM

```
pnpm add @relab/pino-logger
```

## Setup

### Fastify

```typescript
import Fastify from 'fastify'
import pino from 'pino'
import { loggerOptions, pinoStreams } from '@relab/pino-logger'

const fastify = Fastify({
    logger: {
        enabled: true,
        base: { area: 'http' },
        ...loggerOptions,
        stream: pino.multistream(pinoStreams()),
    },
})
```

## Usage

```typescript
import { logger } from '@relab/pino-logger'

const log = logger('custom-area')

log.info('Hello')
```

## Configuration

There are some environment variables used to configure logger.

| `process.env`    | Description                                                                     | Default |
|------------------|---------------------------------------------------------------------------------|---------|
| `LOG_LEVEL`      | Log level for output to console (`trace`/`debug`/`info`/`warn`/`error`/`fatal`) | `info`  |
| `LOKI_HOST`      | Loki host name                                                                  | Empty   |   
| `LOKI_USERNAME`  | Loki user name                                                                  | Empty   |   
| `LOKI_PASSWORD`  | Loki password                                                                   | Empty   |   
| `LOKI_LOG_LEVEL` | Log level for Loki (`trace`/`debug`/`info`/`warn`/`error`/`fatal`)              | `warn`  |   
| `NAMESPACE`      | App namespace (useful for k8s apps)                                             | Empty   |   
| `HOSTNAME`       | App host name/pod name (useful for k8s apps)                                    | Empty   |   
| `COMMIT_ID`      | Git Commit SHA                                                                  | Empty   |   
| `BRANCH_NAME`    | Git branch name                                                                 | Empty   |   
| `BUILD_ID`       | Build ID                                                                        | Empty   |   


## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
