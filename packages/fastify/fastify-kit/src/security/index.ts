import { OpenAPIV3 } from 'openapi-types'

export const buildSecuritySchema = <T extends string>(
    security: Record<T, OpenAPIV3.SecuritySchemeObject>
): {
    authorize: (...schemas: T[]) => ReadonlyArray<{
        [securityLabel: string]: readonly string[]
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
