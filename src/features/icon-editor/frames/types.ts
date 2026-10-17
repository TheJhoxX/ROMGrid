import type { FC } from 'react'
import type { ExportEngine } from './export'

export const CONSOLE_FRAME_STYLES = ['none', '3ds', 'dsi'] as const
export type ConsoleFrameStyle = (typeof CONSOLE_FRAME_STYLES)[number]

export type FrameIcon = {
    src: string
    alt: string
    backgroundColor: string
    borderRadius: number
    priority?: boolean
    loading?: 'lazy' | 'eager'
    sizes?: string
} | null

export type FrameComponent = FC<{ icon: FrameIcon }>

export type FrameDefinition = {
    Component: FrameComponent
    customExport?: ExportEngine
}
