import React, { FC } from 'react'

import { ModalProps } from '../types'

export const buildModalComponent = <TParams, TResult>(
    Component: FC<ModalProps<TParams, TResult>>,
    params: TParams,
    onCloseRequest: (result: TResult) => void
) => <Component params={params} onCloseRequest={onCloseRequest} />
