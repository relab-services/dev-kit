import React, { FC, useCallback, useEffect, useRef, useState } from 'react'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { SharedValue } from 'react-native-reanimated'

import { ModalProvider } from '../contexts/modal-context'
import { NestedModalProvider } from '../contexts/nested-modal-context'
import { ModalRegistry } from '../registry'

type ModalContainerProps = {
    registry: ModalRegistry
    positionRef?: (value: SharedValue<number>) => void
    nativeModuleShownRef: (value: boolean) => void
}
const ModalContainer: FC<ModalContainerProps> = ({ registry, positionRef, nativeModuleShownRef }) => {
    const [, invalidateState] = useState<number>(0)
    const modals = registry.modals

    useEffect(() => {
        const handler = () => invalidateState(Math.random())

        registry.events.on('mount', handler)
        registry.events.on('unmount', handler)

        return () => {
            registry.events.off('mount', handler)
            registry.events.off('unmount', handler)
        }
    }, [registry, invalidateState])

    const rootModalContainerStopRenderIndex = useRef<number>(-1)
    const onRootModalContainerStopRenderIndexChanged = useCallback(
        () => nativeModuleShownRef?.(rootModalContainerStopRenderIndex && rootModalContainerStopRenderIndex.current >= 0),
        [nativeModuleShownRef]
    )

    return (
        <NestedModalProvider value={{ rootModalContainerStopRenderIndex, onRootModalContainerStopRenderIndexChanged }}>
            <BottomSheetModalProvider>
                {Object.getOwnPropertySymbols(modals).map((key, index, items) => {
                    const nestedRenderingMode =
                        rootModalContainerStopRenderIndex && rootModalContainerStopRenderIndex.current >= 0 && index > rootModalContainerStopRenderIndex.current

                    // Do not render any further components in case of nested rendering mode was enabled
                    // i.e. `<Modal>..<Modal></Modal></Modal>
                    if (nestedRenderingMode) return undefined

                    return (
                        <ModalProvider
                            key={key.description}
                            value={{
                                key,
                                modals: items.slice(index + 1).reduce(
                                    (result, key) => ({
                                        ...result,
                                        [key]: modals[key],
                                    }),
                                    {}
                                ),
                                index,
                                ghost: items.length > 1 && index < items.length - 1,
                                positionRef: index === 0 ? positionRef : undefined,
                            }}
                        >
                            {modals[key]}
                        </ModalProvider>
                    )
                })}
            </BottomSheetModalProvider>
        </NestedModalProvider>
    )
}

const buildModalContainer: (registry: ModalRegistry) => FC<{
    positionRef?: (value: SharedValue<number>) => void
    nativeModalShownRef: (value: boolean) => void
}> =
    // prettier-ignore
    registry => ({ positionRef, nativeModalShownRef }) => { // eslint-disable-line react/display-name
        return <ModalContainer registry={registry} positionRef={positionRef} nativeModuleShownRef={nativeModalShownRef} />
    }

export { ModalContainer, buildModalContainer }
