import { FastifyPluginCallback } from 'fastify'

import { HealthCheck } from './health-check'
import { HealthCheckError } from './health-check-error'

export type HealthChecksPluginOptions = {
    probes: HealthCheck[]
}

export const HealthChecks: FastifyPluginCallback<HealthChecksPluginOptions> = (fastify, { probes }, done) => {
    for (const { url, check } of probes) {
        fastify.get(url.startsWith('/') ? url : `/${url}`, async (request, response) => {
            try {
                const result = await check()

                response.statusCode = 200
                await response.send(typeof result === 'object' ? JSON.stringify(result, null, 2) : result ?? 'OK')
            } catch (error) {
                response.statusCode = 500

                if (error instanceof HealthCheckError) void response.type(error.contentType)
                if (error instanceof Error) await response.send(error.message)
            }
        })
    }

    done()
}

// @ts-expect-error TS7053
HealthChecks[Symbol.for('plugin-meta')] = { name: 'HealthChecks' }
