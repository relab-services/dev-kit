# @relab/react-modals

Utility package to handle modals in React in conjunction with Overmind JS.

It provides effect to show modals - once it called, modal component automatically mounts.

There are params and result for every modal should be defined when creating new modal component.
It allows to have type inference when call `show()` effect - Typescript checks and intellisense benefits are in place.

## Usage

1. `npm install --save @relab/react-modals`
2. Create `@modals` folder

**config.ts**
```typescript
export * from '@/components/modal1'
export * from '@/components/modal2'
export * from '@/components/modal3'
```

**index.ts**
```typescript
import { build } from '@relab/react-modals'

import * as Modules from './config'

export * from './useModalOpen'

export const { ModalContainer, registry, middleware, show } = build(Modules)
```

3. Update `layout.tsx`
```typescript jsx
import { ModalContainer } from '@/modals'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                {children}
                <ModalContainer />
            </body>
        </html>
    )
}
```

4. Update Overmind `config.ts`

```typescript
import { merge, namespaced } from 'overmind/config'

import { middleware as modals } from '@/modals'

import * as module1 from './module1'
import * as module2 from './module1'

export const config = merge(
    namespaced({
        module1,
        module2,
    }),
    modals
)
```

5. Create Modal component
6. Display modal - once `show()` effect is called, it will automatically mount new modal component and display it

### Create Modal Component

**components/modal1/index.ts**
```typescript
export * from './modal1'
```

**components/modal1/modal1.tsx**
```typescript jsx
import { FC } from 'react'
import { ModalProps } from '@relab/react-modals'

type Modal1Params = {
    message: string
    count: number
}

type Modal1Result = boolean | undefined

const Modal1: FC<ModalProps<Modal1Params, Modal1Result>> = ({ params: { message, count }, onCloseRequest }) => {
    // Any dialog component, for example - https://headlessui.com/react/dialog
    return <Dialog>
        {/* Dialog Content here */}
    </Dialog>
}

export { Modal1 }
```

### Show dialog from Actions

**@/state/module1/showModal1Dialog.ts**

```typescript
import { Context } from '@/state'

export const showModal1Dialog = async (
    context: Context,
    payload: {
        message: string
        count: number
    }
) => {
    // All Typescripts check here in place (inferred from modal name)
    const result = await context.effects.modals.show('Modal1', {
        message: 'Test Modal',
        count: 7,
    })
}
```

### Show dialog from Component

```typescript jsx
import { FC } from 'react'

const Component1: FC = () => {
    // Overmind effects
    const effects = useEffects()
    
    return <div>
        <button onClick={async () => {
            const result = await context.effects.modals.show('Modal1', {
                message: 'Test Modal',
                count: 7,
            })
        }}>Show</button>
    </div>
}

export { Component1 }
```

## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
