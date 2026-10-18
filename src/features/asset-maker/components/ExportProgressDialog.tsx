import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { ExportState } from '../types'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2Icon } from 'lucide-react'

export const ExportProgressDialog = ({
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
