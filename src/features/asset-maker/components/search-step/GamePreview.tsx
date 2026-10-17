import type { SGDBGameWithCover } from '@/lib/sgdb/types'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { BadgeCheck, Calendar, ImageOff } from 'lucide-react'
import Image from 'next/image'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useTranslations } from 'next-intl'
import { useAssetMaker } from '../../AssetMakerContext'

type GamePreviewProps = {
    game: SGDBGameWithCover
}

export const GamePreview = ({ game }: GamePreviewProps) => {
    const { selectedGames, handleFirstStepGameClick } = useAssetMaker()
    const isGameSelected = selectedGames.has(game.id)
    const t = useTranslations('assetMaker.steps.search')
    const { isAtLeastMd } = useBreakpoint()

    const coverImage = game.cover ? (
        <Image
            src={game.cover.thumb.toString()}
            alt={game.name + ' thumb'}
            fill
            sizes='(max-width: 768px) 80px, (max-width: 1024px) 33vw, 25vw'
            className='object-cover'
        />
    ) : (
        <div className='text-primary bg-primary/30 ring-primary flex h-full items-center justify-center rounded-lg border'>
            <ImageOff />
        </div>
    )

    if (!isAtLeastMd) {
        return (
            <button
                onClick={() => handleFirstStepGameClick(game.id, game.name)}
                className='h-full w-full cursor-pointer text-left'
            >
                <Item
                    className={cn(
                        'h-full w-full gap-0 p-0 shadow-md ring-2 ring-transparent transition-all duration-300',
                        isGameSelected && 'ring-primary shadow-primary',
                    )}
                    variant='outline'
                >
                    <div className='relative m-2 h-20 w-20 shrink-0 overflow-hidden rounded-lg'>
                        {coverImage}
                    </div>
                    <div className='flex flex-1 flex-col gap-1.5 p-3'>
                        <p className='line-clamp-2 text-sm leading-snug font-medium'>
                            {game.name}
                        </p>
                        <div className='text-muted-foreground flex items-center justify-between gap-1 text-xs'>
                            <span className='inline-flex items-center gap-1'>
                                <Calendar className='h-3 w-3' />
                                {game.releaseDateString ??
                                    t('releaseDateNotAvailable')}
                            </span>
                            <BadgeCheck
                                className='text-background h-4 w-4 shrink-0'
                                fill='var(--secondary)'
                            />
                        </div>
                        <div className='flex flex-wrap gap-1'>
                            {game.types.map((type: string) => (
                                <Badge
                                    className='bg-secondary/30 text-secondary border-secondary border text-xs font-semibold'
                                    key={game.id + '-' + type}
                                >
                                    {type}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </Item>
            </button>
        )
    }

    return (
        <button
            onClick={() => handleFirstStepGameClick(game.id, game.name)}
            className='h-full w-full cursor-pointer'
        >
            <Item
                className={cn(
                    'h-full w-full shadow-md ring-2 ring-transparent transition-all duration-300',
                    isGameSelected && 'ring-primary shadow-primary',
                )}
                variant='outline'
            >
                <ItemHeader>
                    <AspectRatio
                        ratio={1}
                        className='overflow-hidden rounded-lg shadow-md'
                    >
                        {coverImage}
                    </AspectRatio>
                </ItemHeader>
                <ItemContent>
                    <ItemTitle className='text-start'>{game.name}</ItemTitle>
                    <ItemDescription className='flex w-full items-center justify-between gap-1'>
                        <span className='inline-flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            {game.releaseDateString ??
                                t('releaseDateNotAvailable')}
                        </span>
                        <BadgeCheck
                            className='text-background'
                            fill='var(--secondary)'
                        />
                    </ItemDescription>
                </ItemContent>
                <ItemFooter className='inline-flex flex-wrap justify-start'>
                    {game.types.map((type: string) => (
                        <Badge
                            className='bg-secondary/30 text-secondary border-secondary border text-sm font-semibold'
                            key={game.id + '-' + type}
                        >
                            {type}
                        </Badge>
                    ))}
                </ItemFooter>
            </Item>
        </button>
    )
}
