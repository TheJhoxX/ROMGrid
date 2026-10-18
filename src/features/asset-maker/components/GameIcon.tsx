import { IconArtwork } from '@/features/icon-editor/IconArtwork'
import { getIconUrl } from '../getIconUrl'
import type { GameConfig } from '../types'

export const GameIcon = ({
    game,
    mode,
}: {
    game: GameConfig
    mode: 'preview' | 'export'
}) => {
    if (!game.selectedIcon) return null
    return (
        <IconArtwork
            src={getIconUrl(game.selectedIcon)}
            alt={game.name}
            adjustment={game.iconAdjustment}
            mode={mode}
        />
    )
}
