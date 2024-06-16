import colors from 'ansi-colors'
import boxen, { BorderStyle } from 'boxen'

export const welcome = (
    name: string,
    version: string,
    config?: (
        | {
              key: string
              value?: string | number | boolean
          }
        | undefined
    )[]
) => {
    const configKeyLength = (config ?? []).reduce<number>((result, current) => Math.max(result, (current?.key.length ?? 0) + 1), 0)
    const titleSection = `${colors.blue.bold.underline(name)}
${colors.dim(`Version: ${colors.bold(version)}`)}`

    const configSection = config
        ?.map(item =>
            item
                ? `${colors.gray('—')} ${colors.dim(`${item.key}:`.padEnd(configKeyLength + 1))} ${
                      item.value !== undefined ? colors.magenta(String(item.value)) : colors.dim('N/A')
                  }`
                : ''
        )
        .join('\n')

    const startTimeSection = `${colors.dim('Startup Time: ')}${colors.white.underline(new Date().toUTCString())}`

    const message = `${titleSection}

${configSection}


${startTimeSection}`
    const box = {
        borderStyle: BorderStyle.Bold,
        padding: {
            top: 1,
            bottom: 1,
            left: 2,
            right: 5,
        },
    }

    console.log(boxen(message, box))
}
