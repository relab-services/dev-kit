import { z } from 'zod'

const name = 'AuthorizationError'

export const AuthorizationErrorSchema = z
    .object({})
    .describe('The request was authenticated, but it lacks the necessary permissions to complete the operation.')
    .ref(name)

export class AuthorizationError extends Error {
    constructor() {
        super()
        this.name = name
    }
}
