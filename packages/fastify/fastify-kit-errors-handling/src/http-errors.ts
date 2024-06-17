import { FastifyBootstrapper } from '@relab/fastify-kit'
import { FastifyBaseLogger, FastifyTypeProvider, FastifyTypeProviderDefault, RawReplyDefaultExpression, RawRequestDefaultExpression } from 'fastify'
import http from 'http'
import { z, ZodSchema, ZodType } from 'zod'

import './error-handler'
import {
    AuthenticationError,
    AuthenticationErrorSchema,
    AuthorizationError,
    AuthorizationErrorSchema,
    UnexpectedServerError,
    UnexpectedServerErrorSchema,
} from './errors'

declare module 'fastify' {
    interface FastifyInstance {
        errorsMap?: ErrorMapDefinition
    }
}

declare module '@relab/fastify-kit' {
    interface FastifyBootstrapper<
        Server extends http.Server,
        Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
        Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
        Logger extends FastifyBaseLogger = FastifyBaseLogger,
        TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    > {
        useErrorsMap: (configure?: (errors: ErrorMapDefinition) => void) => FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>
    }
}

FastifyBootstrapper.prototype.useErrorsMap = function <
    Server extends http.Server,
    Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
    Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
    Logger extends FastifyBaseLogger = FastifyBaseLogger,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(this: FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>, configure?: (errors: ErrorMapDefinition) => void) {
    this._instance.errorsMap = new ErrorMapDefinition()
    if (configure) configure(this._instance.errorsMap)

    this.useErrorHandler(this._instance.errorsMap.buildErrorHandler())

    return this
}

type HttpCode = number

interface ErrorMappingItem<TErrorClass extends new (...args: any) => Error, TErrorOutputSchema extends ZodSchema<any>> {
    0: TErrorClass
    1: HttpCode
    2: TErrorOutputSchema
    3: (errorInstance: InstanceType<TErrorClass>) => z.infer<TErrorOutputSchema>
}

type ErrorsMap = ErrorMappingItem<new (...args: any) => Error, ZodSchema<any>>[]

export class ErrorMapDefinition {
    private readonly errors: ErrorsMap = []
    private defaultHandler?: (error: unknown) => unknown

    constructor() {
        this.configure(AuthenticationError, 401, AuthenticationErrorSchema, e => ({}))
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
        httpCode: number,
        schema: TErrorOutputSchema,
        handler: (errorInstance: InstanceType<TErrorClass>) => z.infer<TErrorOutputSchema>
    ): ErrorMapDefinition {
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

    public buildErrorHandler(): (error: Error) => undefined | { status: number; payload: unknown } | Promise<{ status: number; payload: unknown }> {
        return (error: Error) => {
            const foundErrorMap = this.errors.find(e => error instanceof e['0'])
            if (foundErrorMap) {
                const handler = foundErrorMap['3']
                const payload = handler(error)

                return { status: foundErrorMap['1'], payload }
            } else {
                const payload = this.defaultHandler?.(error)

                if (payload) return { status: 500, payload }
                else return { status: 500, payload: {} }
            }
        }
    }
}
