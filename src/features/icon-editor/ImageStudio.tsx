'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { saveAs } from 'file-saver'
import { Download, ImageOff, ImageUp, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { IconEditor } from './IconEditor'
import { IconArtwork } from './IconArtwork'
import { DEFAULT_ICON_ADJUSTMENT } from './defaults'
import { exportFramedIcon } from './frames/export'
import type { IconAdjustment } from './types'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item'
import Image from 'next/image'
import { useBreakpoint } from '@/hooks/useBreakpoint'

export default function ImageStudio() {
    const t = useTranslations('imageStudio')
    const [adjustment, setAdjustment] = useState<IconAdjustment>(() => ({
        ...DEFAULT_ICON_ADJUSTMENT,
        frameStyle: '3ds',
    }))
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isExporting, setIsExporting] = useState(false)
    const [exportError, setExportError] = useState(false)
    const exportNode = useRef<HTMLDivElement>(null)
    const imageInput = useRef<HTMLInputElement>(null)
    const { isAtLeastMd } = useBreakpoint()

    useEffect(() => {
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl)
        }
    }, [imageUrl])

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setImageUrl(URL.createObjectURL(file))
        event.target.value = ''
    }

    const handleExport = async () => {
        if (!imageUrl || !exportNode.current || isExporting) return
        setExportError(false)
        setIsExporting(true)
        try {
            const blob = await exportFramedIcon(
                exportNode.current,
                adjustment.frameStyle,
                { width: adjustment.width, height: adjustment.height },
            )
            saveAs(blob, 'image-studio.png')
        } catch {
            setExportError(true)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <main className='flex w-full flex-col gap-6 px-6 py-6'>
            <header className='flex flex-wrap items-center justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold'>{t('title')}</h1>
                    <p className='text-muted-foreground text-sm'>
                        {t('description')}
                    </p>
                </div>
                <Button
                    onClick={() => void handleExport()}
                    disabled={
                        !imageUrl ||
                        isExporting ||
                        adjustment.width < 16 ||
                        adjustment.width > 1024
                    }
                >
                    <Download data-icon='inline-start' />
                    {isExporting ? t('exporting') : t('export')}
                </Button>
            </header>

            <div className='flex flex-col gap-2'>
                <Item
                    variant='outline'
                    className='w-full max-w-full md:w-fit'
                >
                    <ItemMedia
                        variant='image'
                        className='group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center'
                    >
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={t('uploadedImageAlt')}
                                width={32}
                                height={32}
                            />
                        ) : (
                            <div className='bg-muted flex size-full items-center justify-center'>
                                <ImageOff />
                            </div>
                        )}
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>{t('artworkTitle')}</ItemTitle>
                        <ItemDescription>
                            {imageUrl ? t('imageReady') : t('noImage')}
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button
                            variant={!imageUrl ? undefined : 'secondary'}
                            onClick={() => imageInput.current?.click()}
                        >
                            <ImageUp data-icon='inline-start' />
                            {isAtLeastMd &&
                                (imageUrl ? t('replaceImage') : t('addImage'))}
                        </Button>
                        <input
                            ref={imageInput}
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            hidden
                        />
                        {imageUrl && (
                            <Button
                                variant='destructive'
                                size='icon'
                                className='rounded-full'
                                aria-label={t('removeImage')}
                                onClick={() => setImageUrl(null)}
                            >
                                <X />
                            </Button>
                        )}
                    </ItemActions>
                </Item>
                {exportError && (
                    <p
                        role='alert'
                        className='text-destructive text-sm'
                    >
                        {t('exportError')}
                    </p>
                )}
            </div>

            <IconEditor
                src={imageUrl}
                alt='Image Studio artwork'
                adjustment={adjustment}
                onUpdateAdjustment={(key, value) =>
                    setAdjustment((current) => ({ ...current, [key]: value }))
                }
            />

            <div
                aria-hidden
                className='pointer-events-none fixed top-0 -left-[99999px]'
            >
                <div
                    ref={exportNode}
                    style={{
                        width: adjustment.width,
                        height: adjustment.height,
                    }}
                >
                    <IconArtwork
                        src={imageUrl}
                        alt='Image Studio artwork'
                        adjustment={adjustment}
                        mode='export'
                    />
                </div>
            </div>
        </main>
    )
}
