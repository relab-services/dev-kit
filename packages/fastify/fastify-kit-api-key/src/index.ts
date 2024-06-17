import { FastifyBootstrapper } from '@relab/fastify-kit'
import {
    FastifyBaseLogger,
    FastifySchema,
    FastifyTypeProvider,
    FastifyTypeProviderDefault,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
} from 'fastify'
import http from 'http'

type Options = {
    schemas: string[]
    token: string | string[]
    onAuthenticationError: () => Error
    onAuthorizationError: () => Error
}

declare module '@relab/fastify-kit' {
    interface FastifyBootstrapper<
        Server extends http.Server,
        Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
        Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
        Logger extends FastifyBaseLogger = FastifyBaseLogger,
        TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    > {
        useApiKey: (options: Options) => FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>
    }
}

FastifyBootstrapper.prototype.useApiKey = function <
    Server extends http.Server,
    Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
    Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
    Logger extends FastifyBaseLogger = FastifyBaseLogger,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(this: FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>, options: Options) {
    const validateApiKey = (requestToken: string): boolean => {
        if (Array.isArray(options.token)) return options.token.some(token => token === requestToken)
        else return options.token === requestToken
    }

    this._instance.after(() => {
        this._instance.addHook('onRequest', (request, reply, done) => {
            const routeSchema:
                | (FastifySchema & {
                      security?: { [p: string]: readonly string[] }[]
                  })
                | undefined = request.routeOptions.schema

            const routeSchemas = routeSchema?.security?.reduce<string[]>((result, current) => [...result, ...Object.keys(current)], []) ?? []
            const shouldValidate = options.schemas.some(schema => routeSchemas.includes(schema))

            if (shouldValidate) {
                const token = request.headers['authorization']

                if (!token) done(options.onAuthenticationError())
                else if (validateApiKey(token)) done()
                else done(options.onAuthorizationError())
            } else {
                done()
            }
        })
    })

    return this
}
