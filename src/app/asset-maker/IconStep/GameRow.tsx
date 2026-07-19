import { useSgdbIcons } from '@/hooks/useSgdbIcons'
import type { GameConfig, SelectedIcon } from '../page'
import Image from 'next/image'
import { CustomImageUpload } from './CustomImageUpload'
import { cn } from '@/lib/utils'
import type { SGDBImage } from 'steamgriddb'
import { CloudDownload, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

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
    const { icons, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
        useSgdbIcons({ gameId })
    const t = useTranslations('assetMaker.steps.icon')
    const tActions = useTranslations('general.actions')

    const isSelected = (image: SGDBImage) =>
        gameConfig.selectedIcon?.kind === 'sgdb' &&
        gameConfig.selectedIcon.image.id === image.id

    const renderGrid = () => {
        if (isLoading) return null

        return (
            <>
                <CustomImageUpload
                    isSelected={gameConfig.selectedIcon?.kind === 'custom'}
                    onChangeUrl={(url) => {
                        if (!url) {
                            onClearIcon()
                            return
                        }
                        onSelectIcon({ kind: 'custom', url })
                    }}
                    previewUrl={
                        gameConfig.selectedIcon?.kind === 'custom'
                            ? gameConfig.selectedIcon.url
                            : null
                    }
                />
                {icons.map((image) => (
                    <button
                        key={image.id}
                        onClick={() => onSelectIcon({ kind: 'sgdb', image })}
                        className={cn(
                            'hover:ring-primary bg-muted relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg shadow-md ring-2 ring-transparent transition-all duration-300',
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
                ))}
            </>
        )
    }

    return (
        <div className='flex w-full flex-col gap-4 py-6 first:pt-0 last:pb-0 md:flex-row'>
            <div className='flex min-w-0 flex-1 flex-col gap-4'>
                <h1 className='truncate text-2xl font-bold md:text-3xl'>
                    {gameConfig.name}
                </h1>
                <div className='grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8'>
                    {renderGrid()}
                </div>
                {!isLoading ? (
                    <div className='flex items-center justify-center'>
                        {hasNextPage ? (
                            <Button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className='inline-flex w-fit cursor-pointer items-center gap-2'
                            >
                                {isFetchingNextPage ? (
                                    <Spinner />
                                ) : (
                                    <CloudDownload />
                                )}
                                <span className='text-xs font-medium'>
                                    {tActions('loadMore')}
                                </span>
                            </Button>
                        ) : (
                            <div className='text-muted-foreground text-center text-xs'>
                                {icons.length === 0
                                    ? t('noIconsToLoad')
                                    : t('noMoreIcons')}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='inline-flex'>
                        {tActions('loading')}
                        <Spinner />
                    </div>
                )}
            </div>
        </div>
    )
}
