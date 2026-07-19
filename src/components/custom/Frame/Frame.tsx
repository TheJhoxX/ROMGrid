import Image from 'next/image'
import type { ExportEngine } from './export'

// TODO: introduce dsi
export const CONSOLE_FRAME_STYLES = ['none', '3ds'] as const
export type ConsoleFrameStyle = (typeof CONSOLE_FRAME_STYLES)[number]

export type FrameIcon = {
    src: string
    alt: string
    backgroundColor: string
    borderRadius: number
    priority?: boolean
    loading?: 'lazy' | 'eager'
} | null

type FrameDefinition = {
    Component: React.FC<{ icon: FrameIcon }>
    customExport?: ExportEngine
}

const IconLayer = ({ icon }: { icon: FrameIcon }) => {
    if (!icon) return null
    const {
        src,
        alt,
        backgroundColor,
        borderRadius,
        priority,
        loading,
    } = icon
    return (
        <>
            <div
                className='absolute inset-0'
                style={{ backgroundColor }}
            />
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                loading={loading}
                className='object-cover'
                style={{ borderRadius: `${borderRadius}%` }}
            />
        </>
    )
}

const NoneFrame: React.FC<{ icon: FrameIcon }> = ({ icon }) => (
    <div className='relative h-full w-full overflow-hidden'>
        <IconLayer icon={icon} />
    </div>
)

const ThreeDSFrame: React.FC<{ icon: FrameIcon }> = ({ icon }) => (
    <div className='@container-[size] h-full w-full'>
        <div
            className='relative h-full w-full overflow-hidden rounded-[15%] bg-linear-to-b from-white from-90% to-[#B2B2B2] ring-[0.2cqmin] ring-[#E3E3E3]'
            style={{
                boxShadow: 'inset 0 -3px 1cqmin 1cqmin rgba(0,0,0,0.2)',
            }}
        >
            <div
                className='absolute inset-0 overflow-hidden rounded-[8%] bg-[#ebebeb]'
                style={{
                    inset: '16cqmin',
                    boxShadow: '0 0 2cqmin 2.5cqmin rgba(0,0,0,0.15)',
                }}
            >
                <IconLayer icon={icon} />
            </div>
        </div>
    </div>
)

export const FRAMES: Record<ConsoleFrameStyle, FrameDefinition> = {
    none: { Component: NoneFrame },
    '3ds': { Component: ThreeDSFrame },
}

export type FrameProps = {
    style: ConsoleFrameStyle
    icon: FrameIcon
}

export const Frame = ({ style, icon }: FrameProps) => {
    const { Component } = FRAMES[style]
    return <Component icon={icon} />
}
