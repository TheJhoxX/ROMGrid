import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import type { IconAdjustment, IconPanelProps } from '../types'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ColorInput } from '@/components/ui/color-input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Slider } from '@/components/ui/slider'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Crop, Expand, Scan, Shrink } from 'lucide-react'

export const SettingsPanelBody = ({
    adjustment,
    onUpdateAdjustment,
}: IconPanelProps) => {
    const t = useTranslations('assetMaker.steps.customize')
    const fitLabels = {
        contain: t('settings.fit.contain'),
        cover: t('settings.fit.cover'),
        fill: t('settings.fit.fill'),
        scaleDown: t('settings.fit.scaleDown'),
    }
    return (
        <FieldGroup>
            <Field>
                <FieldLabel>{t('settings.size')}</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        type='text'
                        value={adjustment.width}
                        aria-invalid={
                            Number.isNaN(adjustment.width) ||
                            adjustment.width < 16 ||
                            adjustment.width > 1024
                        }
                        onChange={(e) => {
                            const val = Number(e.target.value)
                            if (!Number.isNaN(val)) {
                                onUpdateAdjustment('width', val)
                                onUpdateAdjustment('height', val)
                            }
                        }}
                    />
                    <InputGroupAddon align='inline-end'>px</InputGroupAddon>
                </InputGroup>
            </Field>
            <Field>
                <FieldLabel>{t('settings.backgroundColor')}</FieldLabel>
                <ColorInput
                    value={adjustment.backgroundColor}
                    onChange={(value) =>
                        onUpdateAdjustment('backgroundColor', value)
                    }
                />
            </Field>
            <Field>
                <FieldLabel>
                    {t('settings.borderRadius', {
                        value: adjustment.borderRadius,
                    })}
                </FieldLabel>
                <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[adjustment.borderRadius]}
                    onValueChange={([val]) =>
                        onUpdateAdjustment('borderRadius', val)
                    }
                />
            </Field>
            <Field>
                <FieldLabel>{t('settings.fit.title')}</FieldLabel>
                <ToggleGroup
                    type='single'
                    spacing={1}
                    value={adjustment.fit}
                    aria-label={t('settings.fit.title')}
                    onValueChange={(value) => {
                        if (value) {
                            onUpdateAdjustment(
                                'fit',
                                value as IconAdjustment['fit'],
                            )
                        }
                    }}
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ToggleGroupItem
                                value='contain'
                                aria-label={fitLabels.contain}
                                data-state={
                                    adjustment.fit === 'contain' ? 'on' : 'off'
                                }
                            >
                                <Scan />
                            </ToggleGroupItem>
                        </TooltipTrigger>
                        <TooltipContent>{fitLabels.contain}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ToggleGroupItem
                                value='cover'
                                aria-label={fitLabels.cover}
                                data-state={
                                    adjustment.fit === 'cover' ? 'on' : 'off'
                                }
                            >
                                <Crop />
                            </ToggleGroupItem>
                        </TooltipTrigger>
                        <TooltipContent>{fitLabels.cover}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ToggleGroupItem
                                value='fill'
                                aria-label={fitLabels.fill}
                                data-state={
                                    adjustment.fit === 'fill' ? 'on' : 'off'
                                }
                            >
                                <Expand />
                            </ToggleGroupItem>
                        </TooltipTrigger>
                        <TooltipContent>{fitLabels.fill}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ToggleGroupItem
                                value='scale-down'
                                aria-label={fitLabels.scaleDown}
                                data-state={
                                    adjustment.fit === 'scale-down'
                                        ? 'on'
                                        : 'off'
                                }
                            >
                                <Shrink />
                            </ToggleGroupItem>
                        </TooltipTrigger>
                        <TooltipContent>{fitLabels.scaleDown}</TooltipContent>
                    </Tooltip>
                </ToggleGroup>
            </Field>
        </FieldGroup>
    )
}

export const SettingsPanel = ({
    adjustment,
    onUpdateAdjustment,
    className,
}: IconPanelProps & { className?: string }) => {
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
                    adjustment={adjustment}
                    onUpdateAdjustment={onUpdateAdjustment}
                />
            </CardContent>
        </Card>
    )
}
