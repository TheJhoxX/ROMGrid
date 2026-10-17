'use client'

import { SearchStep } from './components/search-step/SearchStep'
import { IconStep } from './components/icon-step/IconStep'
import { CustomizeStep } from './components/customize-step/CustomizeStep'
import { AssetMakerHeader } from './components/AssetMakerHeader'
import { ExportProgressDialog } from './components/ExportProgressDialog'
import { ExportIcons } from './components/ExportIcons'
import { useAssetMaker } from './hooks/useAssetMaker'
import { useAssetExport } from './hooks/useAssetExport'
import { STEP_ACTIONS, STEP_ORDER } from './steps'

export default function AssetMaker() {
    const {
        currentStep,
        selectedGames,
        handleFirstStepGameClick,
        handleSelectIcon,
        handleClearGames,
        handleClearIcon,
        handleUpdateIconAdjustment,
        handleChangeStep,
    } = useAssetMaker()
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
            return (
                <SearchStep
                    onGameClick={handleFirstStepGameClick}
                    selectedGames={selectedGames}
                    onClearGames={handleClearGames}
                />
            )
        }
        if (currentStep === 'icon') {
            return (
                <IconStep
                    selectedGames={selectedGames}
                    onSelectIcon={handleSelectIcon}
                    onClearIcon={handleClearIcon}
                />
            )
        }
        if (currentStep === 'customize') {
            return (
                <CustomizeStep
                    selectedGames={selectedGames}
                    onUpdateIconAdjustment={handleUpdateIconAdjustment}
                />
            )
        }
    }

    return (
        <div className='flex w-full flex-col items-center gap-2'>
            <div className='bg-background sticky top-13.5 z-20 flex w-full flex-col gap-2 px-6 py-3'>
                <AssetMakerHeader
                    currentStep={currentStep}
                    disabled={
                        !STEP_ACTIONS[currentStep].canRun(selectedGames) ||
                        exportState.active
                    }
                    onChangeStep={handleChangeStep}
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
