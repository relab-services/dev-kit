import { ReactNode } from 'react'

export class UnmountEvent extends Event {
    readonly _modals: readonly ReactNode[]

    constructor(modals: ReactNode[]) {
        super('unmount')
        this._modals = Object.freeze([...modals])
    }

    get modals() {
        return this._modals
    }
}
