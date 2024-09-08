import React, { FC, PropsWithChildren, ReactNode, useEffect, useRef } from 'react'

import { BottomSheetBackdrop, BottomSheetHandleProps, BottomSheetModal as CoreBottomSheetModal, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet'
import { BackHandler, Dimensions, Text } from 'react-native'

import { useAnimatedKeyboard } from '../../hooks/use-animated-keyboard'
import { useModal } from '../../contexts/modal-context'
import { useNestedModal } from '../../contexts/nested-modal-context'
import { ModalContent } from '../modal-content'

export type ModalBaseProps = PropsWithChildren<{
    closable?: boolean
    handle?: ReactNode
    onCloseRequest?: () => void | Promise<void>
}>

export const ModalBase: FC<ModalBaseProps> = ({ children, closable = true, handle, onCloseRequest }) => {
    const { key, index, positionRef } = useModal()
    const { rootModalContainerStopRenderIndex } = useNestedModal()

    const ref = useRef<CoreBottomSheetModal>(null)
    useEffect(() => {
        const modal = ref.current
        modal?.present()
        return () => modal?.close()
    }, [ref])

    const [, keyboardAnimating] = useAnimatedKeyboard()
    const disabledAnimation = useBottomSheetTimingConfigs({ duration: 0 })

    useEffect(() => {
        const handler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (closable) void onCloseRequest?.()
            return true
        })

        return () => handler.remove()
    }, [closable, onCloseRequest])

    console.log({ handle })
    return (
        <CoreBottomSheetModal
            ref={ref}
            stackBehavior="push"
            index={0}
            enablePanDownToClose={closable}
            style={{
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                overflow: 'hidden',
            }}
            animationConfigs={keyboardAnimating ? disabledAnimation : undefined}
            backdropComponent={props => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    opacity={rootModalContainerStopRenderIndex?.current !== -1 ? 0 : index === 0 ? 0.7 : 0.4}
                    pressBehavior="none"
                />
            )}
            handleComponent={
                () => <>{handle}</> ?? EmptyHandle
            }
            enableDynamicSizing={true}
            maxDynamicContentSize={Dimensions.get('window').height * 0.92}
            footerComponent={() => <Text>Footer</Text>}
            onAnimate={(_, toIndex: number) => {
                if (toIndex === -1 && key) void onCloseRequest?.()
            }}
        >
            <ModalContent positionRef={positionRef}>{children}</ModalContent>
        </CoreBottomSheetModal>
    )
}

const EmptyHandle: FC<BottomSheetHandleProps> = () => undefined
