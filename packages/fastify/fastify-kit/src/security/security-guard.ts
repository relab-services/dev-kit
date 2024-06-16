export class SecurityGuard extends Map<string, boolean | undefined> {
    define(name: string) {
        if (!this.has(name)) this.set(name, undefined)
        return this
    }

    allow(name: string) {
        this.set(name, true)
        return this
    }

    deny(name: string) {
        this.set(name, false)
        return this
    }

    accessAllowed(): 'allowed' | 'unauthenticated' | 'unauthorized' {
        const values = Array.from(this.values())

        // some of the security guard rejected access
        const denied = values.some(value => value === false)
        if (denied) return 'unauthorized'

        // some of the security guard granted access
        const allowed = values.some(value => value === true)
        if (allowed) return 'allowed'

        // allow access if there are no security guards
        // otherwise - reject
        return values.length === 0 ? 'allowed' : 'unauthenticated'
    }
}
