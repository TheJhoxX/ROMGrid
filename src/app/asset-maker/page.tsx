'use client'
import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { ArrowBigRight, SaveAllIcon, type LucideIcon } from 'lucide-react'
import { exportFramedIcon } from '@/components/custom/Frame/export'
import { GameIcon } from './CustomizeStep/GameIcon'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2Icon } from 'lucide-react'

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

type StepActionConfig = {
    labelKey: string
    Icon: LucideIcon
    canRun: (games: Map<number, GameConfig>) => boolean
}

const STEP_ACTIONS: Record<AssetMakerStep, StepActionConfig> = {
    search: {
        labelKey: 'continueButtonLabel',
        Icon: ArrowBigRight,
        canRun: (games) => games.size > 0,
    },
    icon: {
        labelKey: 'continueButtonLabel',
        Icon: ArrowBigRight,
        canRun: (games) =>
            games.size > 0 &&
            [...games.values()].every((g) => g.selectedIcon !== null),
    },
    customize: {
        labelKey: 'steps.customize.export',
        Icon: SaveAllIcon,
        canRun: (games) =>
            [...games.values()].some((g) => g.selectedIcon !== null),
    },
}

const DEFAULT_ICON_ADJUSTMENT: IconAdjustment = {
    backgroundColor: '#00000000',
    frameStyle: 'none',
    borderRadius: 0,
    width: 512,
    height: 512,
}

type ExportState = {
    active: boolean
    current: number
    total: number
    currentName: string
    phase: 'rendering' | 'zipping' | 'success'
}

