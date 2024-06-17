import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import { z, ZodSchema, ZodType } from 'zod'

import {
    AuthenticationError,
    AuthenticationErrorSchema,
    AuthorizationError,
    AuthorizationErrorSchema,
    NotFoundError,
    NotFoundErrorSchema,
    UnexpectedServerError,
    UnexpectedServerErrorSchema,
} from './errors'
import { ErrorMappingItem, ErrorsMap, HttpCode } from './errors-map'

export class ErrorMapDefinition {
    private readonly errors: ErrorsMap = []
    private readonly ignoreLogging: Function[] // eslint-disable-line @typescript-eslint/ban-types
    private defaultHandler?: (error: unknown) => unknown

    // eslint-disable-next-line  @typescript-eslint/ban-types
    constructor(ignoreLogging: Function[]) {
        this.ignoreLogging = ignoreLogging

        this.configure(AuthenticationError, 401, AuthenticationErrorSchema, e => ({}))
        this.configure(NotFoundError, 404, NotFoundErrorSchema, e => ({ resource: e.resource, message: e.message }))
        this.configure(AuthorizationError, 403, AuthorizationErrorSchema, e => ({}))
        this.configure(UnexpectedServerError, 500, UnexpectedServerErrorSchema, e => ({ message: e.message }))
    }

    public setDefaultHandler = (handler: (error: unknown) => unknown) => {
        this.defaultHandler = handler
    }

    public removeDefaultHandler = () => {
        this.defaultHandler = undefined
    }

    public configure<TErrorClass extends new (...args: any) => Error, TErrorOutputSchema extends ZodSchema<any>>(
        errorClass: TErrorClass,
        httpCode: HttpCode,
        schema: TErrorOutputSchema,
        handler: (errorInstance: InstanceType<TErrorClass>) => z.infer<TErrorOutputSchema>
    ): typeof this {
        const item: ErrorMappingItem<TErrorClass, TErrorOutputSchema> = [errorClass, httpCode, schema, handler] as const
        this.errors.push(item)
        return this
    }

    public remove<TErrorClass extends new (...args: any) => Error>(errorClass: TErrorClass) {
        // Reverse sorted array of indexes to remove
        const indexesToRemove = this.errors.reduceRight<number[]>((result, current, index) => (current['0'] === errorClass ? [...result, index] : result), [])

        // Modify the array
        for (const index of indexesToRemove) {
            this.errors.splice(index, 1)
        }
    }

    public removeAll() {
        this.errors.splice(0, this.errors.length)
    }

    public buildOpenApiResponses(): Record<number, ZodSchema> {
        const statuses = this.errors.reduce<Record<number, ErrorsMap>>((result, current) => {
            const statusCode = current['1']

            if (!result[statusCode]) result[statusCode] = []
            result[statusCode].push(current)

            return result
        }, {})

        return Object.entries(statuses).reduce<Record<number, ZodSchema>>((result, [code, map]) => {
            if (map.length === 0) return result
            if (map.length === 1) return { ...result, [code]: map[0]['2'] }

            const schemas = map.reduce<ZodType[]>((result: ZodType[], current) => {
                const schema = current['2']
                const serializedSchema = JSON.stringify(schema)

                // ensure schemas are unique
                return result.find(item => JSON.stringify(item) === serializedSchema) ? result : [...result, schema]
            }, [])

            const resultSchema =
                schemas.length > 1
                    ? z
                          .union(schemas as [z.ZodSchema, z.ZodSchema])
                          .describe(`A few different outputs are possible — ${schemas.map(x => x._def.refName).join(', ')}.`)
                    : schemas[0]

            return { ...result, [code]: resultSchema }
        }, {})
    }

    public buildErrorHandler(): (error: Error, req: FastifyRequest, reply: FastifyReply) => undefined | unknown | Promise<unknown> {
        const ignoreLogging = this.ignoreLogging
        const defaultHandler = this.defaultHandler

        return (error: Error, req: FastifyRequest, reply: FastifyReply) => {
            const shouldLog = !ignoreLogging.some(ignore => error instanceof ignore)
            const foundErrorMap = this.errors.find(e => error instanceof e['0'])

            if (shouldLog) req.log.error(error)

            if (foundErrorMap) {
                const handler = foundErrorMap['3']
                const payload = handler(error)

                void reply.status(foundErrorMap['1']).send(payload)
            } else if (defaultHandler) {
                void reply.status(500).send(defaultHandler(error))
            } else {
                void reply.status(500).send({})
            }
        }
    }
}
