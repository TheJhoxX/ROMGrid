import type { SGDBGameWithCover } from '@/app/api/sgdb/types'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemTitle,
} from '@/components/ui/item'
import { useSGDBSearch } from '@/hooks/useSgdbSearch'
import { useApiKeys, ScraperKeyId } from '@/hooks/useApiKeys'
import { cn } from '@/lib/utils'
import {
    ArrowBigRight,
    BadgeCheck,
    Calendar,
    Eraser,
    ImageOff,
    KeyRound,
    X,
} from 'lucide-react'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import Image from 'next/image'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import type { GameConfig } from '../page'
import { useTranslations } from 'next-intl'
import { Spinner } from '@/components/ui/spinner'
import type { AssetMakerStep } from '../types'

const DEBOUNCE_DELAY = 200

type SearchStatus = 'no-key' | 'loading' | 'no-results' | 'results'

const SEARCH_STATUS_MAP: Record<
    Exclude<SearchStatus, 'results'>,
    {
        Icon: React.ComponentType<{ className?: string }>
        titleKey: string
        descriptionKey?: string
    }
> = {
    'no-key': {
        Icon: KeyRound,
        titleKey: 'noApiKeyTitle',
        descriptionKey: 'noApiKeyDescription',
    },
    loading: {
        Icon: Spinner,
        titleKey: 'loadingTitle',
    },
    'no-results': {
        Icon: ImageOff,
        titleKey: 'emptyTitle',
        descriptionKey: 'emptyDescription',
    },
}

export type SearchStepProps = {
    onGameClick: (gameId: number, gameName: string) => void
    onChangeStep: (nextStep: AssetMakerStep) => void
    onClearGames: () => void
    selectedGames: Map<number, GameConfig>
}

export const SearchStep = ({
    onGameClick,
    onChangeStep,
    onClearGames,
    selectedGames,
}: SearchStepProps) => {
    const [query, setGameQuery] = useState<string>('')
    const [debouncedQuery] = useDebounce(query, DEBOUNCE_DELAY)
    const { data: games, isFetching } = useSGDBSearch({
        query: debouncedQuery,
        loadCovers: true,
    })
    const { apiKeys } = useApiKeys()
    const hasSgdbKey = !!apiKeys?.[ScraperKeyId.SteamGridDb]
    const t = useTranslations('assetMaker.steps.search')

    return (
        <div className='flex min-h-0 w-full flex-1 flex-col gap-6'>
            <div className='flex flex-col gap-4'>
                {selectedGames.size > 0 && (
                    <div className='flex flex-col gap-4 md:flex-row md:justify-between'>
                        <div className='flex flex-wrap items-center gap-2'>
                            {[...selectedGames.entries()].map(
                                ([gameId, gameConfig]) => (
                                    <Badge
                                        key={gameId}
                                        className='bg-primary/10 text-primary border-primary/30 gap-1 border pr-1 font-medium'
                                    >
                                        {gameConfig.name}
                                        <button
                                            onClick={() =>
                                                onGameClick(
                                                    gameId,
                                                    gameConfig.name,
                                                )
                                            }
                                            className='hover:bg-primary/20 cursor-pointer rounded-full p-0.5 transition-colors'
                                            aria-label={`Remove ${gameConfig.name}`}
                                        >
                                            <X className='h-3 w-3' />
                                        </button>
                                    </Badge>
                                ),
                            )}
                        </div>
                        <Button
                            size='sm'
                            onClick={onClearGames}
                            className='bg-secondary/30 text-secondary w-fit cursor-pointer'
                            title={t('clearGames')}
                        >
                            Clear selected game(s)
                            <Eraser className='h-4 w-4' />
                        </Button>
                    </div>
                )}

                <div className='flex w-full flex-col gap-2 md:flex-row md:items-center'>
                    <Input
                        id='input-game-search'
                        onChange={(e) => setGameQuery(e.target.value)}
                        value={query}
                        placeholder={t('searchPlaceholder')}
                    />
                    <Button
                        disabled={selectedGames.size === 0}
                        onClick={() => onChangeStep('icon')}
                        className='cursor-pointer'
                    >
                        {t('continueButtonLabel', {
                            gamesCount: selectedGames.size,
                        })}
                        <ArrowBigRight fill='var(--color-background)' />
                    </Button>
                </div>
            </div>
            {(() => {
                const status: SearchStatus = !hasSgdbKey
                    ? 'no-key'
                    : isFetching
                      ? 'loading'
                      : debouncedQuery && games.length === 0
                        ? 'no-results'
                        : 'results'

                if (status === 'results') {
                    return (
                        <div className='grid w-full flex-1 grid-cols-1 content-start gap-4 md:grid-cols-3 lg:grid-cols-4'>
                            {games?.map((game: SGDBGameWithCover) => (
                                <GamePreview
                                    key={game.id}
                                    game={game}
                                    isGameSelected={selectedGames.has(game.id)}
                                    onGameClick={onGameClick}
                                />
                            ))}
                        </div>
                    )
                }

                const { Icon, titleKey, descriptionKey } =
                    SEARCH_STATUS_MAP[status]
                return (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia>
                                <Icon className='size-8' />
                            </EmptyMedia>
                            <EmptyTitle>{t(titleKey)}</EmptyTitle>
                            {descriptionKey && (
                                <EmptyDescription>
                                    {t(descriptionKey)}
                                </EmptyDescription>
                            )}
                        </EmptyHeader>
                    </Empty>
                )
            })()}
        </div>
    )
}

type GamePreviewProps = {
    game: SGDBGameWithCover
    isGameSelected: boolean
    onGameClick: (gameId: number, gameName: string) => void
}

const GamePreview = ({
    game,
    isGameSelected,
    onGameClick,
}: GamePreviewProps) => {
    const t = useTranslations('assetMaker.steps.search')
    const { isAtLeastMd } = useBreakpoint()

    const coverImage = game.cover ? (
        <Image
            src={game.cover.thumb.toString()}
            alt={game.name + ' thumb'}
            fill
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
                onClick={() => onGameClick(game.id, game.name)}
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
            onClick={() => onGameClick(game.id, game.name)}
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
