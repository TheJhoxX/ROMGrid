import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import type { IconPanelProps } from '../types'
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

export const SettingsPanelBody = ({
    adjustment,
    onUpdateAdjustment,
}: IconPanelProps) => {
    const t = useTranslations('assetMaker.steps.customize')
    return (
        <FieldGroup>
            <Field>
                <FieldLabel>{t('settings.size')}</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        type='text'
                        value={adjustment.width}
                        aria-invalid={
                            isNaN(adjustment.width) ||
                            adjustment.width < 16 ||
                            adjustment.width > 1024
                        }
                        onChange={(e) => {
                            const val = Number(e.target.value)
                            if (!isNaN(val)) {
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
