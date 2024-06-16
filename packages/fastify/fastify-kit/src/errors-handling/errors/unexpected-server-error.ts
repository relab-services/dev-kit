import { z } from 'zod'

const name = 'UnexpectedServerError'
export const UnexpectedServerErrorSchema = z
    .object({
        message: z.string(),
    })
    .describe('Indicates that the server encountered an unexpected issue.')
    .ref(name)

export class UnexpectedServerError extends Error {
    constructor(message: z.infer<typeof UnexpectedServerErrorSchema>['message']) {
        super(message)
        this.name = name
    }
}
