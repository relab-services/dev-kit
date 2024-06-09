import yaml from 'js-yaml'

export const pad = (source: any, length: number, mode?: 'json' | 'yaml') => {
    if (source) {
        const padding = Array.from({ length })
            .map(_ => ' ')
            .join('')

        let result: string | undefined

        if (typeof source === 'string' || typeof source === 'number' || typeof source === 'boolean') {
            result = String(source)
        } else if (
            typeof source === 'object' &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            Object.keys(source).length > 0
        ) {
            const indent = Number(process.env.LOGGER_INDENT ?? 2) || 2
            const isJSON = mode ?? process.env.LOGGER_MODE !== 'yaml'

            result = isJSON ? JSON.stringify(source, null, indent) : yaml.dump(source, { indent, noCompatMode: true })
        }

        if (result) {
            return `\n${result
                .split('\n')
                .map(x => `${padding}${x}`)
                .join('\n')
                .trimEnd()}`
        }
    }

    return ''
}
