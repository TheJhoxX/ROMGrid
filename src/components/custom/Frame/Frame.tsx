import type { PropsWithChildren } from 'react'
import type { ExportEngine } from './export'

// TODO: introduce dsi
export const CONSOLE_FRAME_STYLES = ['none', '3ds'] as const
export type ConsoleFrameStyle = (typeof CONSOLE_FRAME_STYLES)[number]

type FrameDefinition = {
    Component: React.FC<PropsWithChildren>
    customExport?: ExportEngine
}

const NoneFrame: React.FC<PropsWithChildren> = ({ children }) => <>{children}</>

const ThreeDSFrame: React.FC<PropsWithChildren> = ({ children }) => (
    <div className='@container-[size] h-full w-full'>
        <div
            className='relative h-full w-full overflow-hidden rounded-[15%] bg-linear-to-b from-white from-90% to-[#B3B3B3] ring-[0.2cqmin] ring-[#E3E3E3]'
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
                {children}
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
}

export const Frame = ({ style, children }: PropsWithChildren<FrameProps>) => {
    const { Component } = FRAMES[style]
    return <Component>{children}</Component>
}
