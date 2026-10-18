'use client'

import { useCallback, useRef, useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { exportFramedIcon } from '@/features/icon-editor/frames/export'
import type { ExportState, GameConfig } from '../types'

export function useAssetExport(selectedGames: Map<number, GameConfig>) {
    const exportNodes = useRef<Map<number, HTMLDivElement>>(new Map())
    const [exportState, setExportState] = useState<ExportState>({
        active: false,
        current: 0,
        total: 0,
        currentName: '',
        phase: 'rendering',
    })

    const handleExportAll = useCallback(async () => {
        const exportable = [...selectedGames.entries()].filter(
            ([, g]) => g.selectedIcon,
        )
        setExportState({
            active: true,
            current: 0,
            total: exportable.length,
            currentName: '',
            phase: 'rendering',
        })
        try {
            const zip = new JSZip()
            for (let i = 0; i < exportable.length; i++) {
                const [gameId, game] = exportable[i]
                setExportState((s) => ({
                    ...s,
                    current: i,
                    currentName: game.name,
                    phase: 'rendering',
                }))
                const node = exportNodes.current.get(gameId)
                if (!node) continue
                const { width, height, frameStyle } = game.iconAdjustment
                const blob = await exportFramedIcon(node, frameStyle, {
                    width,
                    height,
                })
                zip.file(`${game.name}.png`, blob)
            }
            setExportState((s) => ({
                ...s,
                current: exportable.length,
                phase: 'zipping',
            }))
            const zipBlob = await zip.generateAsync({ type: 'blob' })
            saveAs(zipBlob, 'romgrid-icons.zip')
            setExportState((s) => ({ ...s, phase: 'success' }))
        } catch {
            setExportState((s) => ({ ...s, active: false }))
        }
    }, [selectedGames])

    const handleCloseExportDialog = useCallback(() => {
        setExportState((s) => ({ ...s, active: false }))
    }, [])

    return {
        exportNodes,
        exportState,
        handleExportAll,
        handleCloseExportDialog,
    }
}
