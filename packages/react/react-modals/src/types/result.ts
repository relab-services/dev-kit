import { FC } from 'react'

import { ModalProps } from './props'

export type ModalResult<T> = T extends FC<infer Props>
    ? Props extends ModalProps<
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          infer _,
          infer TResult
      >
        ? TResult
        : never
    : never
