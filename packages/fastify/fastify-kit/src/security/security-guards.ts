import FastifyPlugin from 'fastify-plugin'

import { AuthenticationError, AuthorizationError } from '../errors-handling'
import { area } from './area'

export type SecurityGuardsPluginOptions = {
    onAuthenticationError?: () => Error
    onAuthorizationError?: () => Error
}

export const SecurityGuards = FastifyPlugin<SecurityGuardsPluginOptions>(
    (fastify, options, done) => {
        fastify.addHook('onRequest', (req, reply, done) => {
            const allowed = req.securityGuards.accessAllowed()

            fastify.log.debug(
                {
                    area,
                    guards: Array.from(req.securityGuards.entries()).reduce<Record<string, string>>(
                        (result, [key, value]) => ({
                            ...result,
                            [key]: value === undefined ? 'unset' : String(value),
                        }),
                        {}
                    ),
                },
                'Request security check: %s',
                allowed
            )

            switch (req.securityGuards.accessAllowed()) {
                case 'allowed':
                    done()
                    break

                case 'unauthenticated':
                    done(options.onAuthenticationError?.() ?? new AuthenticationError())
                    break

                case 'unauthorized':
                    done(options.onAuthenticationError?.() ?? new AuthorizationError())
                    break

                default:
                    done(new Error('Security guards were unable to validate request'))
            }
        })

        done()
    },
    {
        name: 'SecurityGuards',
    }
)
