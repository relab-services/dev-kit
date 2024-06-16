import upperFirst from 'lodash/upperFirst'
import { ZodType, ZodTypeDef } from 'zod'

const refsInUse: Set<string> = new Set<string>()

declare module 'zod' {
    interface ZodTypeDef {
        refName?: string
    }

    interface ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
        ref: (name: string) => ZodType<Output, Def, Input>
    }
}

ZodType.prototype.ref = function <Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output>(
    this: ZodType<Output, Def, Input>,
    name: string
): ZodType<Output, Def, Input> {
    const normalizedRefName = upperFirst(
        name
            .trim()
            .replace(/\W+/gi, '_')
            .replace(/_+/gi, '_')
            .replace(/^[_\d]+/gi, '')
    )
    const refKey = normalizedRefName.toLowerCase()

    if (refsInUse.has(refKey)) throw new Error(`Duplicate ref "${normalizedRefName}" (ref key is ${refKey})`)
    refsInUse.add(refKey)

    this._def.refName = normalizedRefName
    return this
}
