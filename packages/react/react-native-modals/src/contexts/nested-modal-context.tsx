import React, { createContext, useContext } from 'react'

const NestedModalContext = createContext<{
    rootModalContainerStopRenderIndex?: React.MutableRefObject<number>
    onRootModalContainerStopRenderIndexChanged?: (index: number) => void
}>({})

export const NestedModalProvider = NestedModalContext.Provider

export const useNestedModal = () => useContext(NestedModalContext)
