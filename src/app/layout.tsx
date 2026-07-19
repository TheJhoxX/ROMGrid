import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { HomeNavigationMenu } from './HomeNavigationMenu'
import { Providers } from './Providers'
import { Analytics } from '@vercel/analytics/next'

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('og')
    return {
        metadataBase: new URL(siteUrl),
        title: 'ROMGrid',
        description: t('description'),
        icons: {
            icon: [
                { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
                { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            ],
            apple: '/apple-touch-icon.png',
        },
        manifest: '/site.webmanifest',
        openGraph: {
            type: 'website',
            url: siteUrl,
            siteName: 'ROMGrid',
            title: t('title'),
            description: t('description'),
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
    }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang='en'
            suppressHydrationWarning
            className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
        >
            <body className='mb-12 flex flex-col'>
                <Providers>
                    <NextIntlClientProvider>
                        <HomeNavigationMenu />
                        {children}
                    </NextIntlClientProvider>
                </Providers>
                <Analytics />
            </body>
        </html>
    )
}
