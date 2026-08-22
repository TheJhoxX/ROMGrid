import { IconLayer } from '../../IconLayer'
import type { FrameComponent } from '../../types'

export const ThreeDSFrame: FrameComponent = ({ icon }) => (
    <div className='@container h-full w-full'>
        <div
            className='relative h-full w-full overflow-hidden rounded-[15%] bg-linear-to-b from-white from-90% to-[#B2B2B2] ring-[0.2cqw] ring-[#E3E3E3]'
            style={{
                boxShadow: 'inset 0 -3px 1cqw 1cqw rgba(0,0,0,0.2)',
            }}
        >
            <div
                className='absolute inset-[16cqw] overflow-hidden rounded-[8%] bg-[#ebebeb]'
                style={{
                    boxShadow: '0 0 2cqw 2.5cqw rgba(0,0,0,0.15)',
                }}
            >
                <IconLayer icon={icon} />
            </div>
        </div>
    </div>
)
