import { z, ZodSchema } from 'zod'

export type HttpCode = number

export interface ErrorMappingItem<TErrorClass extends new (...args: any) => Error, TErrorOutputSchema extends ZodSchema<any>> {
    0: TErrorClass
    1: HttpCode
    2: TErrorOutputSchema
    3: (errorInstance: InstanceType<TErrorClass>) => z.infer<TErrorOutputSchema>
}

export type ErrorsMap = ErrorMappingItem<new (...args: any) => Error, ZodSchema<any>>[]
