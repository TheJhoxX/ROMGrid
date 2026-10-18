'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Scan, SlidersHorizontal } from 'lucide-react'
import { IconArtwork } from './IconArtwork'
import { PanelDrawer } from './components/PanelDrawer'
import { FramesPanel, FramesPanelBody } from './components/FramesPanel'
import { SettingsPanel, SettingsPanelBody } from './components/SettingsPanel'
import type { IconPanelProps } from './types'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

type EditorPanel = 'settings' | 'frames'

export const IconEditor = ({
    src,
    alt,
    adjustment,
    onUpdateAdjustment,
}: IconPanelProps & { src: string | null; alt: string }) => {
    const t = useTranslations('assetMaker.steps.customize')
    const { isAtLeastMd } = useBreakpoint()
    const [openPanel, setOpenPanel] = useState<EditorPanel | null>(null)

    const previewCard = (
        <Card className='flex min-w-0 grow flex-col'>
            <CardHeader>
                <CardTitle>{t('preview.title')}</CardTitle>
                <CardDescription>{t('preview.description')}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-1 items-center justify-center'>
                <div className='aspect-square w-full max-w-3xl overflow-hidden'>
                    <IconArtwork
                        src={src}
                        alt={alt}
                        adjustment={adjustment}
                        mode='preview'
                    />
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
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
                                adjustment={adjustment}
                                onUpdateAdjustment={onUpdateAdjustment}
                            />
                        </TabsContent>
                        <TabsContent
                            value='settings'
                            className='flex-1'
                        >
                            <SettingsPanel
                                className='h-full'
                                adjustment={adjustment}
                                onUpdateAdjustment={onUpdateAdjustment}
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
                                adjustment={adjustment}
                                onUpdateAdjustment={onUpdateAdjustment}
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
                                adjustment={adjustment}
                                onUpdateAdjustment={onUpdateAdjustment}
                            />
                        </PanelDrawer>
                    </div>
                </div>
            )}
        </div>
    )
}
