import { useAssetMaker } from '../../AssetMakerContext'
import { GameRow } from './GameRow'

export const IconStep = () => {
    const { selectedGames } = useAssetMaker()
    return (
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
            <div className='flex min-h-0 w-full flex-1 flex-col divide-y overflow-y-auto p-4'>
                {[...selectedGames.keys()].map((gameId) => (
                    <GameRow
                        key={gameId}
                        gameId={gameId}
                    />
                ))}
            </div>
        </div>
    )
}
