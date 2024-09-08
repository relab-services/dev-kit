import { FC } from 'react'

import { ModalProps } from './props'

export type ModalComponent<T> = T extends FC<infer Props>
    ? Props extends ModalProps<infer TParams, infer TResult>
        ? FC<ModalProps<TParams, TResult>>
        : never
    : never
