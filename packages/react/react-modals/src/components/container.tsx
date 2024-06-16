'use client'

import React, { FC, Fragment, useEffect, useState } from 'react'

import { ModalRegistry } from '../registry'

type ModalContainerProps = {
    registry: ModalRegistry
}
const ModalContainer: FC<ModalContainerProps> = ({ registry }) => {
    const [, invalidateState] = useState<number>(0)
    const modals = registry.modals

    useEffect(() => {
        const handler = () => invalidateState(Math.random())

        registry.addEventListener('mount', handler)
        registry.addEventListener('unmount', handler)

        return () => {
            registry.removeEventListener('mount', handler)
            registry.removeEventListener('unmount', handler)
        }
    }, [registry, invalidateState])

    return Object.getOwnPropertySymbols(modals).map(key => <Fragment key={key.description}>{modals[key]}</Fragment>)
}

const buildModalContainer: (registry: ModalRegistry) => FC = registry => () => {
    return <ModalContainer registry={registry} />
}

export { ModalContainer, buildModalContainer }
