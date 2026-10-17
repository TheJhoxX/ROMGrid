import type { RefObject } from 'react'
import type { GameConfig } from '../types'
import { GameIcon } from './GameIcon'

export const ExportIcons = ({
    selectedGames,
    exportNodes,
}: {
    selectedGames: Map<number, GameConfig>
    exportNodes: RefObject<Map<number, HTMLDivElement>>
}) => (
    <div
        aria-hidden
        style={{
            position: 'fixed',
            left: '-99999px',
            top: 0,
            pointerEvents: 'none',
        }}
    >
        {[...selectedGames.entries()].map(([gameId, game]) => {
            if (!game.selectedIcon) return null
            const { width, height } = game.iconAdjustment
            return (
                <div
                    key={gameId}
                    ref={(el) => {
                        if (el) exportNodes.current.set(gameId, el)
                        else exportNodes.current.delete(gameId)
                    }}
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <GameIcon
                        game={game}
                        mode='export'
                    />
                </div>
            )
        })}
    </div>
)
