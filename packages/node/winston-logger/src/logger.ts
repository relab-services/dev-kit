import { Container, Logger } from 'winston'

import { configuration } from './configuration'
import { resolveOptions } from './resolve-options'

const container = new Container()

class AppLogger {
    private readonly _container: string
    private readonly _logger: Logger

    constructor(area?: string) {
        const containerName = (area || 'default').trim().toLowerCase()
        if (!container.has(containerName)) {
            const options = resolveOptions(configuration, containerName)
            container.add(containerName, options)
        }

        this._container = containerName
        this._logger = container.get(containerName)
    }

    public error(message: string, ...meta: any[]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._logger.log('error', message, ...meta, { message, area: this._container })
        return this
    }

    public warn(message: string, ...meta: any[]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._logger.log('warn', message, ...meta, { message, area: this._container })
        return this
    }

    public info(message: string, ...meta: any[]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._logger.log('info', message, ...meta, { message, area: this._container })
        return this
    }

    public debug(message: string, ...meta: any[]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._logger.log('debug', message, ...meta, { area: this._container })
        return this
    }

    public trace(message: string, ...meta: any[]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._logger.log('trace', message, ...meta, { message, area: this._container })
        return this
    }
}

export { AppLogger, container }
