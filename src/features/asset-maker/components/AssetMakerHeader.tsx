import { Fragment } from 'react'
import { useTranslations } from 'next-intl'
import { STEP_ACTIONS, STEP_ORDER } from '../steps'
import { useAssetMaker } from '../AssetMakerContext'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'

type AssetMakerHeaderProps = {
    disabled: boolean
    onAction: () => void
}

export const AssetMakerHeader = ({
    disabled,
    onAction,
}: AssetMakerHeaderProps) => {
    const { currentStep, handleChangeStep } = useAssetMaker()
    const t = useTranslations('assetMaker')
    const description = t(`steps.${currentStep}.description`)
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    const action = STEP_ACTIONS[currentStep]
    const ActionIcon = action.Icon
    return (
        <div className='flex flex-col gap-4'>
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
                                                        handleChangeStep(step)
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
                    disabled={disabled}
                    onClick={onAction}
                    className='text-primary-foreground cursor-pointer'
                >
                    {t(action.labelKey)}
                    <ActionIcon data-icon='inline-end' />
                </Button>
            </div>
            <p className='text-muted-foreground w-full text-xs'>
                {description}
            </p>
        </div>
    )
}
