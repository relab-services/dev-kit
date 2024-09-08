import { useCallback, useState } from 'react'

import { NativeEvent, useKeyboardHandler } from 'react-native-keyboard-controller'
import { runOnJS, useSharedValue } from 'react-native-reanimated'

export const useAnimatedKeyboard = () => {
    const height = useSharedValue<number>(0)
    const duration = useSharedValue<number>(0)
    const progress = useSharedValue<number>(0)

    const [animating, setAnimating] = useState<boolean>(false)

    const moveHandler = useCallback(
        (e: NativeEvent) => {
            'worklet'
            height.value = e.height
            duration.value = e.duration
            progress.value = e.progress
        },
        [height, duration, progress]
    )

    const animateStart = useCallback(() => setAnimating(true), [setAnimating])
    const animateEnd = useCallback(() => setAnimating(true), [setAnimating])

    const startHandler = useCallback(() => {
        'worklet'
        runOnJS(animateStart)()
    }, [animateStart])
    const endHandler = useCallback(() => {
        'worklet'
        runOnJS(animateEnd)()
    }, [animateEnd])

    useKeyboardHandler({
        onStart: startHandler,
        onMove: moveHandler,
        onEnd: endHandler,
    })

    return [height, animating, duration, progress] as const
}
