import { useState } from 'react'
import { cn } from '@/lib/utils'
import { IconEditor } from '@/features/icon-editor/IconEditor'
import { useAssetMaker } from '../../AssetMakerContext'
import { getIconUrl } from '../../getIconUrl'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

export const CustomizeStep = () => {
    const { selectedGames, handleUpdateIconAdjustment } = useAssetMaker()
    const [selectedGameId, setSelectedGameId] = useState<number | undefined>(
        () => selectedGames.keys().next().value,
    )
    const currentGameId =
        selectedGameId !== undefined && selectedGames.has(selectedGameId)
            ? selectedGameId
            : selectedGames.keys().next().value
    const currentGame =
        currentGameId !== undefined
            ? selectedGames.get(currentGameId)
            : undefined

    return (
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
            <div className='flex w-full shrink-0 items-center gap-4 overflow-x-auto p-2'>
                {[...selectedGames.entries()].map(
                    ([gameId, game]) =>
                        game.selectedIcon && (
                            <IconPreview
                                key={gameId}
                                src={getIconUrl(game.selectedIcon)}
                                name={game.name}
                                isSelected={currentGameId === gameId}
                                gameId={gameId}
                                onPreviewClick={setSelectedGameId}
                            />
                        ),
                )}
            </div>
            {currentGame?.selectedIcon && currentGameId !== undefined && (
                <IconEditor
                    src={getIconUrl(currentGame.selectedIcon)}
                    alt={currentGame.name}
                    adjustment={currentGame.iconAdjustment}
                    onUpdateAdjustment={(key, value) =>
                        handleUpdateIconAdjustment(currentGameId, key, value)
                    }
                />
            )}
        </div>
    )
}

const IconPreview = ({
    src,
    name,
    isSelected,
    gameId,
    onPreviewClick,
}: {
    src: string
    name: string
    isSelected: boolean
    gameId: number
    onPreviewClick: (gameId: number) => void
}) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={() => onPreviewClick(gameId)}
                    className={cn(
                        'bg-muted h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-md ring-2 ring-transparent transition-colors duration-200 md:h-24 md:w-24 lg:h-32 lg:w-32',
                        isSelected && 'ring-primary',
                    )}
                >
                    <img
                        src={src}
                        alt={name}
                        className='h-full w-full object-cover'
                    />
                </button>
            </TooltipTrigger>
            <TooltipContent>{name}</TooltipContent>
        </Tooltip>
    )
}
