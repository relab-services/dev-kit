# @relab/graceful-shutdown

Tiny and stupid simple dependency-free Node.js library to shut down gracefully.

## Requirements

- Node 18+

## Installation

### NPM

```
npm install --save @relab/graceful-shutdown
```

### PNPM

```
npm add @relab/graceful-shutdown
```

## Usage

```Typescript
import { handleShutdown, onShutdown } from '@relab/graceful-shutdown'

// ...

onShutdown(async () => {
    // clean up your resources here
})

// setup graceful shutdown
handleShutdown()
```

### Custom shutdown timeout

```Typescript
import { handleShutdown, onShutdown } from '@relab/graceful-shutdown'

// ...

// setup graceful shutdown
handleShutdown({
    // 3000ms timeout to complete all shutdown tasks (default - 5000)
    timeout: 3000
})
```

### Shutdown callbacks

```Typescript
import { handleShutdown, onShutdown } from '@relab/graceful-shutdown'

// ...

handleShutdown({
    onShutdownStart: () => {
        console.log('Shut down requested')
    },
    onShutdownError: reason => {
        console.log(`Shutdown tasks error: ${reason}`)
    },
    onShutdownComplete: () => {
        console.log('Shutdown tasks completed')
    },
})
```

## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
