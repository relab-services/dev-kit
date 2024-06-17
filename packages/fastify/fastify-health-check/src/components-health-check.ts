import { HealthCheck } from './health-check'
import { HealthCheckError } from './health-check-error'
import { Promisify } from './promisify'

export class ComponentsHealthCheck<T extends string> implements HealthCheck {
    private readonly _url: string
    private readonly _components: Record<T, boolean>

    constructor(url: string, components: readonly T[]) {
        this._url = url
        this._components = components.reduce<Record<T, boolean>>((result, current) => ({ ...result, [current]: false }), {} as Record<T, boolean>) // eslint-disable-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/consistent-type-assertions
    }

    public get url(): string {
        return this._url
    }

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    public get check(): () => Promisify<Record<string, unknown> | string | void> {
        return () => {
            const unhealthy = Object.values(this._components).some(healthy => !healthy)
            const result = Object.entries(this._components).reduce<Record<T[number], 'Healthy' | 'Unhealthy'>>(
                (result, current) => ({
                    ...result,
                    [current[0]]: current[1] ? 'Healthy' : 'Unhealthy',
                }),
                {} as Record<T[number], 'Healthy' | 'Unhealthy'> // eslint-disable-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/consistent-type-assertions
            )

            if (unhealthy) throw new HealthCheckError(result)
            else return result
        }
    }

    setHealthy(component: T) {
        this._components[component] = true
    }

    setUnhealthy(component: T) {
        this._components[component] = false
    }
}
