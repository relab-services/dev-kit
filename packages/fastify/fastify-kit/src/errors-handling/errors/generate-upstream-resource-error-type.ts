import { z } from 'zod'

const name = 'UpstreamResourceError'

export const generateUpstreamResourceErrorType = <T extends Record<string, string>>(resources: T) => {
    const UpstreamResourceErrorSchema = z
        .object({
            resource: z
                .union(
                    Object.entries(resources).map(([resource, description]) => z.literal(resource).describe(description)) as [
                        z.ZodLiteral<string>,
                        z.ZodLiteral<string>,
                    ]
                )
                .ref('UpstreamResourceName'),
            message: z.string(),
        })
        .describe('Indicates that underlying service is currently unavailable.')
        .ref(name)

    class UpstreamResourceError extends Error {
        public readonly resource: keyof T

        constructor(resource: keyof T, message?: z.infer<typeof UpstreamResourceErrorSchema>['message']) {
            super()
            this.name = name
            this.resource = resource
            this.message = message || `Resource unavailable: ${resources[resource] || String(resource)}`
        }
    }

    return { UpstreamResourceErrorSchema, UpstreamResourceError }
}
