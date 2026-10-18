import { GamePreview } from './GamePreview'
import type { SGDBGameWithCover } from '@/lib/sgdb/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSGDBSearch } from '@/lib/sgdb/useSgdbSearch'
import { useApiKeys, ScraperKeyId } from '@/lib/sgdb/useApiKeys'
import { Eraser, ImageOff, KeyRound, Search, X } from 'lucide-react'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useAssetMaker } from '../../AssetMakerContext'
import { useTranslations } from 'next-intl'
import { Spinner } from '@/components/ui/spinner'

const DEBOUNCE_DELAY = 200

type SearchStatus = 'no-key' | 'loading' | 'idle' | 'no-results' | 'results'

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
    idle: {
        Icon: Search,
        titleKey: 'idleTitle',
        descriptionKey: 'idleDescription',
    },
    'no-results': {
        Icon: ImageOff,
        titleKey: 'emptyTitle',
        descriptionKey: 'emptyDescription',
    },
}

const MAX_GAME_CHIPS_AMMOUNT = 5

export const SearchStep = () => {
    const { selectedGames, handleFirstStepGameClick, handleClearGames } =
        useAssetMaker()
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
                    <div className='flex flex-wrap justify-between gap-4'>
                        <div className='flex flex-wrap items-center gap-2'>
                            {selectedGames.size < MAX_GAME_CHIPS_AMMOUNT ? (
                                [...selectedGames.entries()].map(
                                    ([gameId, gameConfig]) => (
                                        <Badge
                                            key={gameId}
                                            variant='secondary'
                                            className='h-6 gap-1 pr-0.5'
                                        >
                                            {gameConfig.name}
                                            <Button
                                                variant='ghost'
                                                size='icon-xs'
                                                onClick={() =>
                                                    handleFirstStepGameClick(
                                                        gameId,
                                                        gameConfig.name,
                                                    )
                                                }
                                                aria-label={`Remove ${gameConfig.name}`}
                                            >
                                                <X />
                                            </Button>
                                        </Badge>
                                    ),
                                )
                            ) : (
                                <Badge
                                    variant='secondary'
                                    className='h-6 gap-1 pr-0.5'
                                >
                                    {t('gamesAmountSelected', {
                                        gamesAmount: selectedGames.size,
                                    })}
                                    <Button
                                        variant='ghost'
                                        size='icon-xs'
                                        onClick={handleClearGames}
                                        aria-label={`Remove all`}
                                    >
                                        <X />
                                    </Button>
                                </Badge>
                            )}
                        </div>
                        <Button
                            size='xs'
                            onClick={handleClearGames}
                            title={t('clearGames')}
                            variant='secondary'
                        >
                            {t('clearGames')}
                            <Eraser data-icon='inline-end' />
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
                </div>
            </div>
            {(() => {
                const status: SearchStatus = !hasSgdbKey
                    ? 'no-key'
                    : isFetching
                      ? 'loading'
                      : !debouncedQuery
                        ? 'idle'
                        : games.length === 0
                          ? 'no-results'
                          : 'results'

                if (status === 'results') {
                    return (
                        <div className='grid w-full flex-1 grid-cols-1 content-start gap-4 md:grid-cols-3 lg:grid-cols-4'>
                            {games?.map((game: SGDBGameWithCover) => (
                                <GamePreview
                                    key={game.id}
                                    game={game}
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
