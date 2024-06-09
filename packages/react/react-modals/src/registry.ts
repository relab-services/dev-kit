import { ReactNode } from 'react'

import { EventEmitter, MountEvent, UnmountEvent } from './events'
import { ModalDefinition } from './types'

export class ModalRegistry {
    private readonly _events: EventEmitter = new EventEmitter()
    private readonly _modals: Record<symbol, ReactNode> = {}
    private _modalsPublic: Record<symbol, ReactNode> = {}

    get modals(): Record<symbol, ReactNode> {
        return this._modalsPublic
    }

    addEventListener<EventName extends 'mount' | 'unmount', EventHandler extends EventName extends 'mount' ? MountEvent : UnmountEvent>(
        event: EventName,
        handler: (e: EventHandler) => void,
        options?: AddEventListenerOptions | boolean
    ) {
        this._events.addEventListener(event, handler as EventListener, options)
    }

    removeEventListener<EventName extends 'mount' | 'unmount', EventHandler extends EventName extends 'mount' ? MountEvent : UnmountEvent>(
        event: EventName,
        handler: (e: EventHandler) => void,
        options?: AddEventListenerOptions | boolean
    ) {
        this._events.removeEventListener(event, handler as EventListener, options)
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

        this._events.dispatchMount(Object.values(this._modals))

        return result
    }

    unmount(key: symbol) {
        if (this._modals[key]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._modals[key]
            this.invalidateModalList()

            this._events.dispatchUnmount(Object.values(this._modals))
        }
    }

    private invalidateModalList() {
        this._modalsPublic = Object.freeze({ ...this._modals })
    }
}
