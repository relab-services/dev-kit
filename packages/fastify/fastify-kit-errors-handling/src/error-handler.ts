import { FastifyBootstrapper } from '@relab/fastify-kit'
import { FastifyBaseLogger, FastifyTypeProvider, FastifyTypeProviderDefault, RawReplyDefaultExpression, RawRequestDefaultExpression } from 'fastify'
import http from 'http'

declare module '@relab/fastify-kit' {
    interface FastifyBootstrapper<
        Server extends http.Server,
        Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
        Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
        Logger extends FastifyBaseLogger = FastifyBaseLogger,
        TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    > {
        useErrorHandler: (
            handler: <TError extends Error>(error: TError) => undefined | { status: number; payload: unknown } | Promise<{ status: number; payload: unknown }>
        ) => FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>
    }
}

FastifyBootstrapper.prototype.useErrorHandler = function <
    Server extends http.Server,
    Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
    Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
    Logger extends FastifyBaseLogger = FastifyBaseLogger,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
    this: FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>,
    handler: <TError extends Error>(error: TError) => undefined | { status: number; payload: unknown } | Promise<{ status: number; payload: unknown }>
) {
    this._instance.setErrorHandler(async (error, request, response) => {
        const result = await handler(error)
        if (result) {
            const { status, payload } = result
            await response.code(status).send(payload)
        }
    })

    return this
}
