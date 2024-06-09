import process from 'process'

import { handlers } from './handlers'

export const handleShutdown = (options?: {
    timeout?: number
    onShutdownStart?: () => void | Promise<void>
    onShutdownError?: (reason: 'timeout' | 'error') => void | Promise<void>
    onShutdownComplete?: () => void | Promise<void>
}) => {
    process.removeAllListeners('SIGINT')
    process.removeAllListeners('SIGTERM')

    let signalCounter = 0

    const processShutdown = async (e: NodeJS.Signals) => {
        if (signalCounter > 1) process.exit(1)
        signalCounter++

        if (signalCounter === 1 && options?.onShutdownStart) await options.onShutdownStart()

        const callbacks = handlers.map(handler => handler(e))

        const timeout = new Promise(resolve => setTimeout(resolve, options?.timeout ?? 5000)).then<'timeout'>(() => 'timeout')
        const shutdown = Promise.allSettled(callbacks).then(results => (results.some(x => x.status === 'rejected') ? 'error' : 'completed'))

        const result = await Promise.race<'timeout' | 'completed' | 'error'>([timeout, shutdown])

        if (result === 'completed') {
            if (options?.onShutdownComplete) await options.onShutdownComplete()
            process.exit(0)
        } else {
            if (options?.onShutdownError) await options.onShutdownError(result)
            process.exit(1)
        }
    }

    process.on('SIGTERM', processShutdown)
    process.on('SIGINT', processShutdown)
}
