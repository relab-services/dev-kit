import { z } from 'zod'

export const generateValidationErrorType = <T extends Record<string, string>>(codes: T) => {
    const ValidationErrorSchema = z
        .object({
            code: z
                .union(
                    Object.entries(codes).map(([code, description]) => z.literal(code).describe(description)) as [z.ZodLiteral<string>, z.ZodLiteral<string>]
                )
                .describe('Validation Error Code')
                .ref('ValidationErrorCode'),
            message: z
                .string()
                .refine(x => x.length > 5)
                .transform(x => x.toUpperCase()),
            fields: z
                .array(
                    z.object({
                        name: z.string(),
                        message: z.string(),
                    })
                )
                .optional(),
        })
        .describe('The data posted to the server is incorrect or malformed.')
        .ref('ValidationError')

    // console.log({ ValidationErrorSchema: ValidationErrorSchema._def.shape() })

    class ValidationError extends Error {
        public readonly code: keyof T
        public readonly fields?: z.infer<typeof ValidationErrorSchema>['fields']

        constructor(
            code: keyof T,
            options?: {
                message?: z.infer<typeof ValidationErrorSchema>['message']
                fields?: z.infer<typeof ValidationErrorSchema>['fields']
            }
        ) {
            super()
            this.name = this.constructor.name
            this.code = code
            this.message = options?.message ?? 'Validation error'
            this.fields = options?.fields
        }
    }

    return { ValidationErrorSchema, ValidationError } as const
}
