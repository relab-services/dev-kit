import { onShutdown } from '@relab/graceful-shutdown'
import FastifyPlugin from 'fastify-plugin'

export type HealthStatusPluginOptions = {
    onHealthy?: () => void | Promise<void>
    onUnhealthy?: () => void | Promise<void>
}

export const HealthStatus = FastifyPlugin<HealthStatusPluginOptions>(
    (fastify, options, done) => {
        fastify.addHook('onListen', async () => await options?.onHealthy?.())

        onShutdown(async () => options.onUnhealthy?.())

        done()
    },
    { name: 'HealthStatus' }
)
