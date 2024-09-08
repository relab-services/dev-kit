import React, { FC, PropsWithChildren, useEffect } from 'react'

import { Modal as CoreModal, Platform } from 'react-native'

import { ModalProvider, useModal } from '../../contexts/modal-context'
import { useNestedModal } from '../../contexts/nested-modal-context'

type ModalProps = PropsWithChildren<{
    closable?: boolean
    androidHideStatusBar?: boolean
    onCloseRequest?: () => void | Promise<void>
}>

export const Modal: FC<ModalProps> = ({ children, closable = true, androidHideStatusBar = false, onCloseRequest }) => {
    const { modals, modalCount, nestedModalKey, restNestedModals } = useNativeModal()

    return (
        <CoreModal
            visible={true}
            animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
            presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : undefined}
            hardwareAccelerated={true}
            statusBarTranslucent={androidHideStatusBar}
            onRequestClose={closable ? async () => await onCloseRequest?.() : undefined}
        >
            {children}

            {nestedModalKey && (
                <ModalProvider
                    key={nestedModalKey.description}
                    value={{
                        key: nestedModalKey,
                        modals: restNestedModals.reduce((result, key) => ({ ...result, [key]: modals[key] }), {}),
                        ghost: modalCount > 1,
                    }}
                >
                    {modals[nestedModalKey]}
                </ModalProvider>
            )}
        </CoreModal>
    )
}

const useNativeModal = () => {
    const { index, modals } = useModal()
    const { rootModalContainerStopRenderIndex, onRootModalContainerStopRenderIndexChanged } = useNestedModal()

    // Prevent rendering modals in parent container since we need nested rendering for native modals
    if (rootModalContainerStopRenderIndex && index) {
        if (rootModalContainerStopRenderIndex.current < 0) {
            rootModalContainerStopRenderIndex.current = index
            setImmediate(() => onRootModalContainerStopRenderIndexChanged?.(index))
        }
    }

    // Once modal unmounted clear the index
    useEffect(
        () => () => {
            if (rootModalContainerStopRenderIndex && rootModalContainerStopRenderIndex.current === index) {
                rootModalContainerStopRenderIndex.current = -1
                onRootModalContainerStopRenderIndexChanged?.(-1)
            }
        },
        [onRootModalContainerStopRenderIndexChanged, rootModalContainerStopRenderIndex, index]
    )

    // All modals keys
    const modalsKeys = Object.getOwnPropertySymbols(modals)

    // Nested modal(s) to render
    const [nestedModalKey, ...restNestedModals] = modalsKeys

    return { modals, modalCount: modalsKeys.length, nestedModalKey, restNestedModals }
}
