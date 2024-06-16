import Fastify, { FastifyHttpOptions, RegisterOptions } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import http from 'http'
import kebabCase from 'lodash/kebabCase'
import { v4 as uuid } from 'uuid'

import { Route } from './route'
import { SecurityGuard } from './security'

declare module 'fastify' {
    interface FastifyInstance {
        registerRoutes: (routes: Route[], options?: RegisterOptions) => FastifyInstance
    }

    interface FastifyRequest {
        securityGuards: SecurityGuard
    }
}

export const createFastifyApp = (options?: FastifyHttpOptions<http.Server>) => {
    const app = Fastify({
        genReqId: () => uuid(),
        disableRequestLogging: true,
        ...(options ?? {}),
    })
        .setValidatorCompiler(validatorCompiler)
        .setSerializerCompiler(serializerCompiler)
        .withTypeProvider<ZodTypeProvider>()

    // @ts-ignore
    app.decorateRequest<SecurityGuard>('securityGuards', undefined)
    app.addHook('onRequest', async request => {
        request.securityGuards = new SecurityGuard()
    })

    app.registerRoutes = function (routes: Route[], options?: RegisterOptions) {
        for (const Route of routes) {
            app.register((fastify, options, done) => {
                // create a context for every route, so it will have a named logging area

                fastify.addHook('onRequest', (req, reply, done) => {
                    const area = kebabCase(Route.name)

                    req.log = req.log.child({ area })
                    reply.log = reply.log.child({ area })

                    done()
                })

                app.register(Route, options)
                done()
            })
        }
        return this
    }

    return app
}
