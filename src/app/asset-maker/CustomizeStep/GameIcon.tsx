import { Frame } from '@/components/custom/Frame/Frame'
import type { GameConfig, SelectedIcon } from '../page'

function getIconUrl(icon: SelectedIcon): string {
    return icon.kind === 'sgdb' ? icon.image.url.toString() : icon.url
}

type GameIconProps = {
    game: GameConfig
    mode: 'preview' | 'export'
}

export const GameIcon = ({ game, mode }: GameIconProps) => {
    if (!game.selectedIcon) return null
    const { backgroundColor, borderRadius, frameStyle, width } =
        game.iconAdjustment
    const isPreview = mode === 'preview'
    const sizes = isPreview ? '(max-width: 768px) 100vw, 768px' : `${width}px`

    return (
        <Frame
            style={frameStyle}
            icon={{
                src: getIconUrl(game.selectedIcon),
                alt: game.name,
                backgroundColor,
                borderRadius,
                sizes,
                priority: !isPreview,
                loading: isPreview ? 'lazy' : 'eager',
            }}
        />
    )
}
