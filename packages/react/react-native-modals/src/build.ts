import { FC } from 'react'

import { buildModalComponent, buildModalContainer } from './components'
import { ModalRegistry } from './registry'
import { ModalComponent, ModalDefinition, ModalParams, ModalProps, ModalResult } from './types'

export const build = <Modals extends Record<ModalNames, ModuleComponent>, ModalNames extends string, ModuleComponent extends FC<ModalProps<any, any>>>(
    modules: Modals
) => {
    const registry = new ModalRegistry()

    const getModal = <T extends keyof Modals>(name: T): ModalComponent<Modals[T]> => {
        return modules[name] as ModalComponent<Modals[T]>
    }

    const show = async <
        T extends keyof Modals,
        TParams extends ModalParams<Modals[T]>,
        TResult extends ModalResult<Modals[T]>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _ extends ModalComponent<Modals[T]>
    >(
        name: T,
        params: TParams
    ) => {
        const ModalComponent = getModal(name)
        const modalDefinition: ModalDefinition<TParams, TResult> = params => onCloseRequest => buildModalComponent(ModalComponent, params, onCloseRequest)
        return await registry.mount(modalDefinition(params))
    }

    const ModalContainer = buildModalContainer(registry)

    return {
        registry,
        show,
        ModalContainer,
    }
}
