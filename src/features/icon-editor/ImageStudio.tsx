'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { saveAs } from 'file-saver'
import { Download, ImagePlus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { IconEditor } from './IconEditor'
import { IconArtwork } from './IconArtwork'
import { DEFAULT_ICON_ADJUSTMENT } from './defaults'
import { exportFramedIcon } from './frames/export'
import type { IconAdjustment } from './types'

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
        if (!exportNode.current || isExporting) return
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
                        isExporting ||
                        adjustment.width < 16 ||
                        adjustment.width > 1024
                    }
                >
                    <Download data-icon='inline-start' />
                    {isExporting ? t('exporting') : t('export')}
                </Button>
            </header>

            <div className='flex flex-wrap items-center gap-2'>
                <Button
                    variant='outline'
                    asChild
                >
                    <label className='cursor-pointer'>
                        <ImagePlus data-icon='inline-start' />
                        {imageUrl ? t('replaceImage') : t('addImage')}
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='sr-only'
                        />
                    </label>
                </Button>
                {imageUrl && (
                    <Button
                        variant='ghost'
                        onClick={() => setImageUrl(null)}
                    >
                        <X data-icon='inline-start' />
                        {t('removeImage')}
                    </Button>
                )}
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
