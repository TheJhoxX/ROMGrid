import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { HomeNavigationMenu } from './HomeNavigationMenu'
import { Providers } from './Providers'
import { Analytics } from '@vercel/analytics/next'

const geistSans = Geist({
    variable: '--font-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')

const siteDescription =
    'Generate icons for your ROMs styled like real console assets. Frame-based, batch export, runs in your browser.'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'ROMGrid',
    description: siteDescription,
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
        title: 'ROMGrid — ROM icon generator',
        description: siteDescription,
    },
    twitter: {
        card: 'summary',
        title: 'ROMGrid — ROM icon generator',
        description: siteDescription,
    },
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
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
