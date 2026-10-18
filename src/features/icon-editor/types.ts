import type { ConsoleFrameStyle } from './frames/types'

export type IconAdjustment = {
    frameStyle: ConsoleFrameStyle
    backgroundColor: string
    borderRadius: number
    width: number
    height: number
    fit: 'cover' | 'contain' | 'fill' | 'scale-down'
}

export type UpdateIconAdjustment = <K extends keyof IconAdjustment>(
    key: K,
    value: IconAdjustment[K],
) => void

export type IconPanelProps = {
    adjustment: IconAdjustment
    onUpdateAdjustment: UpdateIconAdjustment
}
