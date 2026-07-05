import { useQuery } from '@tanstack/react-query'
import { ScraperKeyId, useApiKeys } from './useApiKeys'
import { SGDBGame, SGDBImage } from 'steamgriddb'
import {
    SGDBGameWithCover,
    SGDBGameWithStringReleaseDate,
} from '@/app/api/sgdb/types'

const mapGame = (game: SGDBGame): SGDBGameWithStringReleaseDate => {
    const date =
        game.release_date && game.release_date > 0
            ? new Date(game.release_date * 1000).toLocaleDateString()
            : null
    return { ...game, releaseDateString: date }
}

export function useSGDBSearch({
    query,
    loadCovers = false,
}: {
    query: string
    loadCovers?: boolean
}) {
    const { apiKeys } = useApiKeys()
    const apiKey = apiKeys?.[ScraperKeyId.SteamGridDb]

    const { data, isLoading, isFetching } = useQuery<SGDBGameWithCover[]>({
        queryKey: ['sgdb-search', query, loadCovers],
        queryFn: async () => {
            const sgdbHeaders = { 'x-sgdb-key': apiKey! }

            const searchRes = await fetch(
                `/api/sgdb/search/autocomplete/${encodeURIComponent(query)}`,
                { headers: sgdbHeaders },
            ).then((r) => r.json())
            const games: SGDBGame[] = searchRes.data ?? []

            if (!loadCovers)
                return games.map((game) => ({
                    ...mapGame(game),
                    cover: undefined,
                }))

            return Promise.all(
                games.map(async (game) => {
                    const gridsRes = await fetch(
                        `/api/sgdb/grids/game/${game.id}?limit=1`,
                        { headers: sgdbHeaders },
                    ).then((r) => r.json())
                    const covers: SGDBImage[] = gridsRes.data ?? []
                    return { ...mapGame(game), cover: covers[0] }
                }),
            )
        },
        enabled: !!query && !!apiKey,
    })

    return {
        data: data ?? [],
        isLoading,
        isFetching,
    }
}
