import { HealthCheck, HealthChecks } from '@relab/fastify-health-check'
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
        useHealthChecks: (options: { prefix: string; probes: HealthCheck[] }) => FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>
    }
}

FastifyBootstrapper.prototype.useHealthChecks = function <
    Server extends http.Server,
    Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>,
    Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>,
    Logger extends FastifyBaseLogger = FastifyBaseLogger,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
>(
    this: FastifyBootstrapper<Server, Request, Reply, Logger, TypeProvider>,
    options: {
        prefix: string
        probes: HealthCheck[]
    }
) {
    void this._instance.register(HealthChecks, {
        prefix: options.prefix,
        probes: options.probes,
    })

    return this
}
