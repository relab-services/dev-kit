import { z } from 'zod'

export const AuthenticationErrorSchema = z.object({}).describe('No authentication data provided or the information is incorrect.').ref('AuthenticationError')

export class AuthenticationError extends Error {
    constructor() {
        super()
        this.name = this.constructor.name
    }
}
