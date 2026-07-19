import { Frame } from '@/components/custom/Frame/Frame'

const UiKitPage = () => {
    return (
        <div className='space-y-2'>
            <p className='text-2xl font-bold'>ThreeDSFrame</p>
            <div className='h-128 w-128'>
                <Frame
                    style='3ds'
                    icon={{
                        src: '/images/ie.jpg',
                        alt: '',
                        backgroundColor: 'transparent',
                        borderRadius: 0,
                    }}
                />
            </div>
        </div>
    )
}

export default UiKitPage
