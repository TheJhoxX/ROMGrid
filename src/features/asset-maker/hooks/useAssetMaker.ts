'use client'

import { useCallback, useState } from 'react'
import { DEFAULT_ICON_ADJUSTMENT } from '@/features/icon-editor/defaults'
import type { IconAdjustment } from '@/features/icon-editor/types'
import type { AssetMakerStep, GameConfig, SelectedIcon } from '../types'

export function useAssetMaker() {
    const [currentStep, setCurrentStep] = useState<AssetMakerStep>('search')
    const [selectedGames, setSelectedGames] = useState<Map<number, GameConfig>>(
        new Map(),
    )

    const handleFirstStepGameClick = (gameId: number, gameName: string) => {
        setSelectedGames((prev) => {
            const next = new Map(prev)
            if (next.has(gameId)) {
                next.delete(gameId)
            } else {
                next.set(gameId, {
                    name: gameName,
                    selectedIcon: null,
                    iconAdjustment: DEFAULT_ICON_ADJUSTMENT,
                })
            }
            return next
        })
    }

    const handleSelectIcon = useCallback(
        (gameId: number, icon: SelectedIcon) => {
            setSelectedGames((prev) => {
                const next = new Map(prev)
                const game = next.get(gameId)
                if (game) next.set(gameId, { ...game, selectedIcon: icon })
                return next
            })
        },
        [],
    )

    const handleClearGames = useCallback(() => {
        setSelectedGames(new Map())
    }, [])

    const handleClearIcon = useCallback((gameId: number) => {
        setSelectedGames((prev) => {
            const next = new Map(prev)
            const game = next.get(gameId)
            if (game) next.set(gameId, { ...game, selectedIcon: null })
            return next
        })
    }, [])

    const handleUpdateIconAdjustment = useCallback(
        <K extends keyof IconAdjustment>(
            gameId: number,
            key: K,
            value: IconAdjustment[K],
        ) => {
            setSelectedGames((prev) => {
                const next = new Map(prev)
                const game = next.get(gameId)
                if (game) {
                    next.set(gameId, {
                        ...game,
                        iconAdjustment: {
                            ...game.iconAdjustment,
                            [key]: value,
                        } as IconAdjustment,
                    })
                }
                return next
            })
        },
        [],
    )

    const handleChangeStep = useCallback((nextStep: AssetMakerStep) => {
        setCurrentStep(nextStep)
    }, [])

    return {
        currentStep,
        selectedGames,
        handleFirstStepGameClick,
        handleSelectIcon,
        handleClearGames,
        handleClearIcon,
        handleUpdateIconAdjustment,
        handleChangeStep,
    }
}
