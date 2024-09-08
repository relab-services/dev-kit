import { FC, PropsWithChildren, useEffect } from 'react'

import { useBottomSheetInternal } from '@gorhom/bottom-sheet'
import { interpolate, SharedValue, useDerivedValue } from 'react-native-reanimated'

type ModalContentProps = {
    positionRef?: (value: SharedValue<number>) => void
}

const ModalContent: FC<PropsWithChildren<ModalContentProps>> = ({ children, positionRef }) => {
    const internal = useBottomSheetInternal()
    const animatedPosition = useDerivedValue(() =>
        interpolate(internal.animatedPosition.value, [internal.animatedHighestSnapPoint.value, internal.animatedContainerHeight.value], [100, 0])
    )

    useEffect(() => {
        positionRef?.(animatedPosition)
    }, [animatedPosition, positionRef])

    return children
}

export { ModalContent }
