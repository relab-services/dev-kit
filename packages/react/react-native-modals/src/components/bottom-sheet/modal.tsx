import React, { FC } from 'react'

import { BottomSheetView } from '@gorhom/bottom-sheet'
import type { BottomSheetViewProps } from '@gorhom/bottom-sheet/src/components/bottomSheetView/types'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useModal } from '../../contexts/modal-context'
import { useAnimatedKeyboard } from '../../hooks/use-animated-keyboard'
import { ModalBase } from './modal-base'
import type { ModalBaseProps } from './modal-base'

export const Modal: FC<ModalBaseProps & Omit<BottomSheetViewProps, keyof ModalBaseProps>> = ({ children, closable, handle, onCloseRequest, ...props }) => {
    const { ghost, index } = useModal()
    if (index === undefined) throw new Error('The native modal must be closed before the bottom sheet modal can be displayed')

    const insets = useSafeAreaInsets()
    const [height] = useAnimatedKeyboard()
    const styles = useAnimatedStyle(() => ({
        paddingBottom: !ghost ? insets.bottom + height.value : 0,
    }))

    return (
        <ModalBase closable={closable} handle={handle} onCloseRequest={onCloseRequest}>
            <BottomSheetView {...props}>
                <Animated.View style={[styles]}>{children}</Animated.View>
            </BottomSheetView>
        </ModalBase>
    )
}
