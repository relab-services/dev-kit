import { FastifyPluginCallback } from 'fastify'

import { HealthCheck } from './health-check'
import { HealthCheckError } from './health-check-error'

export const HealthChecks: FastifyPluginCallback<{
    prefix: string
    probes: HealthCheck[]
}> = (fastify, { prefix, probes }, done) => {
    for (const { url, check } of probes) {
        fastify.get(url.startsWith('/') ? url : `/${url}`, async (request, response) => {
            try {
                const result = await check()

                response.statusCode = 200
                response.send(typeof result === 'object' ? JSON.stringify(result, null, 2) : result ?? 'OK')
            } catch (error) {
                response.statusCode = 500

                if (error instanceof HealthCheckError) response.type(error.contentType)
                if (error instanceof Error) response.send(error.message)
            }
        })
    }

    done()
}
