import { z } from 'zod'

const name = 'AuthenticationError'

export const AuthenticationErrorSchema = z.object({}).describe('No authentication data provided or the information is incorrect.').ref(name)

export class AuthenticationError extends Error {
    constructor() {
        super()
        this.name = name
    }
}
