import { TunnelGrid } from '@/components/custom/TunnelGrid/TunnelGrid'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Copyright, GitCommitHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function Home() {
    const t = useTranslations('home')

    const renderCartridge = () => (
        <div className='animate-float relative inline-block'>
            <img
                src='/images/logo.svg'
                alt='ROMGrid logo'
                className='h-auto w-sm md:w-md lg:w-lg'
            />
            <Badge
                variant='secondary'
                className='absolute -top-2 -right-2 rotate-12 text-sm font-bold uppercase shadow-md'
            >
                {t('betaBadge')}
            </Badge>
        </div>
    )

    const renderCartridgeShadow = () => (
        <div className='animate-float-shadow -mt-2 h-4 w-3/4 rounded-full bg-black/20 blur-md' />
    )

    return (
        <>
            <div className='relative flex w-full flex-col items-center justify-center'>
                <TunnelGrid className='absolute inset-0 h-full w-full' />
                <div className='relative z-10 flex flex-col justify-center'>
                    <div className='flex flex-col items-center justify-center gap-12'>
                        {renderCartridge()}
                        {renderCartridgeShadow()}
                    </div>
                </div>
            </div>
            <div className='mb-4 grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-2'>
                {/* What is ROMGrid? */}
                <Card className='transition-all duration-300 ease-in-out hover:-translate-y-1.5'>
                    <CardHeader>
                        <CardTitle>{t('whatIs.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2'>
                        <CardDescription>{t('whatIs.intro')}</CardDescription>
                        <CardDescription>
                            {t('whatIs.framesIntro')}{' '}
                            <strong className='text-foreground font-semibold'>
                                {t('whatIs.framesTerm')}
                            </strong>
                            {t('whatIs.framesBody')}
                        </CardDescription>
                    </CardContent>
                </Card>

                {/* Asset generation */}
                <Card className='transition-all duration-300 ease-in-out hover:-translate-y-1.5'>
                    <CardHeader>
                        <CardTitle>{t('iconGen.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            <p>{t('iconGen.intro')}</p>
                            <ul className='my-2 list-inside list-disc space-y-1'>
                                <li>{t('iconGen.items.steamgrid')}</li>
                                <li>{t('iconGen.items.borders')}</li>
                                <li>{t('iconGen.items.batch')}</li>
                            </ul>
                        </CardDescription>
                    </CardContent>
                </Card>

                {/* Community themes */}
                <Card className='transition-all duration-300 ease-in-out hover:-translate-y-1.5'>
                    <CardHeader>
                        <CardTitle>{t('community.title')}</CardTitle>
                        <CardAction className='border-chart-1 bg-muted text-muted-foreground flex items-center gap-2 rounded-full border px-2 py-1 font-bold'>
                            <p>{t('community.comingSoon')}</p>
                            <span>👀</span>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            <p>{t('community.intro')}</p>
                            <ul className='my-2 list-inside list-disc space-y-1'>
                                <li>{t('community.items.upload')}</li>
                                <li>{t('community.items.browse')}</li>
                                <li>{t('community.items.rate')}</li>
                            </ul>
                        </CardDescription>
                    </CardContent>
                </Card>

                {/* Support */}
                <Card className='transition-all duration-300 ease-in-out hover:-translate-y-1.5'>
                    <CardHeader>
                        <CardTitle>{t('support.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            <p>{t('support.intro')}</p>
                            <ul className='my-2 list-inside list-disc space-y-1'>
                                <li>{t('support.items.bugs')}</li>
                                <li>{t('support.items.code')}</li>
                                <li>{t('support.items.donate')}</li>
                            </ul>
                            <p>{t('support.github')}</p>
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Link
                            href='https://github.com/TheJhoxX/ROMGrid.git'
                            target='_blank'
                            className='text-accent bg-accent-foreground flex items-center gap-2 rounded-lg px-2 py-1'
                        >
                            <GitCommitHorizontal />
                            <p>{t('support.visitRepository')}</p>
                        </Link>
                    </CardFooter>
                </Card>

                <Card className='transition-all duration-300 ease-in-out hover:-translate-y-1.5 md:col-span-2'>
                    <CardHeader>
                        <CardTitle>{t('follow.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            <p>{t('follow.p1')}</p>
                            <p className='mt-2'>{t('follow.p2')}</p>
                            <p className='mt-2 font-semibold'>
                                {t('follow.p3')}
                            </p>
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
            <div className='text-muted-foreground flex items-center justify-end gap-2 p-4 text-xs'>
                <Copyright className='h-4 w-4' />
                <p>{t('copyright')}</p>
            </div>
        </>
    )
}
