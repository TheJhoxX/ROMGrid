import type { SGDBImage } from 'steamgriddb'
import type { IconAdjustment } from '@/features/icon-editor/types'

export type AssetMakerStep = 'search' | 'icon' | 'customize'

export type SelectedIcon =
    | { kind: 'sgdb'; image: SGDBImage }
    | { kind: 'custom'; url: string }

export type GameConfig = {
    name: string
    selectedIcon: SelectedIcon | null
    iconAdjustment: IconAdjustment
}

export type ExportState = {
    active: boolean
    current: number
    total: number
    currentName: string
    phase: 'rendering' | 'zipping' | 'success'
}
