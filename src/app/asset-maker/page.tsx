'use client'
import { Fragment, useCallback, useState } from 'react'
import { SearchStep } from './SearchStep/SearchStep'
import { useTranslations } from 'next-intl'
import { IconStep } from './IconStep/IconStep'
import type { SGDBImage } from 'steamgriddb'
import type { AssetMakerStep } from './types'
import { CustomizeStep } from './CustomizeStep/CustomizeStep'
import type { ConsoleFrameStyle } from '@/components/custom/Frame/Frame'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export type SelectedIcon =
    | { kind: 'sgdb'; image: SGDBImage }
    | { kind: 'custom'; url: string }

export type IconAdjustment = {
    frameStyle: ConsoleFrameStyle
    backgroundColor: string
    borderRadius: number
    width: number
    height: number
}

export type GameConfig = {
    name: string
    selectedIcon: SelectedIcon | null
    iconAdjustment: IconAdjustment
}

export const STEP_ORDER: AssetMakerStep[] = ['search', 'icon', 'customize']

const DEFAULT_ICON_ADJUSTMENT: IconAdjustment = {
    backgroundColor: '#00000000',
    frameStyle: 'none',
    borderRadius: 0,
    width: 512,
    height: 512,
}

const AssetMaker = () => {
    const [currentStep, setCurrentStep] = useState<AssetMakerStep>('search')
    const [selectedGames, setSelectedGames] = useState<Map<number, GameConfig>>(
        new Map(),
    )
    const t = useTranslations('assetMaker')

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

    const content = () => {
        if (currentStep === 'search') {
            return (
                <SearchStep
                    onGameClick={handleFirstStepGameClick}
                    selectedGames={selectedGames}
                    onChangeStep={handleChangeStep}
                    onClearGames={handleClearGames}
                />
            )
        }
        if (currentStep === 'icon') {
            return (
                <IconStep
                    selectedGames={selectedGames}
                    onSelectIcon={handleSelectIcon}
                    onClearIcon={handleClearIcon}
                    onChangeStep={handleChangeStep}
                />
            )
        }
        if (currentStep === 'customize') {
            return (
                <CustomizeStep
                    selectedGames={selectedGames}
                    onUpdateIconAdjustment={handleUpdateIconAdjustment}
                />
            )
        }
    }

    const header = () => {
        const description = t(`steps.${currentStep}.description`)
        const currentIndex = STEP_ORDER.indexOf(currentStep)
        return (
            <>
                <Breadcrumb className='w-full'>
                    <BreadcrumbList className='text-base'>
                        {STEP_ORDER.map((step, index) => {
                            const label = t(`steps.${step}.breadcrumb`)
                            const isCurrent = step === currentStep
                            const isPast = index < currentIndex
                            return (
                                <Fragment key={step}>
                                    <BreadcrumbItem>
                                        {isCurrent ? (
                                            <BreadcrumbPage className='text-2xl font-bold'>
                                                {label}
                                            </BreadcrumbPage>
                                        ) : isPast ? (
                                            <BreadcrumbLink
                                                asChild
                                                className='text-xl font-semibold'
                                            >
                                                <button
                                                    type='button'
                                                    className='cursor-pointer'
                                                    onClick={() =>
                                                        handleChangeStep(step)
                                                    }
                                                >
                                                    {label}
                                                </button>
                                            </BreadcrumbLink>
                                        ) : (
                                            <span className='text-muted-foreground/60 text-xl font-semibold'>
                                                {label}
                                            </span>
                                        )}
                                    </BreadcrumbItem>
                                    {index < STEP_ORDER.length - 1 && (
                                        <BreadcrumbSeparator />
                                    )}
                                </Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
                <p className='text-muted-foreground w-full'>{description}</p>
            </>
        )
    }

    return (
        <div className='flex h-[calc(100svh-7rem)] w-full flex-col items-center gap-6 overflow-hidden p-4'>
            {header()}
            {content()}
        </div>
    )
}

export default AssetMaker
