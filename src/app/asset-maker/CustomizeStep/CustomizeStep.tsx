import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import type { GameConfig, IconAdjustment, SelectedIcon } from '../page'
import { Button } from '@/components/ui/button'
import { useCallback, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { cn } from '@/lib/utils'
import type { ConsoleFrameStyle } from '@/components/custom/Frame/Frame'
import { CONSOLE_FRAME_STYLES, Frame } from '@/components/custom/Frame/Frame'
import { exportFramedIcon } from '@/components/custom/Frame/export'
import { GameIcon } from './GameIcon'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ColorInput } from '@/components/ui/color-input'
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item'
import {
    CheckCircle2Icon,
    ImageOffIcon,
    InfoIcon,
    SaveAllIcon,
} from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Slider } from '@/components/ui/slider'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group'
import { useTranslations } from 'next-intl'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function getIconUrl(icon: SelectedIcon): string {
    return icon.kind === 'sgdb' ? icon.image.url.toString() : icon.url
}

export type CustomizeStepProps = {
    selectedGames: Map<number, GameConfig>
    onUpdateIconAdjustment: <K extends keyof IconAdjustment>(
        gameId: number,
        key: K,
        value: IconAdjustment[K],
    ) => void
}

export const CustomizeStep = ({
    selectedGames,
    onUpdateIconAdjustment,
}: CustomizeStepProps) => {
    const t = useTranslations('assetMaker.steps.customize')
    const exportNodes = useRef<Map<number, HTMLDivElement>>(new Map())
    const [exportState, setExportState] = useState<ExportState>({
        active: false,
        current: 0,
        total: 0,
        currentName: '',
        phase: 'rendering',
    })
    const [currentGameId, setCurrentGameId] = useState<number>(
        () => selectedGames.keys().toArray()[0],
    )

    const currentGame = useMemo(() => {
        return (
            selectedGames.get(currentGameId) ??
            selectedGames.values().toArray()[0]
        )
    }, [currentGameId, selectedGames])

    const handlePreviewClick = useCallback(
        (gameId: number) => setCurrentGameId(gameId),
        [setCurrentGameId],
    )

    const handleUpdateAdjustment = useCallback(
        <K extends keyof IconAdjustment>(key: K, value: IconAdjustment[K]) => {
            onUpdateIconAdjustment(currentGameId, key, value)
        },
        [currentGameId, onUpdateIconAdjustment],
    )

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

    const handleExportDialogClose = useCallback(() => {
        setExportState((s) => ({ ...s, active: false }))
    }, [])

    const { isAtLeastMd } = useBreakpoint()

    const previewCard = currentGame?.selectedIcon && (
        <Card className='flex min-w-0 flex-1 flex-col'>
            <CardHeader>
                <CardTitle>{t('preview.title')}</CardTitle>
                <CardDescription>{t('preview.description')}</CardDescription>
            </CardHeader>
            <CardContent className='@container-[size] flex min-h-0 flex-1 items-center justify-center'>
                <div
                    className='checkerboard relative aspect-square overflow-hidden'
                    style={{ width: 'min(100cqw, 100cqh)' }}
                >
                    <GameIcon
                        game={currentGame}
                        mode='preview'
                    />
                </div>
            </CardContent>
            <CardFooter className='gap-2 text-sm'>
                <InfoIcon className='h-auto w-5 shrink-0' />
                <p>{t('checkBoardCaption')}</p>
            </CardFooter>
        </Card>
    )

    return (
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
            <div className='flex w-full shrink-0 items-center gap-4 overflow-x-auto p-1'>
                {[...selectedGames.entries()].map(([gameId, gameConfig]) => {
                    if (!gameConfig.selectedIcon) return null
                    return (
                        <IconPreview
                            key={gameId}
                            src={getIconUrl(gameConfig.selectedIcon)}
                            name={gameConfig.name}
                            isSelected={currentGameId === gameId}
                            gameId={gameId}
                            onPreviewClick={handlePreviewClick}
                        />
                    )
                })}
            </div>
            {isAtLeastMd ? (
                <div className='flex min-h-0 w-full flex-1 items-stretch gap-4'>
                    <ToolbarPanel
                        currentGame={currentGame}
                        onUpdateConfig={handleUpdateAdjustment}
                    />
                    {previewCard}
                    <FramesPanel
                        currentGame={currentGame}
                        onUpdateConfig={handleUpdateAdjustment}
                    />
                </div>
            ) : (
                <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
                    {previewCard}
                    <Tabs
                        defaultValue='settings'
                        className='w-full'
                    >
                        <TabsList className='w-full'>
                            <TabsTrigger value='settings'>
                                {t('settings.title')}
                            </TabsTrigger>
                            <TabsTrigger value='frames'>
                                {t('frames.title')}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='settings'>
                            <ToolbarPanel
                                currentGame={currentGame}
                                onUpdateConfig={handleUpdateAdjustment}
                                className='w-full'
                            />
                        </TabsContent>
                        <TabsContent value='frames'>
                            <FramesPanel
                                currentGame={currentGame}
                                onUpdateConfig={handleUpdateAdjustment}
                                className='w-full'
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            )}
            <Button
                size='lg'
                className='inline-flex w-fit items-center gap-2'
                onClick={handleExportAll}
                disabled={exportState.active}
            >
                {t('export')}
                <SaveAllIcon />
            </Button>
            <ExportProgressDialog
                state={exportState}
                onClose={handleExportDialogClose}
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

const ToolbarPanel = ({
    currentGame,
    onUpdateConfig,
    className,
}: {
    currentGame: GameConfig
    onUpdateConfig: <K extends keyof IconAdjustment>(
        key: K,
        value: IconAdjustment[K],
    ) => void
    className?: string
}) => {
    const t = useTranslations('assetMaker.steps.customize')
    const iconAdjustment = currentGame.iconAdjustment

    return (
        <Card
            className={cn(
                'w-72 shrink-0 overflow-y-auto rounded-lg p-4',
                className,
            )}
        >
            <CardHeader>
                <CardTitle>{t('settings.title')}</CardTitle>
                <CardDescription>{t('settings.description')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <Field>
                    <FieldLabel>{t('settings.size')}</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            type='text'
                            value={iconAdjustment.width}
                            aria-invalid={
                                isNaN(iconAdjustment.width) ||
                                iconAdjustment.width < 16 ||
                                iconAdjustment.width > 1024
                            }
                            onChange={(e) => {
                                const val = Number(e.target.value)
                                if (!isNaN(val)) {
                                    onUpdateConfig('width', val)
                                    onUpdateConfig('height', val)
                                }
                            }}
                        />
                        <InputGroupAddon align='inline-end'>px</InputGroupAddon>
                    </InputGroup>
                </Field>
                <Field>
                    <FieldLabel>{t('settings.backgroundColor')}</FieldLabel>
                    <ColorInput
                        value={iconAdjustment.backgroundColor}
                        onChange={(value) =>
                            onUpdateConfig('backgroundColor', value)
                        }
                    />
                </Field>
                <Field>
                    <FieldLabel>
                        {t('settings.borderRadius', {
                            value: iconAdjustment.borderRadius,
                        })}
                    </FieldLabel>
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[iconAdjustment.borderRadius]}
                        onValueChange={([val]) =>
                            onUpdateConfig('borderRadius', val)
                        }
                    />
                </Field>
            </CardContent>
        </Card>
    )
}

const FramesPanel = ({
    currentGame,
    onUpdateConfig,
    className,
}: {
    currentGame: GameConfig
    onUpdateConfig: <K extends keyof IconAdjustment>(
        key: K,
        value: IconAdjustment[K],
    ) => void
    className?: string
}) => {
    const t = useTranslations('assetMaker.steps.customize')
    const iconAdjustment = currentGame.iconAdjustment

    return (
        <Card
            className={cn(
                'w-72 shrink-0 overflow-y-auto rounded-lg p-4',
                className,
            )}
        >
            <CardHeader>
                <CardTitle>{t('frames.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <ItemGroup className='gap-4'>
                    {CONSOLE_FRAME_STYLES.map((style: ConsoleFrameStyle) => {
                        return (
                            <Item
                                size='xs'
                                className={cn(
                                    style === iconAdjustment.frameStyle &&
                                        'bg-muted',
                                    'transition-colors duration-300',
                                )}
                                variant='outline'
                                key={'icon-frame-' + style}
                                asChild
                            >
                                <button
                                    className='cursor-pointer'
                                    type='button'
                                    onClick={() =>
                                        onUpdateConfig('frameStyle', style)
                                    }
                                >
                                    <ItemMedia>
                                        <div className='flex h-16 w-16 items-center justify-center'>
                                            <Frame style={style}>
                                                {style !== 'none' ? null : (
                                                    <ImageOffIcon />
                                                )}
                                            </Frame>
                                        </div>
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle>
                                            {t(`frames.${style}.title`)}
                                        </ItemTitle>
                                        <ItemDescription>
                                            {t(`frames.${style}.description`)}
                                        </ItemDescription>
                                    </ItemContent>
                                </button>
                            </Item>
                        )
                    })}
                </ItemGroup>
            </CardContent>
        </Card>
    )
}

type ExportState = {
    active: boolean
    current: number
    total: number
    currentName: string
    phase: 'rendering' | 'zipping' | 'success'
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

const IconPreview = ({
    src,
    name,
    isSelected,
    gameId,
    onPreviewClick,
}: {
    src: string
    name: string
    isSelected: boolean
    gameId: number
    onPreviewClick: (gameId: number) => void
}) => {
    return (
        <button
            onClick={() => onPreviewClick(gameId)}
            className={cn(
                'checkerboard relative h-32 w-32 shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-sm ring-2 ring-transparent transition-colors duration-200',
                isSelected && 'ring-primary',
            )}
        >
            <Image
                src={src}
                alt={name}
                fill
                className='relative inset-0 object-cover'
            />
            <div className='relative flex h-full items-end'>
                <p className='text-background bg-background/20 line-clamp-2 rounded-lg p-2 font-extrabold backdrop-blur-xs text-shadow-sm'>
                    {name}
                </p>
            </div>
        </button>
    )
}
