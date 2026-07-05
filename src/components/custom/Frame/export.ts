import { domToBlob } from 'modern-screenshot'
import { FRAMES, type ConsoleFrameStyle } from './Frame'

export type ExportOptions = {
    width: number
    height: number
}

export type ExportEngine = (
    node: HTMLElement,
    opts: ExportOptions,
) => Promise<Blob>

const domScreenshotEngine: ExportEngine = (node, { width, height }) =>
    domToBlob(node, {
        width,
        height,
        type: 'image/png',
        scale: 1,
        backgroundColor: 'transparent',
    })

export async function exportFramedIcon(
    node: HTMLElement,
    frameStyle: ConsoleFrameStyle,
    opts: ExportOptions,
): Promise<Blob> {
    const engine = FRAMES[frameStyle].customExport ?? domScreenshotEngine
    return engine(node, opts)
}
