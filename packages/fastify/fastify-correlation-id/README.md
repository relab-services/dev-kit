# @relab/fastify-correlation-id

Fastify plugin to store and retrieve correlation IDs.

The plugin retrieves the `X-Correlation-ID` header (_or any other desired header_) from the request and makes it accessible throughout the application code. It also propagates the header to the response.

## Requirements

- Node 18+
- Fastify 4+

## Installation

### NPM

```
npm install --save @relab/fastify-correlation-id
```

### PNPM

```
pnpm add @relab/fastify-correlation-id
```

## Usage

```typescript
import Fastify from 'fastify'
import { CorrelationId } from '@relab/fastify-correlation-id'

const fastify = Fastify()
    .register(CorrelationId, {
        header: 'X-Correlation-ID', // optional
        skipResponseHeader: true, // optional
    })
```


## Configuration

There are some environment variables used to configure logger.

| Option                | Description                                                                | Default            |
|-----------------------|----------------------------------------------------------------------------|--------------------|
| `header`              | Header name for correlation ID.                                            | `X-Correlation-ID` |
| `skipResponseHeader`  | If set to `true`, it will not propagate correlation ID to response header. | `false`            |   

## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
