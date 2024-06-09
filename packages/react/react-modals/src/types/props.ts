export type ModalProps<TParams, TResult> = {
    params: TParams
    onCloseRequest: (result: TResult) => void
}
