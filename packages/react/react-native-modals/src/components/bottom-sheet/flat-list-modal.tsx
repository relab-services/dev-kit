import React from 'react'

import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import type { BottomSheetFlatListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types'

import { ModalBase, ModalBaseProps } from './modal-base'

export const FlatListModal = <T,>(
    { children, closable, handle, onCloseRequest, ...props }: ModalBaseProps & Omit<BottomSheetFlatListProps<T>, keyof ModalBaseProps>
) => (
    <ModalBase closable={closable} handle={handle} onCloseRequest={onCloseRequest}>
        <BottomSheetFlatList {...props}>{children}</BottomSheetFlatList>
    </ModalBase>
)
