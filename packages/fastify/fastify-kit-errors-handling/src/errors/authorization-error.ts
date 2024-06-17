import { z } from 'zod'

export const AuthorizationErrorSchema = z
    .object({})
    .describe('The request was authenticated, but it lacks the necessary permissions to complete the operation.')
    .ref('AuthorizationError')

export class AuthorizationError extends Error {
    constructor() {
        super()
        this.name = this.constructor.name
    }
}
