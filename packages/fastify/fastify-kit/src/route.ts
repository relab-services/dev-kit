import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import http from 'http'

export type Route<Server extends http.Server = http.Server> = (
    app: FastifyInstance<Server, RawRequestDefaultExpression<Server>, RawReplyDefaultExpression<Server>, FastifyBaseLogger, ZodTypeProvider>
) => Promise<void>
