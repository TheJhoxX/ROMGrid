'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useAssetMakerState } from './hooks/useAssetMakerState'

type AssetMakerContextValue = ReturnType<typeof useAssetMakerState>

const AssetMakerContext = createContext<AssetMakerContextValue | null>(null)

export function AssetMakerProvider({ children }: { children: ReactNode }) {
    const value = useAssetMakerState()

    return (
        <AssetMakerContext.Provider value={value}>
            {children}
        </AssetMakerContext.Provider>
    )
}

export function useAssetMaker() {
    const context = useContext(AssetMakerContext)
    if (!context) {
        throw new Error('useAssetMaker must be used within AssetMakerProvider')
    }
    return context
}
