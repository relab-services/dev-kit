import { AsyncLocalStorage } from 'node:async_hooks'

import FastifyPlugin from 'fastify-plugin'
import { v4 as uuid } from 'uuid'

import { area } from './area'

const storage = new AsyncLocalStorage<string>()

declare module 'fastify' {
    interface FastifyRequest {
        correlationId?: string
    }
}

export type CorrelationIdPluginOptions = {
    header?: string
    skipResponseHeader?: boolean
}

export const CorrelationId = FastifyPlugin<CorrelationIdPluginOptions>(
    (fastify, options, done) => {
        const log = fastify.log.child({ area })

        fastify.decorateRequest('correlationId')

        const headerName = options.header || 'X-Correlation-ID'
        const headerNameNormalized = headerName.trim().toLowerCase()

        fastify.addHook('onRequest', (req, reply, done) => {
            const value = req.headers[headerNameNormalized]
            let correlationId = typeof value === 'string' ? value : Array.isArray(value) && value.length > 0 ? value[0] : undefined
            if (correlationId) {
                log.debug('Correlation ID resolved from HTTP request: %s', correlationId)
            } else {
                correlationId = uuid()
                log.debug('Correlation ID is generated: %s', correlationId)
            }

            if (options.skipResponseHeader !== true) void reply.header(headerName, correlationId)
            req.correlationId = correlationId

            storage.run(correlationId, done)
        })
        done()
    },
    {
        name: 'CorrelationId',
    }
)

export const getCorrelationId = () => storage.getStore()
