# @relab/react-native-modals

Utility package to handle modals in React Native.

It provides `show()` function - once it called, modal component automatically mounts.

There are params and result for every modal should be defined when creating new modal component.
It allows to have type inference when call `show()` - Typescript checks and intellisense benefits are in place.

It supports native OS modal as well as bottom sheet modal based on [@gorhom/bottom-sheet](https://www.npmjs.com/package/@gorhom/bottom-sheet).

## Dependencies
- [events](https://www.npmjs.com/package/events)
- [react](https://www.npmjs.com/package/react)
- [react-native](https://www.npmjs.com/package/react-native)
- [react-native-reanimated](https://www.npmjs.com/package/react-native-reanimated)
- [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context)
- [react-native-keyboard-controller](https://www.npmjs.com/package/react-native-keyboard-controller)
- [@gorhom/bottom-sheet](https://www.npmjs.com/package/@gorhom/bottom-sheet)

## Usage

1. `npm install --save @relab/react-native-modals`
2. Create `@modals` folder

**config.ts**
```typescript
export * from '@/components/modal1'
export * from '@/components/modal2'
export * from '@/components/modal3'
```

**index.ts**
```typescript
import { build } from '@relab/react-native-modals'

import * as Modules from './config'

export const { ModalContainer, registry, show } = build(Modules)
```

3. Update `_layout.tsx`
```typescript jsx
import { FC } from 'react'
import { Slot } from 'expo-router'
import Animated from 'react-native-reanimated'

import { useModalContainerPosition } from '@relab/react-native-modals'

const RootLayout: FC = () => {
    const [, ref, modalStyles, nativeModuleShownRef] = useModalContainerPosition()

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Animated.View style={[{ flex: 1, backgroundColor: '#fff'}, modalStyles]}>
                <Slot />
            </Animated.View>
            <ModalContainer positionRef={ref} nativeModalShownRef={nativeModuleShownRef} />
        </View>
    )
}

export default RootLayout
```

4. Create Modal component
5. Display modal - once `show()` is called, it will automatically mount new modal component and display it

### Create Modal Component (bottom sheet)

**components/modal1/index.ts**
```typescript
export * from './modal1'
```

**components/modal1/modal1.tsx**
```typescript jsx
import { FC } from 'react'
import { ModalProps } from '@relab/react-modals'
import { Modal } from '@relab/react-modals/bottom-sheet'

type Modal1Params = {
    accountId: number
}

type Modal1Result = boolean | undefined

const Modal1: FC<ModalProps<Modal1Params, Modal1Result>> = ({ params: { message, count }, onCloseRequest }) => {
    return (
        <Modal onCloseRequest={() => onCloseRequest(false)}>
            <View>
                <Text>Test Alert Modal: {accountId}</Text>
            </View>
        </Modal>
    )
}

export { Modal1 }
```

### Create Modal Component (native)

**components/modal2/index.ts**
```typescript
export * from './modal2'
```

**components/modal2/modal2.tsx**
```typescript jsx
import { FC } from 'react'
import { ModalProps } from '@relab/react-modals'
import { Modal } from '@relab/react-modals/native'

type Modal2Params = {
    accountId: number
}

type Modal2Result = boolean | undefined

const Modal2: FC<ModalProps<Modal2Params, Modal2Result>> = ({ params: { message, count }, onCloseRequest }) => {
    return (
        <Modal onCloseRequest={() => onCloseRequest(false)}>
            <View>
                <Text>Test Alert Modal: {accountId}</Text>
            </View>
        </Modal>
    )
}

export { Modal2 }
```

### Show dialog

```typescript jsx
import { FC } from 'react'
import { show } from '@/modals'

const Page: FC = () => {
    return <div>
        <button onClick={async () => {
            const result = await show('Modal1', {
                accountId: 1,
            })
        }}>Show</button>
    </div>
}

export { Component1 }
```

## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
