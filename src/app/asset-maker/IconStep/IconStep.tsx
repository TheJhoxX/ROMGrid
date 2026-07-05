import type { GameConfig, SelectedIcon } from '../page'
import { GameRow } from './GameRow'
import { Button } from '@/components/ui/button'
import { ArrowBigRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { AssetMakerStep } from '../types'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

type IconStepProps = {
    selectedGames: Map<number, GameConfig>
    onSelectIcon: (gameId: number, icon: SelectedIcon) => void
    onClearIcon: (gameId: number) => void
    onChangeStep: (nextStep: AssetMakerStep) => void
}

export const IconStep = ({
    selectedGames,
    onSelectIcon,
    onClearIcon,
    onChangeStep,
}: IconStepProps) => {
    const t = useTranslations('assetMaker.steps.icon')
    const allIconsSelected = [...selectedGames.values()].every(
        (g) => g.selectedIcon !== null,
    )

    return (
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
            <div className='flex items-center justify-end gap-4'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Button
                                size='sm'
                                onClick={() => onChangeStep('customize')}
                                className='cursor-pointer gap-1'
                                disabled={!allIconsSelected}
                            >
                                {t('nextButton')}
                                <ArrowBigRight
                                    className='h-4 w-4'
                                    fill='currentColor'
                                />
                            </Button>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>{t('nextButtonTooltip')}</TooltipContent>
                </Tooltip>
            </div>
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
