import { useState } from 'react'

import { ViewStyle } from 'react-native'
import { interpolate, SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

const baseContainerStyle: ViewStyle = {
    overflow: 'hidden',
}

const DURATION = 200

/**
 * Used to connect bottom sheet modal with app root layout to have slide animation
 */
export const useModalContainerPosition = () => {
    const [position, setPosition] = useState<SharedValue<number> | undefined>(undefined)
    const [nativeModalShown, setNativeModalShown] = useState<boolean>(false)

    const containerStyle: ViewStyle[] = [
        useAnimatedStyle(() => ({
            transform: [
                {
                    scale: !nativeModalShown ? interpolate(position?.value ?? 0, [0, 30, 100], [1, 0.94, 0.94]) : withTiming(1, { duration: DURATION }),
                },
                {
                    translateY: !nativeModalShown ? interpolate(position?.value ?? 0, [0, 100], [0, 34]) : withTiming(0, { duration: DURATION }),
                },
            ],
            borderRadius: interpolate(Math.max(100, !nativeModalShown ? position?.value ?? 0 : 100), [0, 0, 100], [0, 32, 8]),
        })),
        baseContainerStyle,
    ]

    return [position, setPosition, containerStyle, setNativeModalShown] as const
}
