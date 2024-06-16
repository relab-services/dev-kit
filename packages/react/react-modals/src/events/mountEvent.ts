import { ReactNode } from 'react'

export class MountEvent extends Event {
    readonly _modals: readonly ReactNode[]

    constructor(modals: ReactNode[]) {
        super('mount')
        this._modals = Object.freeze([...modals])
    }

    get modals() {
        return this._modals
    }
}
