import { ReactNode } from 'react'

import { EventEmitter } from './events/event-emitter'
import { ModalDefinition } from './types'

export class ModalRegistry {
    private readonly _events = new EventEmitter()
    private readonly _modals: Record<symbol, ReactNode> = {}
    private _modalsPublic: Record<symbol, ReactNode> = {}

    get modals(): Record<symbol, ReactNode> {
        return this._modalsPublic
    }

    get events() {
        return this._events
    }

    mount<TParams, TResult>(modal: ReturnType<ModalDefinition<TParams, TResult>>): Promise<TResult> {
        const key = Symbol(Math.round(Math.random() * 10000000000000))

        let resolvePromise: (value: TResult | PromiseLike<TResult>) => void
        const result = new Promise<TResult>(resolve => (resolvePromise = resolve))

        this._modals[key] = modal(result => {
            resolvePromise(result)
            this.unmount(key)
        })
        this.invalidateModalList()

        this._events.emit('mount', Object.values(this._modals))

        return result
    }

    unmount(key: symbol) {
        if (this._modals[key]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._modals[key]
            this.invalidateModalList()

            this._events.emit('unmount', Object.values(this._modals))
        }
    }

    private invalidateModalList() {
        this._modalsPublic = Object.freeze({ ...this._modals })
    }
}
