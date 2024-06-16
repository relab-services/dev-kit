import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import type { ReferenceConfiguration } from '@scalar/api-reference'
import { ZodType } from 'zod'

export type OpenApiPluginOptions = FastifyDynamicSwaggerOptions['openapi'] & {
    jsonSchemaPath?: string
    ui?: {
        path: string
        subPath?: string
        configuration?: ReferenceConfiguration
    }
    subPath?: string
    customResponses?: Record<number, ZodType>
}
