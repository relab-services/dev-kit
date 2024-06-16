import FastifyPlugin from 'fastify-plugin'
import { OpenAPIV3 } from 'openapi-types'

import { area } from './area'

export type ApiKeyPluginOptions<T> = {
    schemas: T[]
    token: string | string[]
}

export const ApiKey = <T extends string>(schema: Record<T, OpenAPIV3.SecuritySchemeObject>) =>
    FastifyPlugin<ApiKeyPluginOptions<T>>(
        (fastify, options, done) => {
            const log = fastify.log.child({ area })

            if (fastify.hasPlugin('SecurityGuards')) {
                done(new Error('SecurityGuards plugins should be registered after actual guards'))
                return
            }

            const validateApiKey = (requestToken: string): boolean => {
                if (Array.isArray(options.token)) return options.token.some(token => token === requestToken)
                else return options.token === requestToken
            }

            fastify.addHook('onRequest', (req, reply, done) => {
                const routeSchemas = req.routeOptions.schema?.security?.reduce<string[]>((result, current) => [...result, ...Object.keys(current)], []) ?? []
                for (const schema of routeSchemas) {
                    req.securityGuards.define(schema)
                }

                const schemasToCheck = Object.entries<OpenAPIV3.SecuritySchemeObject>(schema).filter(
                    ([schemaName, schemaValue]) =>
                        options.schemas.includes(schemaName as T) && routeSchemas.includes(schemaName) && schemaValue.type === 'apiKey'
                )

                for (const [name, schema] of schemasToCheck) {
                    if (req.securityGuards?.get(name) === true) continue

                    const headerName = ('name' in schema ? schema.name : undefined)?.trim().toLowerCase()
                    if (!headerName) continue

                    const headerValue = req.headers[headerName]
                    const token =
                        typeof headerValue === 'string' ? headerValue : Array.isArray(headerValue) && headerValue.length > 0 ? headerValue[0] : undefined

                    if (token && validateApiKey(token)) {
                        log.debug('Validating %s for %s - the token is valid', name, req.url)
                        req.securityGuards.allow(name)
                    } else {
                        log.debug('Validating %s for %s - the token is not valid', name, req.url)
                    }
                }

                done()
            })

            fastify.ready(async () => {
                if (!fastify.hasPlugin('SecurityGuards')) {
                    log.error('Incorrect configuration - in order to use ApiKey plugin it is needed to register SecurityGuards as well')
                    await fastify.close()
                    process.exit(1)
                }
            })

            done()
        },
        {
            name: 'ApiKey',
        }
    )
