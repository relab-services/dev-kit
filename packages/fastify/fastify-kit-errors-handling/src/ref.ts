import { ZodType, ZodTypeDef } from 'zod'

declare module 'zod' {
    interface ZodTypeDef {
        refName?: string
    }

    interface ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
        ref: (name: string) => ZodType<Output, Def, Input>
    }
}
