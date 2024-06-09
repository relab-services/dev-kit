<h1 align="center">🎯 Health Checks for fastify</h1>

## Requirements

- Node 18+
- Fastify 4+

## Installation

### NPM

```
npm install --save @relab/fastify-health-check
```

### PNPM

```
npm add @relab/fastify-health-check
```

## Usage

```typescript
import { HealthCheck, ComponentsHealthCheck, HealthChecks } from '@relab/fastify-health-check'
import { handleShutdown, onShutdown } from '@relab/graceful-shutdown'

// Just generic health check
// Returns HTTP 200 unless you throw HealthCheckError
const startup: HealthCheck = {
    url: 'startup',
    check: () => {
        // check your resources if needed
    },
}

// Health check that allows to track multiple component
// Use probe.setHealthy('<component name>') to make it healthy
// Health check returns HTTP once all components are healthy
export const ready = new ComponentsHealthCheck('ready', ['http'])

const live: HealthCheck = {
    url: 'live',
    check: () => {
        // check your resources if needed
        if (/* something wrong */) {
            throw new HealthCheckError({ database: 'Unhealthy' })
        }
        return { uptime: process.uptime() }
    },
}

const fastify = Fastify({
        logger: true,
    })
    // Now your probes available at /health/startup, /health/ready and /health/live
    .register(HealthChecks, {
        prefix: 'health',
        probes: [startup, ready, live],
    })

fastify.addHook('onListen', done => {
    ready.setHealthy('http')
    done()
})

onShutdown(async () => {
    ready.setUnhealthy('http')
})

fastify.listen({ port: 3000 })

handleShutdown()
```
## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
