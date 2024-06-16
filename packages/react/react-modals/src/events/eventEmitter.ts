import { MountEvent } from './mountEvent'
import { UnmountEvent } from './unmountEvent'

export class EventEmitter extends EventTarget {
    dispatchMount(...params: ConstructorParameters<typeof MountEvent>) {
        this.dispatchEvent(new MountEvent(...params))
    }

    dispatchUnmount(...params: ConstructorParameters<typeof UnmountEvent>) {
        this.dispatchEvent(new UnmountEvent(...params))
    }
}
