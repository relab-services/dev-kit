import Swagger, { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import { FastifyBootstrapper } from '@relab/fastify-kit'
import { ErrorMapDefinition } from '@relab/fastify-kit-errors-handling'
import type { ReferenceConfiguration } from '@scalar/api-reference'
import { FastifyBaseLogger, FastifyTypeProvider, FastifyTypeProviderDefault, RawReplyDefaultExpression, RawRequestDefaultExpression } from 'fastify'
import http from 'http'
import { ZodType, ZodTypeDef } from 'zod'
import { ignoreOverride, parseDef, zodToJsonSchema } from 'zod-to-json-schema'
import type { Options } from 'zod-to-json-schema'

import { zodToJsonSchemaTransform } from './schema-transform'
import { registerUi } from './ui'

export type SwaggerMiddlewareOptions = {
    jsonSchemaPath?: string
    ui?: {
        path: string
        subPath?: string
        configuration?: ReferenceConfiguration
    }
    subPath?: string
    customResponses?: Record<number, ZodType>
}

const zodToJsonSchemaOptions: Partial<Options<'openApi3'>> = {
    target: 'openApi3',
    $refStrategy: 'none',
    strictUnions: true,
} as const

declare module '@relab/fastify-kit' {
    interface FastifyBootstrapper<
        Server extends http.Server,
        Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
        Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
        Logger extends FastifyBaseLogger = FastifyBaseLogger,
        TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    > {
        useSwagger: (
            options: FastifyDynamicSwaggerOptions['openapi'] & SwaggerMiddlewareOptions
        ) => FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        errorsMap?: ErrorMapDefinition
    }
}

FastifyBootstrapper.prototype.useSwagger = function <
    Server extends http.Server,
    Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
    Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
    Logger extends FastifyBaseLogger = FastifyBaseLogger,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(this: FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>, options: FastifyDynamicSwaggerOptions['openapi'] & SwaggerMiddlewareOptions) {
    const fastify = this._instance

    const schemas: Record<string, unknown> = {}

    const addFastifySchema = (name: string, schema: Record<string, unknown>) => {
        schemas[name] = schema
    }

    const addZodSchema = (data: unknown) => {
        if (data && data instanceof ZodType && data._def.refName) {
            const transformedSchema = {
                $id: data._def.refName,
                ...zodToJsonSchema(data, {
                    ...zodToJsonSchemaOptions,
                    override: (def, refs, seen, forceResolution) => {
                        const unwrapOptional = (def: ZodTypeDef) => {
                            let currentDef = def
                            while ('innerType' in currentDef && currentDef.innerType instanceof ZodType) {
                                if (!currentDef.innerType._def) break

                                currentDef = currentDef.innerType._def
                            }

                            return currentDef
                        }

                        const unwrappedDef = unwrapOptional(def)

                        if (refs.currentPath.length > 2) {
                            if (unwrappedDef.refName) {
                                const { override, ...innerRefs } = refs
                                const subSchema = parseDef(unwrappedDef, innerRefs, forceResolution)

                                if (subSchema) {
                                    addFastifySchema(unwrappedDef.refName, {
                                        $id: `${unwrappedDef.refName}`,
                                        ...subSchema,
                                    })
                                }

                                return {
                                    $ref: `#/components/schemas/${unwrappedDef.refName}`,
                                    description: unwrappedDef.description,
                                }
                            }
                        }

                        return ignoreOverride
                    },
                }),
            }

            addFastifySchema(data._def.refName, transformedSchema)
        }
    }

    const { jsonSchemaPath, ui, subPath, customResponses, ...openapi } = options ?? {}

    const responseSchema = {
        ...customResponses,
        ...this._instance.errorsMap?.buildOpenApiResponses(),
    }

    const swaggerOptions: FastifyDynamicSwaggerOptions = {
        openapi,

        transform: doc => zodToJsonSchemaTransform([])(doc),

        refResolver: {
            buildLocalReference: json => (json as { $id: string }).$id,
        },
    }
    fastify.register(Swagger, swaggerOptions)

    fastify.addHook('onRoute', route => {
        if (route.schema) {
            // Extract all Zod schemas into `components` section
            const { body, response } = route.schema

            addZodSchema(body)

            if (response && typeof response === 'object') {
                if (responseSchema) {
                    const r = route.schema.response as Record<string, ZodType>
                    for (const [code, schema] of Object.entries(responseSchema)) {
                        r[code] = schema
                    }
                }

                for (const x of Object.values(response)) {
                    addZodSchema(x)
                }
            }
        }
    })

    fastify.addHook('onReady', () => {
        for (const schema of Object.values(schemas)) {
            fastify.addSchema(schema)
        }
    })

    if (jsonSchemaPath) {
        fastify.get(jsonSchemaPath, (request, response) => response.code(200).send(this._instance.swagger()))
    }

    if (ui) {
        registerUi(fastify, options)
    }

    return this
}
