import { z } from 'zod'

const name = 'ApplicationError'

export const generateApplicationErrorType = <T extends Record<string, string>>(codes: T) => {
    const ApplicationErrorSchema = z
        .object({
            code: z
                .union(
                    Object.entries(codes).map(([code, description]) => z.literal(code).describe(description)) as [z.ZodLiteral<string>, z.ZodLiteral<string>]
                )
                .describe('Application Error Code')
                .ref('ApplicationErrorCode'),
            message: z.string(),
        })
        .describe('The operation could not be completed due to application logic.')
        .ref(name)

    class ApplicationError extends Error {
        public readonly code: keyof T

        constructor(code: keyof T, message: z.infer<typeof ApplicationErrorSchema>['message']) {
            super()
            this.name = name
            this.code = code
            this.message = message
        }
    }

    return { ApplicationErrorSchema, ApplicationError }
}
