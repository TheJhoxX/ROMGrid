import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import type { GameConfig, IconAdjustment, SelectedIcon } from '../page'
import { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { ConsoleFrameStyle } from '@/components/custom/Frame/Frame'
import { CONSOLE_FRAME_STYLES, Frame } from '@/components/custom/Frame/Frame'
import { GameIcon } from './GameIcon'
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
    ImageOffIcon,
    Info,
    InfoIcon,
    Scan,
    SlidersHorizontal,
    X,
    type LucideIcon,
} from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Slider } from '@/components/ui/slider'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

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

type ToolbarOptions = 'settings' | 'frames'

export const CustomizeStep = ({
    selectedGames,
    onUpdateIconAdjustment,
}: CustomizeStepProps) => {
    const t = useTranslations('assetMaker.steps.customize')
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

    const { isAtLeastMd } = useBreakpoint()
    const [openPanel, setOpenPanel] = useState<'frames' | 'settings' | null>(
        null,
    )

    const previewCard = currentGame?.selectedIcon && (
        <Card className='flex min-w-0 grow flex-col'>
            <CardHeader>
                <CardTitle>{t('preview.title')}</CardTitle>
                <CardDescription>{t('preview.description')}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-1 items-center justify-center'>
                <div className='aspect-square w-full max-w-3xl overflow-hidden'>
                    <GameIcon
                        game={currentGame}
                        mode='preview'
                    />
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
            <div className='flex w-full shrink-0 items-center gap-4 overflow-x-auto p-2'>
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
                <div className='grid grid-cols-3 gap-4'>
                    <div className='col-span-2'>{previewCard}</div>
                    <Tabs
                        defaultValue='frames'
                        className='flex flex-col gap-4'
                    >
                        <TabsList>
                            <TabsTrigger value='frames'>
                                <Scan />
                                {t('frames.title')}
                            </TabsTrigger>
                            <TabsTrigger value='settings'>
                                <SlidersHorizontal />
                                {t('settings.title')}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value='frames'
                            className='flex-1'
                        >
                            <FramesPanel
                                className='h-full'
                                currentGame={currentGame}
                                onUpdateConfig={handleUpdateAdjustment}
                            />
                        </TabsContent>
                        <TabsContent
                            value='settings'
                            className='flex-1'
                        >
                            <ToolbarPanel
                                className='h-full'
                                currentGame={currentGame}
                                onUpdateConfig={handleUpdateAdjustment}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            ) : (
                <div className='flex flex-col gap-4'>
                    {previewCard}
                    <div className='grid grid-cols-2 gap-2'>
                        <PanelDrawer
                            title={t('frames.title')}
                            Icon={Scan}
                            open={openPanel === 'frames'}
                            onOpenChange={(open) =>
                                setOpenPanel(open ? 'frames' : null)
                            }
                        >
                            <FramesPanelBody
                                currentGame={currentGame}
                                onUpdateConfig={handleUpdateAdjustment}
                            />
                        </PanelDrawer>
                        <PanelDrawer
                            title={t('settings.title')}
                            description={t('settings.description')}
                            Icon={SlidersHorizontal}
                            open={openPanel === 'settings'}
                            onOpenChange={(open) =>
                                setOpenPanel(open ? 'settings' : null)
                            }
                        >
                            <SettingsPanelBody
                                currentGame={currentGame}
                                onUpdateConfig={handleUpdateAdjustment}
                            />
                        </PanelDrawer>
                    </div>
                </div>
            )}
        </div>
    )
}

const PanelDrawer = ({
    title,
    description,
    Icon,
    open,
    onOpenChange,
    children,
}: {
    title: string
    description?: string
    Icon: LucideIcon
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}) => (
    <Drawer
        modal={false}
        open={open}
        onOpenChange={onOpenChange}
    >
        <DrawerTrigger asChild>
            <Button
                variant='outline'
                className='w-full'
            >
                <Icon />
                {title}
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader className='flex flex-row items-start justify-between gap-4'>
                <div className='flex flex-col gap-0.5 text-left'>
                    <DrawerTitle>{title}</DrawerTitle>
                    {description && (
                        <DrawerDescription>{description}</DrawerDescription>
                    )}
                </div>
                <DrawerClose asChild>
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Close'
                    >
                        <X />
                    </Button>
                </DrawerClose>
            </DrawerHeader>
            <div className='overflow-y-auto px-4 pb-6'>{children}</div>
        </DrawerContent>
    </Drawer>
)

type PanelBodyProps = {
    currentGame: GameConfig
    onUpdateConfig: <K extends keyof IconAdjustment>(
        key: K,
        value: IconAdjustment[K],
    ) => void
}

const SettingsPanelBody = ({ currentGame, onUpdateConfig }: PanelBodyProps) => {
    const t = useTranslations('assetMaker.steps.customize')
    const iconAdjustment = currentGame.iconAdjustment
    return (
        <div className='space-y-4'>
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
        </div>
    )
}

const ToolbarPanel = ({
    currentGame,
    onUpdateConfig,
    className,
}: PanelBodyProps & { className?: string }) => {
    const t = useTranslations('assetMaker.steps.customize')

    return (
        <Card
            className={cn('shrink-0 overflow-y-auto rounded-lg p-4', className)}
        >
            <CardHeader>
                <CardTitle>{t('settings.title')}</CardTitle>
                <CardDescription>{t('settings.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <SettingsPanelBody
                    currentGame={currentGame}
                    onUpdateConfig={onUpdateConfig}
                />
            </CardContent>
        </Card>
    )
}

const FramesPanelBody = ({ currentGame, onUpdateConfig }: PanelBodyProps) => {
    const t = useTranslations('assetMaker.steps.customize')
    const iconAdjustment = currentGame.iconAdjustment
    return (
        <ItemGroup className='gap-4'>
            {CONSOLE_FRAME_STYLES.map((style: ConsoleFrameStyle) => {
                return (
                    <Item
                        size='xs'
                        className={cn(
                            style === iconAdjustment.frameStyle && 'bg-muted',
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
                                    {style === 'none' ? (
                                        <ImageOffIcon />
                                    ) : (
                                        <Frame
                                            style={style}
                                            icon={null}
                                        />
                                    )}
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
    )
}

const FramesPanel = ({
    currentGame,
    onUpdateConfig,
    className,
}: PanelBodyProps & { className?: string }) => {
    const t = useTranslations('assetMaker.steps.customize')

    return (
        <Card className={cn('overflow-y-auto rounded-lg p-4', className)}>
            <CardHeader>
                <CardTitle>{t('frames.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <FramesPanelBody
                    currentGame={currentGame}
                    onUpdateConfig={onUpdateConfig}
                />
            </CardContent>
        </Card>
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
    const { isAtLeastMd } = useBreakpoint()

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={() => onPreviewClick(gameId)}
                    className={cn(
                        'bg-muted h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-md ring-2 ring-transparent transition-colors duration-200 md:h-24 md:w-24 lg:h-32 lg:w-32',
                        isSelected && 'ring-primary',
                    )}
                >
                    <img
                        src={src}
                        alt={name}
                        className='h-full w-full object-cover'
                    />
                    {isAtLeastMd && <p>Hola </p>}
                </button>
            </TooltipTrigger>
            <TooltipContent>{name}</TooltipContent>
        </Tooltip>
    )
}
