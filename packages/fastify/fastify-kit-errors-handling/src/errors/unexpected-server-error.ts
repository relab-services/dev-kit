import { z } from 'zod'

export const UnexpectedServerErrorSchema = z
    .object({
        message: z.string(),
    })
    .describe('Indicates that the server encountered an unexpected issue.')
    .ref('UnexpectedServerError')

export class UnexpectedServerError extends Error {
    constructor(message: z.infer<typeof UnexpectedServerErrorSchema>['message']) {
        super(message)
        this.name = this.constructor.name
    }
}
