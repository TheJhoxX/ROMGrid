import { NoneFrame } from './frames/none/NoneFrame'
import { ThreeDSFrame } from './frames/3ds/ThreeDSFrame'
import { DSIFrame } from './frames/dsi/DSIFrame'
import type { ConsoleFrameStyle, FrameDefinition, FrameIcon } from './types'

export { CONSOLE_FRAME_STYLES } from './types'
export type {
    ConsoleFrameStyle,
    FrameComponent,
    FrameDefinition,
    FrameIcon,
} from './types'

export const FRAMES: Record<ConsoleFrameStyle, FrameDefinition> = {
    none: { Component: NoneFrame },
    '3ds': { Component: ThreeDSFrame },
    dsi: { Component: DSIFrame },
}

export type FrameProps = {
    style: ConsoleFrameStyle
    icon: FrameIcon
}

export const Frame = ({ style, icon }: FrameProps) => {
    const { Component } = FRAMES[style]
    return <Component icon={icon} />
}
