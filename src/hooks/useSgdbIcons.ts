import { useInfiniteQuery } from '@tanstack/react-query'
import { ScraperKeyId, useApiKeys } from './useApiKeys'
import { SGDBImage } from 'steamgriddb'

const PAGE_SIZE = 5

export function useSgdbIcons({ gameId }: { gameId: number | null }) {
    const { apiKeys } = useApiKeys()
    const apiKey = apiKeys?.[ScraperKeyId.SteamGridDb]

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteQuery<SGDBImage[], Error, SGDBImage[], string[], number>({
            queryKey: ['sgdb-icons', String(gameId)],
            initialPageParam: 0,
            queryFn: async ({ pageParam }) => {
                const res = await fetch(
                    `/api/sgdb/icons/game/${gameId}?limit=${PAGE_SIZE}&page=${pageParam}&types=static,animated`,
                    { headers: { 'x-sgdb-key': apiKey! } },
                ).then((r) => r.json())
                return (res.data ?? []) as SGDBImage[]
            },
            getNextPageParam: (lastPage, allPages) =>
                lastPage.length === PAGE_SIZE ? allPages.length : undefined,
            select: (data) => data.pages.flat(),
            enabled: !!gameId && !!apiKey,
        })

    return {
        icons: data ?? [],
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    }
}
