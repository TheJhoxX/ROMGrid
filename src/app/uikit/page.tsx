import { Frame } from '@/components/custom/Frame/Frame'
import Image from 'next/image'

const UiKitPage = () => {
    return (
        <div className='space-y-2'>
            <p className='text-2xl font-bold'>ThreeDSFrame</p>
            <div className='h-128 w-128'>
                <Frame style='3ds'>
                    <div className='absolute inset-0 flex h-full w-full items-center justify-center'>
                        <Image
                            src={'/images/ie.jpg'}
                            alt=''
                            fill
                            className='object-cover'
                        />
                    </div>
                </Frame>
            </div>
        </div>
    )
}

export default UiKitPage
