import React from 'react'

import { BottomSheetVirtualizedList } from '@gorhom/bottom-sheet'
import type { BottomSheetVirtualizedListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types'

import { ModalBase, ModalBaseProps } from './modal-base'

export const VirtualizedListModal = <T,>(
    { children, closable, handle, onCloseRequest, ...props }: ModalBaseProps & Omit<BottomSheetVirtualizedListProps<T>, keyof ModalBaseProps>
) => (
    <ModalBase closable={closable} handle={handle} onCloseRequest={onCloseRequest}>
        <BottomSheetVirtualizedList {...props}>{children}</BottomSheetVirtualizedList>
    </ModalBase>
)
