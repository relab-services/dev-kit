import { AppLogger } from './logger'

export const patchCommonLogger = (logger: AppLogger = new AppLogger()) => {
    console.error = logger.error.bind(logger)
    console.warn = logger.warn.bind(logger)
    console.info = logger.info.bind(logger)
    console.log = logger.info.bind(logger)
    console.debug = logger.debug.bind(logger)
    console.trace = logger.trace.bind(logger)
    return logger
}
