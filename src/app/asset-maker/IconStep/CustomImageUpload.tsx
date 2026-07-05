'use client'

import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type CustomImageUploadProps = {
    isSelected?: boolean
    onSelect?: (url: string) => void
}

export const CustomImageUpload = ({
    isSelected,
    onSelect,
}: CustomImageUploadProps) => {
    const inputId = useId()
    const t = useTranslations('assetMaker.steps.icon')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        onSelect?.(url)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setPreviewUrl(null)
    }

    if (previewUrl) {
        return (
            <div
                className='relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg shadow-md'
                onClick={() => onSelect?.(previewUrl)}
            >
                <Image
                    src={previewUrl}
                    alt={t('customImageAlt')}
                    fill
                    className='object-cover'
                />
                <button
                    onClick={handleRemove}
                    className='bg-background/80 hover:bg-foreground/80 hover:text-background/80 absolute top-2 right-2 z-10 rounded-full p-1 transition-colors duration-200'
                >
                    <X size={14} />
                </button>
            </div>
        )
    }

    return (
        <label
            htmlFor={inputId}
            className='border-border text-muted-foreground hover:border-primary hover:text-primary relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed transition-colors'
        >
            <Upload size={24} />
            <span className='text-xs font-medium'>{t('customLabel')}</span>
            <input
                id={inputId}
                type='file'
                accept='image/*'
                className='sr-only'
                onChange={handleChange}
            />
        </label>
    )
}
