// src/hooks/useApiKeys.ts
import { useLocalStorage } from './useLocalStorage'

export enum ScraperKeyId {
    SteamGridDb = 'romgrid-sgdb-key',
}

type ApiKeys = {
    [ScraperKeyId.SteamGridDb]?: string
}

export function useApiKeys() {
    const [apiKeys, setApiKeys] = useLocalStorage<ApiKeys>('romgrid-api-keys')

    const setSgdbKey = (key: string | undefined) =>
        setApiKeys((prev) => ({ ...prev, [ScraperKeyId.SteamGridDb]: key }))

    return {
        apiKeys,
        setSgdbKey,
    }
}
