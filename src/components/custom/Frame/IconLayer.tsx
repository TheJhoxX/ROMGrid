import Image from 'next/image'
import type { FrameIcon } from './types'

export const IconLayer = ({ icon }: { icon: FrameIcon }) => {
    if (!icon) return null
    const {
        src,
        alt,
        backgroundColor,
        borderRadius,
        priority,
        loading,
        sizes,
    } = icon
    return (
        <div
            className='absolute inset-0 overflow-hidden'
            style={{ borderRadius: `${borderRadius}%` }}
        >
            <div
                className='absolute inset-0'
                style={{ backgroundColor }}
            />
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                loading={loading}
                className='object-cover'
            />
        </div>
    )
}
