'use client'

import { Upload, X, XIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentMedia,
} from '@/components/ui/attachment'
import clsx from 'clsx'
import { useBreakpoint } from '@/hooks/useBreakpoint'

type CustomImageUploadProps = {
    isSelected?: boolean
    onChangeUrl: (url: string) => void
    previewUrl: string | null
}

export const CustomImageUpload = ({
    isSelected,
    onChangeUrl,
    previewUrl,
}: CustomImageUploadProps) => {
    const inputId = useId()
    const t = useTranslations('assetMaker.steps.icon')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        onChangeUrl(url)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onChangeUrl('')
    }

    const { isAtLeastMd } = useBreakpoint()

    return (
        <Attachment
            orientation='vertical'
            className={clsx(
                'hover:ring-primary ring-muted w-full cursor-pointer border-0 ring-2 transition-all duration-300',
                isSelected && 'ring-primary',
            )}
            onClick={() => {
                if (!previewUrl) return
                onChangeUrl(previewUrl)
            }}
        >
            <AttachmentMedia variant='image'>
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={t('customImageAlt')}
                    />
                ) : (
                    <>
                        <label
                            htmlFor={inputId}
                            className='text-muted-foreground hover:text-primary relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden'
                        >
                            <Upload
                                className={isAtLeastMd ? 'size-6' : 'size-4'}
                            />
                            <span className='text-xs'>{t('customLabel')}</span>
                            <input
                                id={inputId}
                                type='file'
                                accept='image/*'
                                className='sr-only'
                                onChange={handleChange}
                            />
                        </label>
                    </>
                )}
            </AttachmentMedia>
            {previewUrl && (
                <AttachmentActions>
                    <AttachmentAction
                        onClick={handleRemove}
                        className='bg-background'
                        aria-label={`Remove icon`}
                    >
                        <XIcon />
                    </AttachmentAction>
                </AttachmentActions>
            )}
        </Attachment>
    )
}
