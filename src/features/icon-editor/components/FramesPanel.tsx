import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import type { IconPanelProps } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    CONSOLE_FRAME_STYLES,
    Frame,
    type ConsoleFrameStyle,
} from '../frames/Frame'
import { ImageOffIcon } from 'lucide-react'
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item'

export const FramesPanelBody = ({
    adjustment,
    onUpdateAdjustment,
}: IconPanelProps) => {
    const t = useTranslations('assetMaker.steps.customize')
    return (
        <ItemGroup className='gap-4'>
            {CONSOLE_FRAME_STYLES.map((style: ConsoleFrameStyle) => {
                return (
                    <Item
                        size='xs'
                        className={cn(
                            style === adjustment.frameStyle && 'bg-muted',
                            'transition-colors duration-300',
                        )}
                        variant='outline'
                        key={'icon-frame-' + style}
                        asChild
                    >
                        <button
                            className='cursor-pointer'
                            type='button'
                            onClick={() =>
                                onUpdateAdjustment('frameStyle', style)
                            }
                        >
                            <ItemMedia>
                                <div className='flex h-16 w-16 items-center justify-center'>
                                    {style === 'none' ? (
                                        <ImageOffIcon />
                                    ) : (
                                        <Frame
                                            style={style}
                                            icon={null}
                                        />
                                    )}
                                </div>
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>
                                    {t(`frames.${style}.title`)}
                                </ItemTitle>
                                <ItemDescription>
                                    {t(`frames.${style}.description`)}
                                </ItemDescription>
                            </ItemContent>
                        </button>
                    </Item>
                )
            })}
        </ItemGroup>
    )
}

export const FramesPanel = ({
    adjustment,
    onUpdateAdjustment,
    className,
}: IconPanelProps & { className?: string }) => {
    const t = useTranslations('assetMaker.steps.customize')

    return (
        <Card className={cn('overflow-y-auto rounded-lg p-4', className)}>
            <CardHeader>
                <CardTitle>{t('frames.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <FramesPanelBody
                    adjustment={adjustment}
                    onUpdateAdjustment={onUpdateAdjustment}
                />
            </CardContent>
        </Card>
    )
}
