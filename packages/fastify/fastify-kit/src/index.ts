import Fastify, {
    FastifyBaseLogger,
    FastifyHttpOptions,
    FastifyInstance,
    FastifyListenOptions,
    FastifyTypeProvider,
    FastifyTypeProviderDefault,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
} from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import http from 'http'
import { v4 as uuid } from 'uuid'

export class FastifyBootstrapper<
    Server extends http.Server,
    Request extends RawRequestDefaultExpression<Server> = RawRequestDefaultExpression<Server>, // eslint-disable-line @typescript-eslint/no-unused-vars
    Reply extends RawReplyDefaultExpression<Server> = RawReplyDefaultExpression<Server>, // eslint-disable-line @typescript-eslint/no-unused-vars
    Logger extends FastifyBaseLogger = FastifyBaseLogger,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault, // eslint-disable-line @typescript-eslint/no-unused-vars
> {
    protected readonly _instance: FastifyInstance<
        Server,
        RawRequestDefaultExpression<Server>,
        RawReplyDefaultExpression<Server>,
        FastifyBaseLogger,
        ZodTypeProvider
    >

    constructor(
        options?: FastifyHttpOptions<Server, Logger> & {
            ignoredErrors?: Function[]
        }
    ) {
        this._instance = Fastify({
            genReqId: () => uuid(),
            disableRequestLogging: true,
            ...(options ?? {}),
        })
            // Typings
            .setValidatorCompiler(validatorCompiler)
            .setSerializerCompiler(serializerCompiler)
            .withTypeProvider<ZodTypeProvider>()

            // Handling errors
            .addHook('onError', (request, response, error, done) => {
                const shouldBeIgnored = options?.ignoredErrors?.some(ignoredError => error instanceof ignoredError) ?? false
                if (!shouldBeIgnored) this._instance.log.error(error)

                done()
            })
    }

    public get fastify() {
        return this._instance
    }

    public get route() {
        return this._instance.withTypeProvider<ZodTypeProvider>().route.bind(this._instance)
    }

    public get log() {
        return this._instance.log
    }

    public routes(routes: Route[]) {
        this._instance.after(() => {
            routes.forEach(route =>
                route(
                    this._instance as unknown as FastifyInstance<
                        http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
                        http.IncomingMessage,
                        http.ServerResponse<http.IncomingMessage>,
                        FastifyBaseLogger,
                        ZodTypeProvider
                    >
                )
            )
        })

        return this
    }

    public listen(options?: FastifyListenOptions): Promise<string> {
        return this._instance.listen(options)
    }
}

export type Route<Server extends http.Server = http.Server> = (
    app: FastifyInstance<Server, RawRequestDefaultExpression<Server>, RawReplyDefaultExpression<Server>, FastifyBaseLogger, ZodTypeProvider>
) => void
