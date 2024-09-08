import { ReactNode } from 'react'

import { EventEmitter as NodeEventEmitter } from 'events'

class BaseEventEmitter<TEvents extends Record<string, any>> {
    private readonly emitter = new NodeEventEmitter()

    emit<TEventName extends keyof TEvents & string>(eventName: TEventName, ...eventArg: TEvents[TEventName]) {
        this.emitter.emit(eventName, ...(eventArg as []))
    }

    on<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void) {
        this.emitter.on(eventName, handler)
    }

    off<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void) {
        this.emitter.off(eventName, handler)
    }
}

export class EventEmitter extends BaseEventEmitter<{
    mount: [modals: ReactNode[]]
    unmount: [modals: ReactNode[]]
}> {}
