import { handlers } from './handlers'
import { ShutdownHandler } from './shutdown-handler'

export const onShutdown = (handler: ShutdownHandler) => {
    handlers.push(handler)

    return {
        unsubscribe: () => {
            const index = handlers.indexOf(handler)
            if (index >= 0) handlers.splice(index, 1)
        },
    }
}
