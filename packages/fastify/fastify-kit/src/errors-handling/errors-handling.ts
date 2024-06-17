import FastifyPlugin from 'fastify-plugin'

import { ErrorMapDefinition } from './error-map-definition'
import { NotFoundError } from './errors'

declare module 'fastify' {
    interface FastifyInstance {
        errorsMap?: ErrorMapDefinition
    }
}

export type ErrorsHandlingPluginOptions = {
    http: (configure: ErrorMapDefinition) => void
    ignoreLogging: Function[] // eslint-disable-line @typescript-eslint/ban-types
}

export const ErrorsHandling = FastifyPlugin<ErrorsHandlingPluginOptions>(
    (fastify, options, done) => {
        fastify.decorate('errorsMap', new ErrorMapDefinition(options.ignoreLogging))

        if (options.http && fastify.errorsMap) options.http(fastify.errorsMap)

        if (fastify.errorsMap) {
            const handler = fastify.errorsMap.buildErrorHandler()
            fastify.setErrorHandler(handler)
            fastify.setNotFoundHandler(async (req, reply) =>
                handler(new NotFoundError({ resource: req.url, message: `Requested URL not found: ${req.url}` }), req, reply)
            )
        }

        done()
    },
    {
        name: 'ErrorHandling',
    }
)
