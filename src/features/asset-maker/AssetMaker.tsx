'use client'

import { SearchStep } from './components/search-step/SearchStep'
import { IconStep } from './components/icon-step/IconStep'
import { CustomizeStep } from './components/customize-step/CustomizeStep'
import { AssetMakerHeader } from './components/AssetMakerHeader'
import { ExportProgressDialog } from './components/ExportProgressDialog'
import { ExportIcons } from './components/ExportIcons'
import { AssetMakerProvider, useAssetMaker } from './AssetMakerContext'
import { useAssetExport } from './hooks/useAssetExport'
import { STEP_ACTIONS, STEP_ORDER } from './steps'

export default function AssetMaker() {
    return (
        <AssetMakerProvider>
            <AssetMakerContent />
        </AssetMakerProvider>
    )
}

function AssetMakerContent() {
    const { currentStep, selectedGames, handleChangeStep } = useAssetMaker()
    const {
        exportNodes,
        exportState,
        handleExportAll,
        handleCloseExportDialog,
    } = useAssetExport(selectedGames)

    const handleAction = () => {
        if (currentStep === 'customize') {
            void handleExportAll()
            return
        }
        const next = STEP_ORDER[STEP_ORDER.indexOf(currentStep) + 1]
        if (next) handleChangeStep(next)
    }

    const content = () => {
        if (currentStep === 'search') {
            return <SearchStep />
        }
        if (currentStep === 'icon') {
            return <IconStep />
        }
        if (currentStep === 'customize') {
            return <CustomizeStep />
        }
    }

    return (
        <div className='flex w-full flex-col items-center gap-2'>
            <div className='bg-background sticky top-13.5 z-20 flex w-full flex-col gap-2 px-6 py-3'>
                <AssetMakerHeader
                    disabled={
                        !STEP_ACTIONS[currentStep].canRun(selectedGames) ||
                        exportState.active
                    }
                    onAction={handleAction}
                />
            </div>
            <div className='w-full px-6'>{content()}</div>
            <ExportProgressDialog
                state={exportState}
                onClose={handleCloseExportDialog}
            />
            <ExportIcons
                selectedGames={selectedGames}
                exportNodes={exportNodes}
            />
        </div>
    )
}
