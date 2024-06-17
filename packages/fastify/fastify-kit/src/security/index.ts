import { OpenAPIV3 } from 'openapi-types'

export const buildSecuritySchema = <T extends string>(
    security: Record<T, OpenAPIV3.SecuritySchemeObject>
): {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/array-type
    authorize: (...schemas: T[]) => ReadonlyArray<{
        [securityLabel: string]: readonly string[] // eslint-disable-line @typescript-eslint/consistent-indexed-object-style
    }>
    schema: Record<T, OpenAPIV3.SecuritySchemeObject>
} => {
    return {
        authorize: (...schemas: T[]) => schemas.map(schema => ({ [schema]: [] })),
        schema: security,
    }
}

export * from './security-guard'
export * from './security-guards'
