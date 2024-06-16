import { Configuration } from './types'

export const configuration: Configuration = {
    layout: {
        timestamp: true,
        level: true,
        area: true,
        message: true,
        details: true,
        error: true,
    },
    verbosity: {},
    telegram: {
        enabled: false,
    },
}
