import React, { FC } from 'react'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import type { BottomSheetScrollViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types'

import { ModalBase, ModalBaseProps } from './modal-base'

export const ScrollModal: FC<ModalBaseProps & Omit<BottomSheetScrollViewProps, keyof ModalBaseProps>> = (
    { children, closable, handle, onCloseRequest, ...props }
) => (
    <ModalBase closable={closable} handle={handle} onCloseRequest={onCloseRequest}>
        <BottomSheetScrollView {...props}>{children}</BottomSheetScrollView>
    </ModalBase>
)
