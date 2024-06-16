import { ReactNode } from 'react'

export type ModalDefinition<TParams, TResult> = (params: TParams) => (onCloseRequest: (result: TResult) => void) => ReactNode
