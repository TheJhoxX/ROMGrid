import { Frame } from '@/features/icon-editor/frames/Frame'
import type { IconAdjustment } from './types'

type IconArtworkProps = {
    src: string
    alt: string
    adjustment: IconAdjustment
    mode: 'preview' | 'export'
}

export const IconArtwork = ({
    src,
    alt,
    adjustment,
    mode,
}: IconArtworkProps) => {
    const { backgroundColor, borderRadius, frameStyle, width } = adjustment
    const isPreview = mode === 'preview'
    const sizes = isPreview ? '(max-width: 768px) 100vw, 768px' : `${width}px`

    return (
        <Frame
            style={frameStyle}
            icon={{
                src,
                alt,
                backgroundColor,
                borderRadius,
                sizes,
                priority: !isPreview,
                loading: isPreview ? 'lazy' : 'eager',
            }}
        />
    )
}
