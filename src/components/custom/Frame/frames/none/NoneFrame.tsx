import { IconLayer } from '../../IconLayer'
import type { FrameComponent } from '../../types'

export const NoneFrame: FrameComponent = ({ icon }) => (
    <div className='relative h-full w-full overflow-hidden'>
        <IconLayer icon={icon} />
    </div>
)
