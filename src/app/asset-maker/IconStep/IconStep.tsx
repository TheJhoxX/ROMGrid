import type { GameConfig, SelectedIcon } from '../page'
import { GameRow } from './GameRow'

type IconStepProps = {
    selectedGames: Map<number, GameConfig>
    onSelectIcon: (gameId: number, icon: SelectedIcon) => void
    onClearIcon: (gameId: number) => void
}

export const IconStep = ({
    selectedGames,
    onSelectIcon,
    onClearIcon,
}: IconStepProps) => {
    return (
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
            <div className='flex min-h-0 w-full flex-1 flex-col divide-y overflow-y-auto p-4'>
                {[...selectedGames.entries()].map(([gameId, gameConfig]) => (
                    <GameRow
                        key={gameId}
                        gameId={gameId}
                        gameConfig={gameConfig}
                        onSelectIcon={(icon) => onSelectIcon(gameId, icon)}
                        onClearIcon={() => onClearIcon(gameId)}
                    />
                ))}
            </div>
        </div>
    )
}
