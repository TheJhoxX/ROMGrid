import Image from 'next/image'
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
    const { backgroundColor, borderRadius, frameStyle } = game.iconAdjustment
    const src = getIconUrl(game.selectedIcon)
    const isPreview = mode === 'preview'

    return (
        <Frame style={frameStyle}>
            <div className='absolute inset-0'>
                <div
                    className='absolute inset-0'
                    style={{ backgroundColor }}
                />
                <Image
                    src={src}
                    alt={game.name}
                    fill
                    priority={!isPreview}
                    loading={isPreview ? 'lazy' : 'eager'}
                    className='object-cover'
                    style={{ borderRadius: `${borderRadius}%` }}
                />
            </div>
        </Frame>
    )
}