const AssetMaker = () => {
    const [currentStep, setCurrentStep] = useState<AssetMakerStep>('search')
    const [selectedGames, setSelectedGames] = useState<Map<number, GameConfig>>(
        new Map(),
    )
    const t = useTranslations('assetMaker')
    const exportNodes = useRef<Map<number, HTMLDivElement>>(new Map())
    const [exportState, setExportState] = useState<ExportState>({
        active: false,
        current: 0,
        total: 0,
        currentName: '',
        phase: 'rendering',
    })

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

    const handleExportAll = useCallback(async () => {
        const exportable = [...selectedGames.entries()].filter(
            ([, g]) => g.selectedIcon,
        )
        setExportState({
            active: true,
            current: 0,
            total: exportable.length,
            currentName: '',
            phase: 'rendering',
        })
        try {
            const zip = new JSZip()
            for (let i = 0; i < exportable.length; i++) {
                const [gameId, game] = exportable[i]
                setExportState((s) => ({
                    ...s,
                    current: i,
                    currentName: game.name,
                    phase: 'rendering',
                }))
                const node = exportNodes.current.get(gameId)
                if (!node) continue
                const { width, height, frameStyle } = game.iconAdjustment
                const blob = await exportFramedIcon(node, frameStyle, {
                    width,
                    height,
                })
                zip.file(`${game.name}.png`, blob)
            }
            setExportState((s) => ({
                ...s,
                current: exportable.length,
                phase: 'zipping',
            }))
            const zipBlob = await zip.generateAsync({ type: 'blob' })
            saveAs(zipBlob, 'romgrid-icons.zip')
            setExportState((s) => ({ ...s, phase: 'success' }))
        } catch {
            setExportState((s) => ({ ...s, active: false }))
        }
    }, [selectedGames])

    const handleCloseExportDialog = useCallback(() => {
        setExportState((s) => ({ ...s, active: false }))
    }, [])

    const stepActionHandlers = useMemo<
        Record<AssetMakerStep, () => void>
    >(() => {
        const goNext = (step: AssetMakerStep) => {
            const idx = STEP_ORDER.indexOf(step)
            const next = STEP_ORDER[idx + 1]
            if (next) handleChangeStep(next)
        }
        return {
            search: () => goNext('search'),
            icon: () => goNext('icon'),
            customize: () => handleExportAll(),
        }
    }, [handleChangeStep, handleExportAll])

    const content = () => {
        if (currentStep === 'search') {
            return (
                <SearchStep
                    onGameClick={handleFirstStepGameClick}
                    selectedGames={selectedGames}
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
        const action = STEP_ACTIONS[currentStep]
        const ActionIcon = action.Icon
        return (
            <div className='space-y-4'>
                <div className='flex items-center justify-between gap-4'>
                    <Breadcrumb className='w-full grow'>
                        <BreadcrumbList>
                            {STEP_ORDER.map((step, index) => {
                                const label = t(`steps.${step}.breadcrumb`)
                                const isCurrent = step === currentStep
                                const isPast = index < currentIndex
                                return (
                                    <Fragment key={step}>
                                        <BreadcrumbItem className='text-sm lg:text-xl'>
                                            {isCurrent ? (
                                                <BreadcrumbPage className='font-bold'>
                                                    {label}
                                                </BreadcrumbPage>
                                            ) : isPast ? (
                                                <BreadcrumbLink
                                                    asChild
                                                    className='font-semibold'
                                                >
                                                    <button
                                                        type='button'
                                                        className='cursor-pointer'
                                                        onClick={() =>
                                                            handleChangeStep(
                                                                step,
                                                            )
                                                        }
                                                    >
                                                        {label}
                                                    </button>
                                                </BreadcrumbLink>
                                            ) : (
                                                <span className='text-muted-foreground/60 font-semibold'>
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
                    <Button
                        size='sm'
                        disabled={
                            !action.canRun(selectedGames) || exportState.active
                        }
                        onClick={stepActionHandlers[currentStep]}
                        className='cursor-pointer'
                    >
                        {t(action.labelKey)}
                        <ActionIcon />
                    </Button>
                </div>
                <p className='text-muted-foreground w-full text-xs'>
                    {description}
                </p>
            </div>
        )
    }

    return (
        <div className='flex w-full flex-col items-center gap-2'>
            <div className='bg-background sticky top-13.5 z-20 flex w-full flex-col gap-2 px-6 py-3'>
                {header()}
            </div>
            <div className='w-full px-6'>{content()}</div>
            <ExportProgressDialog
                state={exportState}
                onClose={handleCloseExportDialog}
            />
            <div
                aria-hidden
                style={{
                    position: 'fixed',
                    left: '-99999px',
                    top: 0,
                    pointerEvents: 'none',
                }}
            >
                {[...selectedGames.entries()].map(([gameId, game]) => {
                    if (!game.selectedIcon) return null
                    const { width, height } = game.iconAdjustment
                    return (
                        <div
                            key={gameId}
                            ref={(el) => {
                                if (el) exportNodes.current.set(gameId, el)
                                else exportNodes.current.delete(gameId)
                            }}
                            style={{
                                width: `${width}px`,
                                height: `${height}px`,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <GameIcon
                                game={game}
                                mode='export'
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const ExportProgressDialog = ({
    state,
    onClose,
}: {
    state: ExportState
    onClose: () => void
}) => {
    const t = useTranslations('assetMaker.steps.customize.exportProgress')
    const { active, current, total, currentName, phase } = state
    const progress = total === 0 ? 0 : (current / total) * 100
    const isSuccess = phase === 'success'

    return (
        <Dialog
            open={active}
            onOpenChange={(open) => {
                if (!open && isSuccess) onClose()
            }}
        >
            <DialogContent
                showCloseButton={isSuccess}
                onEscapeKeyDown={(e) => {
                    if (!isSuccess) e.preventDefault()
                }}
                onPointerDownOutside={(e) => {
                    if (!isSuccess) e.preventDefault()
                }}
            >
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        {isSuccess && (
                            <CheckCircle2Icon className='text-primary size-5' />
                        )}
                        {isSuccess ? t('successTitle') : t('title')}
                    </DialogTitle>
                    <DialogDescription>
                        {isSuccess
                            ? t('successDescription', { total })
                            : t('description')}
                    </DialogDescription>
                </DialogHeader>
                {!isSuccess && (
                    <div className='flex flex-col gap-2'>
                        <Progress value={progress} />
                        <div className='flex items-center justify-between text-sm'>
                            <span className='text-muted-foreground truncate'>
                                {phase === 'zipping'
                                    ? t('zipping')
                                    : t('current', { name: currentName })}
                            </span>
                            <span className='text-muted-foreground shrink-0 tabular-nums'>
                                {t('counter', { current, total })}
                            </span>
                        </div>
                    </div>
                )}
                {isSuccess && (
                    <div className='flex justify-end'>
                        <Button onClick={onClose}>{t('close')}</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default AssetMaker
