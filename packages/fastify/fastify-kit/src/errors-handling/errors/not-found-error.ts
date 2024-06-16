import { z } from 'zod'

const name = 'NotFoundError'

export const NotFoundErrorSchema = z
    .object({
        resource: z.string().optional().describe('Resource URL'),
        message: z.string().optional(),
    })
    .describe('Resource not found.')
    .ref(name)

export class NotFoundError extends Error {
    public readonly resource?: string

    constructor(options?: { resource: string; message?: string }) {
        super(options?.message)
        this.name = name
        this.resource = options?.resource
    }
}
