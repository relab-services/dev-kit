export class HealthCheckError extends Error {
    readonly contentType: string
    constructor(message: string | Record<string, unknown>) {
        super(typeof message === 'object' ? JSON.stringify(message, null, 2) : message)
        this.contentType = typeof message === 'object' ? 'application/json' : 'text/plain'
    }
}
