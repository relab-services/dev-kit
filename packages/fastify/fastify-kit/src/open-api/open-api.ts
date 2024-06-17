import Swagger from '@fastify/swagger'
import FastifyPlugin from 'fastify-plugin'
import { ZodType } from 'zod'

import { area } from './area'
import { OpenApiPluginOptions } from './plugin-options'
import { zodToJsonSchemaTransform } from './schema-transform'
import { storeZodSchema } from './store-zod-schema'
import { registerUi } from './ui'

export const OpenApi = FastifyPlugin<OpenApiPluginOptions>(
    (fastify, options, done) => {
        const { jsonSchemaPath, ui, subPath, customResponses, ...openapi } = options ?? {}

        const schemas = new Map<string, unknown>()

        const responseSchema = {
            ...customResponses,
            ...fastify.errorsMap?.buildOpenApiResponses(),
        }

        void fastify.register(Swagger, {
            openapi,
            transform: doc => zodToJsonSchemaTransform([])(doc),
            refResolver: { buildLocalReference: json => (json as { $id: string }).$id },
        })

        fastify.addHook('onRoute', route => {
            if (route.schema) {
                fastify.log.debug({ area }, 'Found OpenAPI schema for route %s', route.path)

                // Extract all Zod schemas into `components` section
                const { body, response } = route.schema

                storeZodSchema(schemas, body)

                if (response && typeof response === 'object') {
                    if (responseSchema) {
                        const r = route.schema.response as Record<string, ZodType>
                        for (const [code, schema] of Object.entries(responseSchema)) {
                            r[code] = schema
                        }
                    }

                    for (const x of Object.values(response)) {
                        storeZodSchema(schemas, x)
                    }
                }
            } else {
                fastify.log.debug({ area }, 'Skipping OpenAPI schema for route %s (not found)', route.path)
            }
        })

        fastify.addHook('onReady', () => {
            for (const schema of schemas.values()) {
                fastify.log.debug({ area, schema }, 'Adding OpenAPI schema to server context')
                fastify.addSchema(schema)
            }
        })

        if (jsonSchemaPath) {
            fastify.log.debug({ area }, 'Setting up OpenAPI schema endpoint %s', jsonSchemaPath)
            fastify.get(jsonSchemaPath, (req, reply) => reply.send(fastify.swagger()))
        }

        if (ui) {
            registerUi(fastify, options)
        }

        done()
    },
    {
        name: 'OpenApi',
    }
)
