import { getTranslations } from 'next-intl/server'
import { CONSOLE_FRAME_STYLES, Frame } from '@/components/custom/Frame/Frame'

const UiKitPage = async () => {
    const t = await getTranslations('assetMaker.steps.customize.frames')

    return (
        <div className='flex flex-col gap-12'>
            {CONSOLE_FRAME_STYLES.map((style) => (
                <section
                    key={style}
                    className='flex flex-col gap-4'
                >
                    <div className='flex flex-col gap-0.5'>
                        <h2 className='text-2xl font-bold'>
                            {t(`${style}.title`)}
                        </h2>
                        <p className='text-muted-foreground text-sm'>
                            {t(`${style}.description`)}
                        </p>
                    </div>
                    <div className='h-128 w-128 self-center'>
                        <Frame
                            style={style}
                            icon={{
                                src: '/images/ie.jpg',
                                alt: '',
                                backgroundColor: 'transparent',
                                borderRadius: 0,
                            }}
                        />
                    </div>
                </section>
            ))}
        </div>
    )
}

export default UiKitPage
