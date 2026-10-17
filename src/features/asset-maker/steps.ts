import { ArrowBigRight, SaveAllIcon, type LucideIcon } from 'lucide-react'
import type { AssetMakerStep, GameConfig } from './types'

export const STEP_ORDER: AssetMakerStep[] = ['search', 'icon', 'customize']

type StepActionConfig = {
    labelKey: string
    Icon: LucideIcon
    canRun: (games: Map<number, GameConfig>) => boolean
}

export const STEP_ACTIONS: Record<AssetMakerStep, StepActionConfig> = {
    search: {
        labelKey: 'continueButtonLabel',
        Icon: ArrowBigRight,
        canRun: (games) => games.size > 0,
    },
    icon: {
        labelKey: 'continueButtonLabel',
        Icon: ArrowBigRight,
        canRun: (games) =>
            games.size > 0 &&
            [...games.values()].every((g) => g.selectedIcon !== null),
    },
    customize: {
        labelKey: 'steps.customize.export',
        Icon: SaveAllIcon,
        canRun: (games) =>
            [...games.values()].some((g) => g.selectedIcon !== null),
    },
}
