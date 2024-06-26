import pino, { Logger } from 'pino'

import { loggerOptions } from './logger-options'
import { pinoStreams } from './pino-streams'

let defaultLogger: Logger | undefined

const getLogger = () => {
    return !defaultLogger ? (defaultLogger = pino(loggerOptions, pino.multistream(pinoStreams()))) : defaultLogger
}

export const logger = (area?: string): Logger => (area ? getLogger().child({ area }) : getLogger())

export * from './logger-options'
export * from './pino-streams'
