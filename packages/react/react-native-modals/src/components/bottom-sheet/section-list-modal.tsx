import React from 'react'

import { BottomSheetSectionList } from '@gorhom/bottom-sheet'
import type { BottomSheetSectionListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types'

import { ModalBase, ModalBaseProps } from './modal-base'

export const SectionListModal = <ItemT, SectionT>(
    { children, closable, handle, onCloseRequest, ...props }: ModalBaseProps & Omit<BottomSheetSectionListProps<ItemT, SectionT>, keyof ModalBaseProps>
) => (
    <ModalBase closable={closable} handle={handle} onCloseRequest={onCloseRequest}>
        <BottomSheetSectionList {...props}>{children}</BottomSheetSectionList>
    </ModalBase>
)
