import { useSgdbIcons } from '@/hooks/useSgdbIcons'
import type { GameConfig, SelectedIcon } from '../page'
import Image from 'next/image'
import { CustomImageUpload } from './CustomImageUpload'
import { GridPickerDialog } from './GridPickerDialog'
import { cn } from '@/lib/utils'
import type { SGDBImage } from 'steamgriddb'
import { ImageOff, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type GameRowProps = {
    gameId: number
    gameConfig: GameConfig
    onSelectIcon: (icon: SelectedIcon) => void
    onClearIcon: () => void
}

export const GameRow = ({
    gameId,
    gameConfig,
    onSelectIcon,
    onClearIcon,
}: GameRowProps) => {
    const { icons, isLoading } = useSgdbIcons({ gameId })
    const t = useTranslations('assetMaker.steps.icon')

    const isSelected = (image: SGDBImage) =>
        gameConfig.selectedIcon?.kind === 'sgdb' &&
        gameConfig.selectedIcon.image.id === image.id

    const selectedSgdbIcon =
        gameConfig.selectedIcon?.kind === 'sgdb'
            ? gameConfig.selectedIcon.image
            : null

    const renderGrid = () => {
        if (isLoading) return null
        if (icons.length === 0)
            return (
                <div className='text-muted-foreground-accent bg-muted col-span-2 flex flex-col items-center justify-center gap-2 rounded-lg py-6 md:col-span-4'>
                    <ImageOff
                        size={32}
                        strokeWidth={1.5}
                    />
                    <p className='text-sm'>{t('noIconsAvailable')}</p>
                </div>
            )
        return icons.slice(0, 4).map((image) => (
            <button
                key={image.id}
                onClick={() => onSelectIcon({ kind: 'sgdb', image })}
                className={cn(
                    'checkerboard relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg shadow-md ring-2 ring-transparent transition-all',
                    isSelected(image) && 'ring-primary shadow-primary',
                )}
            >
                <Image
                    src={image.url.toString()}
                    alt={gameConfig.name}
                    fill
                    className='object-cover'
                />
            </button>
        ))
    }

    return (
        <div className='flex w-full flex-col gap-4 py-6 first:pt-0 last:pb-0 md:flex-row'>
            {/* Left column: 1/3 width on md+, full width on mobile */}
            <div className='w-full shrink-0 md:w-1/3'>
                {selectedSgdbIcon ? (
                    <div className='checkerboard relative aspect-square w-full overflow-hidden rounded-lg shadow-md'>
                        <Image
                            src={selectedSgdbIcon.url.toString()}
                            alt={gameConfig.name}
                            fill
                            className='object-cover'
                        />
                        <button
                            onClick={onClearIcon}
                            className='bg-background/80 hover:bg-foreground/80 hover:text-background/80 absolute top-2 right-2 z-10 rounded-full p-1 transition-colors duration-200'
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <CustomImageUpload
                        isSelected={gameConfig.selectedIcon?.kind === 'custom'}
                        onSelect={(url) =>
                            onSelectIcon({ kind: 'custom', url })
                        }
                    />
                )}
            </div>

            {/* Right column: title, browse button, icon grid, clear */}
            <div className='flex min-w-0 flex-1 flex-col gap-2'>
                <div className='flex items-center justify-between'>
                    <h1 className='truncate text-2xl font-bold md:text-3xl'>
                        {gameConfig.name}
                    </h1>
                    <GridPickerDialog
                        gameId={gameId}
                        gameConfig={gameConfig}
                        onSelectIcon={onSelectIcon}
                    />
                </div>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                    {renderGrid()}
                </div>
            </div>
        </div>
    )
}
