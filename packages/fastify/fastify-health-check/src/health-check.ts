import { Promisify } from './promisify'

export type HealthCheck = {
    url: string
    check: () => Promisify<Record<string, unknown> | string | void> // eslint-disable-line @typescript-eslint/no-invalid-void-type
}
