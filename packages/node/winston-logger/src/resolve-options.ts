import * as Transport from 'winston-transport'
import { format, LoggerOptions, transports } from 'winston'
import TelegramLogger from 'winston-telegram'

import { pad } from './pad'
import { Configuration, levels } from './types'

export const resolveOptions: (configuration: Configuration, area: string) => LoggerOptions = (configuration, area) => {
    const level = configuration.verbosity[area] ?? configuration.verbosity['*'] ?? 'info'
    const loggerTransports: Transport[] = [
        new transports.Console({
            format: format.combine(
                format.printf(({ timestamp, level, message, area, error, ...t }) => {
                    const colorize = format.colorize({
                        colors: {
                            error: 'red',
                            warn: 'yellow',
                            info: 'blue',
                            debug: 'cyan',
                            trace: 'magenta',
                            timestamp: 'gray',
                            area: 'green',
                            details: 'gray',
                            errorMessage: 'red',
                            errorDetails: 'gray',
                        },
                    })

                    let padCount = 0
                    if (configuration.layout['timestamp']) padCount += timestamp.length + 2
                    if (configuration.layout['level']) padCount += level.length + 2
                    if (configuration.layout['area'] && area && area !== 'default') padCount += area.length + 2
                    if (configuration.layout['message']) padCount += 1

                    const templates = {
                        timestamp: colorize.colorize('timestamp', `[${timestamp}]`),
                        level: colorize.colorize(level, `[${level}]`),
                        area: area !== 'default' ? colorize.colorize('area', `[${area}]`) : '',
                        details: colorize.colorize('details', pad(t, padCount)),
                        error: error
                            ? error instanceof Error
                                ? [
                                      colorize.colorize('errorMessage', pad(`${error.name}: ${error.message}`, padCount)),
                                      colorize.colorize('errorDetails', pad(error.stack?.replace(`${error.name}: ${error.message}`, '').trim(), padCount)),
                                  ].join('')
                                : colorize.colorize('errorMessage', pad(error.toString(), padCount))
                            : '',
                    }

                    const result: string[] = []
                    if (configuration.layout['timestamp']) result.push(templates.timestamp)
                    if (configuration.layout['level']) result.push(templates.level)
                    if (configuration.layout['area']) result.push(templates.area)
                    if (configuration.layout['message']) result.push((result.length > 0 ? ' ' : '') + message)
                    if (configuration.layout['details']) result.push(templates.details)
                    if (configuration.layout['error']) result.push(templates.error)

                    return result.join('')
                })
            ),
        }),
    ]

    if (configuration.telegram.enabled) {
        loggerTransports.push(
            new TelegramLogger({
                level: 'warn',
                token: configuration.telegram.token,
                chatId: configuration.telegram.chatId,
                parseMode: 'HTML',
                formatMessage: (params, info) => {
                    const { level, message, area, timestamp, error, ...metadata } = info
                    const messageText = `${level} | ${area || 'default'}\n\n${message}\n\n${error ? `${error}\n\n` : ''}${JSON.stringify(metadata, null, 2)}`

                    return messageText.substring(0, 4096) + (messageText.length > 4096 ? '...' : '')
                },
            })
        )
    }

    return {
        level,
        levels,
        format: format.combine(format.splat(), format.timestamp({ format: 'DD.MM.YYYY HH:mm:ss Z' })),
        transports: loggerTransports,
    }
}
