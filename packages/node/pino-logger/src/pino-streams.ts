import fs from 'node:fs'
import path from 'node:path'

import pino from 'pino'
import { LokiOptions } from 'pino-loki'
import pretty from 'pino-pretty'
import process from 'process'

export const pinoStreams: () => pino.DestinationStream | pino.StreamEntry<string> | (pino.DestinationStream | pino.StreamEntry<string>)[] = () => {
    const result = [
        {
            level: process.env.LOG_LEVEL ?? 'info',
            stream: pretty({
                colorize: true,
                messageFormat: '{if area}\x1b[33m[{area}] {end}\x1b[94m{msg}',
                ignore: 'hostname,area,pid,error_name,error_message,error_stack,http_method,http_url,http_client_ip,http_response_code',
            }),
        },
    ]

    if (process.env.LOKI_HOST && process.env.LOKI_USERNAME && process.env.LOKI_PASSWORD) {
        const serviceName: string =
            process.env.SERVICE_NAME || JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), { encoding: 'utf-8' })).name

        result.push({
            level: process.env.LOKI_LOG_LEVEL ?? 'warn',
            stream: pino.transport<LokiOptions>({
                target: 'pino-loki',
                options: {
                    batching: true,
                    interval: 5,
                    host: process.env.LOKI_HOST,

                    labels: {
                        service_name: serviceName,
                        k8s_namespace: process.env.NAMESPACE ?? '',
                        k8s_pod: process.env.HOSTNAME ?? '',
                        commit_sha: process.env.COMMIT_ID ?? '',
                        branch: process.env.BRANCH_NAME ?? '',
                        buildId: process.env.BUILD_ID ?? '',
                    },
                    propsToLabels: [
                        'area',
                        'msg',

                        'error_name',
                        'error_message',
                        'error_stack',

                        'reqId',
                        'http_method',
                        'http_url',
                        'http_client_ip',
                        'http_response_code',
                    ],

                    basicAuth: {
                        username: process.env.LOKI_USERNAME,
                        password: process.env.LOKI_PASSWORD,
                    },
                },
            }),
        })
    }

    return result
}
