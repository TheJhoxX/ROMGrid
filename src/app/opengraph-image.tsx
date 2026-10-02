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
    const [logoBuffer, geistRegular, geistBold, geistBlack] = await Promise.all(
        [
            readFile(path.join(process.cwd(), 'public/images/logo.svg')),
            readFile(geistPath('Regular')),
            readFile(geistPath('Bold')),
            readFile(geistPath('Black')),
        ],
    )

    const logoData =
        'data:image/svg+xml;base64,' + logoBuffer.toString('base64')

    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 70,
                background: '#F6F7FA',
                color: '#1F2839',
                padding: 80,
                fontFamily: 'Geist',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    width: 420,
                    height: 420,
                    borderRadius: 210,
                    left: -140,
                    top: -180,
                    background:
                        'linear-gradient(135deg, rgba(239,83,120,.24), rgba(82,154,214,.18))',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: 520,
                    height: 520,
                    borderRadius: 260,
                    right: -250,
                    bottom: -320,
                    background:
                        'linear-gradient(135deg, rgba(82,154,214,.20), rgba(239,83,120,.18))',
                }}
            />
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 330,
                    height: 330,
                    borderRadius: 64,
                    background: '#FFFFFF',
                    boxShadow: '0 28px 80px rgba(31,40,57,.16)',
                }}
            >
                <img
                    src={logoData}
                    alt='ROMGrid symbol'
                    width={270}
                    height={270}
                />
            </div>
            <div
                style={{
                    width: 650,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 18,
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 118,
                            fontWeight: 900,
                            letterSpacing: -7,
                            lineHeight: 1,
                        }}
                    >
                        <span>ROM</span>
                        <span
                            style={{
                                backgroundImage:
                                    'linear-gradient(90deg, #EF5378 0%, #529AD6 100%)',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            Grid
                        </span>
                    </div>
                    <span
                        style={{
                            display: 'flex',
                            borderRadius: 999,
                            background: '#1F2839',
                            color: '#FFFFFF',
                            padding: '10px 18px',
                            fontSize: 22,
                            fontWeight: 700,
                            letterSpacing: 2,
                        }}
                    >
                        BETA
                    </span>
                </div>
                <span
                    style={{
                        fontSize: 40,
                        fontWeight: 400,
                        color: '#667085',
                        lineHeight: 1.25,
                    }}
                >
                    {t('tagline')}
                </span>
                <span
                    style={{
                        marginTop: 32,
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#1F2839',
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                    }}
                >
                    Your whole library. One pass.
                </span>
            </div>
        </div>,
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
                {
                    name: 'Geist',
                    data: geistBlack,
                    weight: 900,
                    style: 'normal',
                },
            ],
        },
    )
}
