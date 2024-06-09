import { z } from 'zod'

export const DefaultManifestSchema = z.object({
    name: z.string(),
    description: z.string(),
    service: z.string().optional(),
    package: z.object({
        name: z.string(),
        description: z.string().optional(),
        version: z.string(),
    }),
})
