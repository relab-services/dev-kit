import { FC } from 'react'

import { ModalProps } from './props'

export type ModalParams<T> = T extends FC<infer Props>
    ? Props extends ModalProps<
          infer TParams,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          infer _
      >
        ? TParams
        : never
    : never
