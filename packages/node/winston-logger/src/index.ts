import { configuration } from './configuration'
import { AppLogger } from './logger'
import { LayoutElement, levels } from './types'

export let logger = new AppLogger()

export const scoped = (area: string) => new AppLogger(area)

export const configureLogger = (
    options:
        | { kind: 'layout'; layout: LayoutElement[] }
        | {
              kind: 'verbosity'
              verbosity: { area: string; level: keyof typeof levels }
          }
        | {
              kind: 'telegram'
              telegram:
                  | { enabled: false }
                  | {
                        enabled: true
                        token: string
                        chatId: number
                    }
          }
) => {
    switch (options.kind) {
        case 'layout':
            configuration.layout = options.layout.reduce<Record<LayoutElement, boolean>>(
                (result, current) => ({
                    ...result,
                    [current]: true,
                }),
                {
                    timestamp: false,
                    level: false,
                    area: false,
                    message: false,
                    details: false,
                    error: false,
                }
            )

            break
        case 'verbosity':
            configuration.verbosity[options.verbosity.area] = options.verbosity.level

            break
        case 'telegram':
            configuration.telegram = options.telegram

            break
    }

    logger = new AppLogger()

    return { configureLogger }
}

export { patchCommonLogger } from './patch'
