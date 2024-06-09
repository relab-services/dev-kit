import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import { ZodType } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { Options } from 'zod-to-json-schema/dist/types/Options'

type FreeformRecord = Record<string, any>

const zodToJsonSchemaOptions: (refName?: string) => Partial<Options<'openApi3'>> = refName =>
    ({
        target: 'openApi3',
        $refStrategy: 'none',
        definitionPath: 'components/schemas',
        name: refName,
    }) as const

type ZodSchemaWithRef = ReturnType<typeof zodToJsonSchema> & { '$ref'?: string; 'components/schemas': Record<string, unknown> }

export const zodToJsonSchemaTransform: (skipList: readonly string[]) => NonNullable<FastifyDynamicSwaggerOptions['transform']> =
    skipList =>
    ({ schema, url }) => {
        if (!schema) return { schema, url }

        const { response, headers, querystring, body, params, hide, ...rest } = schema

        const transformed: FreeformRecord = {}

        if (skipList.includes(url) || hide) {
            transformed.hide = true
            return { schema: transformed, url }
        }

        const zodSchemas: FreeformRecord = { headers, querystring, body, params }
        for (const element in zodSchemas) {
            const zodSchema = zodSchemas[element]
            if (zodSchema) {
                const refName = element === 'body' ? zodSchema._def.refName : undefined
                const transformedSchema = zodToJsonSchema(zodSchema, zodToJsonSchemaOptions(refName)) as ZodSchemaWithRef

                const componentRef = transformedSchema['$ref']
                const componentSchema = transformedSchema?.['components/schemas']?.[zodSchema._def.refName]

                transformed[element] = componentRef && componentSchema ? { $ref: componentRef } : transformedSchema
            }
        }

        if (response && typeof response === 'object') {
            transformed.response = {}

            for (const responseCode in response) {
                const zodSchema: unknown = (response as any)[responseCode]

                if (zodSchema && zodSchema instanceof ZodType) {
                    const refName = zodSchema._def.refName
                    const transformedSchema = zodToJsonSchema(zodSchema, zodToJsonSchemaOptions(refName)) as ZodSchemaWithRef

                    const componentRef = transformedSchema['$ref']
                    const componentSchema = zodSchema._def.refName ? transformedSchema?.['components/schemas']?.[zodSchema._def.refName] : undefined

                    transformed.response[responseCode] =
                        componentRef && componentSchema ? { $ref: componentRef, description: zodSchema.description } : transformedSchema
                }
            }
        }

        for (const prop in rest) {
            const meta = rest[prop as keyof typeof rest]
            if (meta) transformed[prop] = meta
        }

        return { schema: transformed, url }
    }
