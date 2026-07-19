import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import path from 'path'
import { getTranslations } from 'next-intl/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateImageMetadata() {
    const t = await getTranslations('og')
    return [{ id: 'default', alt: t('imageAlt'), size, contentType }]
}

const geistPath = (weight: string) =>
    path.join(
        process.cwd(),
        'node_modules/geist/dist/fonts/geist-sans/Geist-' + weight + '.ttf',
    )

export default async function Image() {
    const t = await getTranslations('og')
    const [logoBuffer, geistRegular, geistBold] = await Promise.all([
        readFile(path.join(process.cwd(), 'public/images/logo.svg')),
        readFile(geistPath('Regular')),
        readFile(geistPath('Bold')),
    ])

    const logoData =
        'data:image/svg+xml;base64,' + logoBuffer.toString('base64')

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 32,
                    background: '#0a0a0a',
                    color: '#fafafa',
                    padding: 80,
                    fontFamily: 'Geist',
                }}
            >
                <img
                    src={logoData}
                    width={180}
                    height={180}
                />
                <div
                    style={{
                        display: 'flex',
                        fontSize: 128,
                        fontWeight: 700,
                        letterSpacing: -4,
                        lineHeight: 1,
                    }}
                >
                    <span style={{ color: '#fafafa' }}>ROM</span>
                    <span
                        style={{
                            backgroundImage:
                                'linear-gradient(90deg, #ef3862 0%, #3e83cd 100%)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Grid
                    </span>
                </div>
                <span
                    style={{
                        fontSize: 34,
                        fontWeight: 400,
                        color: '#a1a1a1',
                        textAlign: 'center',
                        maxWidth: 900,
                        lineHeight: 1.3,
                    }}
                >
                    {t('tagline')}
                </span>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Geist',
                    data: geistRegular,
                    weight: 400,
                    style: 'normal',
                },
                {
                    name: 'Geist',
                    data: geistBold,
                    weight: 700,
                    style: 'normal',
                },
            ],
        },
    )
}
