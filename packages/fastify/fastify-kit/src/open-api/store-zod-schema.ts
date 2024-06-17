import { ZodType, ZodTypeDef } from 'zod'
import { ignoreOverride, type Options, parseDef, zodToJsonSchema } from 'zod-to-json-schema'

import '../ref'

const zodToJsonSchemaOptions: Partial<Options<'openApi3'>> = {
    target: 'openApi3',
    $refStrategy: 'none',
    strictUnions: true,
} as const

export const storeZodSchema = (schemas: Map<string, unknown>, data: unknown) => {
    if (data && data instanceof ZodType && data._def.refName) {
        const transformedSchema = {
            $id: data._def.refName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            ...zodToJsonSchema(data, {
                ...zodToJsonSchemaOptions,
                override: (def, refs, seen, forceResolution) => {
                    const unwrapOptional = (def: ZodTypeDef) => {
                        let currentDef = def
                        while ('innerType' in currentDef && currentDef.innerType instanceof ZodType) {
                            if (!currentDef.innerType._def) break

                            currentDef = currentDef.innerType._def
                        }

                        return currentDef
                    }

                    const unwrappedDef = unwrapOptional(def)

                    if (refs.currentPath.length > 2) {
                        if (unwrappedDef.refName) {
                            const { override, ...innerRefs } = refs
                            const subSchema = parseDef(unwrappedDef, innerRefs, forceResolution)

                            if (subSchema) {
                                schemas.set(unwrappedDef.refName, {
                                    $id: `${unwrappedDef.refName}`,
                                    ...subSchema,
                                })
                            }

                            return {
                                $ref: `#/components/schemas/${unwrappedDef.refName}`,
                                description: unwrappedDef.description,
                            }
                        }
                    }

                    return ignoreOverride
                },
            }),
        }

        schemas.set(data._def.refName, transformedSchema) // eslint-disable-line @typescript-eslint/no-unsafe-argument
    }
}
