'use client'

import Image from 'next/image'
import { useSgdbIcons } from '@/hooks/useSgdbIcons'
import { GameConfig, SelectedIcon } from '../page'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { SGDBImage } from 'steamgriddb'
import { Spinner } from '@/components/ui/spinner'
import { useTranslations } from 'next-intl'

type GridPickerDialogProps = {
    gameId: number
    gameConfig: GameConfig
    onSelectIcon: (icon: SelectedIcon) => void
}

export const GridPickerDialog = ({
    gameId,
    gameConfig,
    onSelectIcon,
}: GridPickerDialogProps) => {
    const [open, setOpen] = useState(false)
    const tGeneral = useTranslations('general.actions')
    const tIcon = useTranslations('assetMaker.steps.icon')
    const { icons, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useSgdbIcons({ gameId })

    const handleSelectSgdb = (image: SGDBImage) => {
        onSelectIcon({ kind: 'sgdb', image })
        setOpen(false)
    }

    const isSelected = (image: SGDBImage) =>
        gameConfig.selectedIcon?.kind === 'sgdb' &&
        gameConfig.selectedIcon.image.id === image.id

    const renderFooter = () => {
        if (isLoading || icons.length === 0) return null
        if (!hasNextPage)
            return (
                <p className='text-muted-foreground w-full text-center text-sm'>
                    {tIcon('noMoreIcons')}
                </p>
            )
        return (
            <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant='outline'
                className='w-full cursor-pointer'
            >
                {isFetchingNextPage && <Spinner data-icon='inline-start' />}
                {isFetchingNextPage
                    ? tGeneral('loading')
                    : tGeneral('loadMore')}
            </Button>
        )
    }

    const renderIcons = () => {
        if (isLoading)
            return (
                <div className='col-span-2 flex justify-center py-8 md:col-span-3'>
                    <Spinner />
                </div>
            )
        if (icons.length === 0)
            return (
                <p className='text-muted-foreground col-span-2 text-center text-sm md:col-span-3'>
                    {tIcon('noIconsAvailable')}
                </p>
            )
        return icons.map((image) => (
            <button
                key={image.id}
                onClick={() => handleSelectSgdb(image)}
                className={cn(
                    'checkerboard relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg shadow-md ring-2 ring-transparent transition-all',
                    isSelected(image) && 'ring-primary',
                )}
            >
                <Image
                    src={image.thumb.toString()}
                    alt={gameConfig.name}
                    fill
                    className='object-cover'
                />
            </button>
        ))
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    disabled={!isLoading && icons.length === 0}
                    size='sm'
                    className='cursor-pointer'
                >
                    {tGeneral('browseIcons')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='pr-4'>
                        {gameConfig.name}
                    </DialogTitle>
                </DialogHeader>
                <div className='no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto p-4'>
                    <div className='grid grid-cols-2 gap-3 pb-4 md:grid-cols-3'>
                        {renderIcons()}
                    </div>
                </div>
                <DialogFooter>{renderFooter()}</DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
