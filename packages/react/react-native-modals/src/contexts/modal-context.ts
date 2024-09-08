import { createContext, ReactNode, useContext } from 'react'

import { SharedValue } from 'react-native-reanimated'

export const ModalContext = createContext<{
    key?: symbol
    modals: Record<symbol, ReactNode>
    index?: number
    ghost: boolean
    positionRef?: (value: SharedValue<number>) => void
}>({ modals: {}, ghost: false })

export const ModalProvider = ModalContext.Provider

export const useModal = () => useContext(ModalContext)
