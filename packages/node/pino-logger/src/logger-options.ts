import { getCorrelationId } from '@relab/fastify-correlation-id'
import { LoggerOptions } from 'pino'
import process from 'process'

export const loggerOptions: LoggerOptions = {
    level: process.env.LOG_LEVEL || 'info',
    mixin: (mergeObject: object, level: number) => {
        const result: Record<string, unknown> = {}

        if ('req' in mergeObject && mergeObject.req && typeof mergeObject.req === 'object') {
            if ('method' in mergeObject.req) result['http_method'] = mergeObject.req.method
            if ('url' in mergeObject.req) result['http_url'] = mergeObject.req.url
            if ('remoteAddress' in mergeObject.req) result['http_client_ip'] = mergeObject.req.remoteAddress

            console.log(mergeObject.req)
        }

        if ('res' in mergeObject && mergeObject.res && typeof mergeObject.res === 'object') {
            if ('statusCode' in mergeObject.res) result['http_response_code'] = mergeObject.res.statusCode
        }

        if ('err' in mergeObject && mergeObject.err instanceof Error) {
            result['error_name'] = mergeObject.err.name
            result['error_message'] = mergeObject.err.message
            result['error_stack'] = mergeObject.err.stack
        }

        if (!result['correlation_id']) {
            result['correlation_id'] = getCorrelationId()
        }

        return result
    },
}
