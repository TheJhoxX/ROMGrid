import { IconLayer } from '../../IconLayer'
import type { FrameComponent } from '../../types'

export const DSIFrame: FrameComponent = ({ icon }) => (
    <div className='@container flex h-full w-full items-start justify-center'>
        <div className='relative w-[90cqw]'>
            <svg
                className='pointer-events-none absolute inset-x-0 top-[92%] h-[15.3cqw] w-full'
                viewBox='2.7 0 94.6 12'
                preserveAspectRatio='none'
                aria-hidden='true'
            >
                <path
                    d='M 4,0 L 96,0 Q 98,0 96.9,1.7 L 92.2,8.7 Q 90,12 86,12 L 14,12 Q 10,12 7.8,8.7 L 3.1,1.7 Q 2,0 4,0 Z'
                    fill='#C2C2C2'
                />
            </svg>
            <div
                className='@container relative aspect-square overflow-hidden rounded-[8%] border-[0.4cqw] border-[#C2C2C2CC]/70 bg-white'
                style={{
                    boxShadow: 'inset 0 0 2cqw 0.5cqw rgba(0,0,0,0.1)',
                }}
            >
                <div
                    className='absolute inset-[8cqw] rounded-[6%] bg-[#E7E7E7]'
                    style={{
                        boxShadow:
                            'inset 0 0 2cqw 0.5cqw rgba(255,255,255,0.2)',
                    }}
                >
                    <div className='absolute inset-[9cqw] overflow-hidden'>
                        <IconLayer icon={icon} />
                    </div>
                </div>
            </div>
        </div>
    </div>
)
