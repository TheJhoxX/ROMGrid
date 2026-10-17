'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PencilRuler, Settings, Images } from 'lucide-react'
import { ThemeSelector } from './ThemeSelector'
import { usePathname } from 'next/navigation'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

type NavigationMenuItemType = {
    title: string
    href: string
    icon: React.ReactNode
}

const navigationMenuItems: NavigationMenuItemType[] = [
    {
        title: 'Image Studio',
        href: '/asset-maker/image-studio',
        icon: <Images />,
    },
    {
        title: 'Asset maker',
        href: '/asset-maker',
        icon: <PencilRuler />,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: <Settings />,
    },
]

export const HomeNavigationMenu = () => {
    const pathname = usePathname()
    return (
        <div className='bg-background sticky top-0 z-50 flex w-full items-center justify-between gap-1 px-2 py-1'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href='/'
                        className='hover:bg-muted inline-flex items-center gap-2 rounded-xl px-3 py-1.5'
                    >
                        <Image
                            src='/images/logo.svg'
                            alt='ROMGrid'
                            width={32}
                            height={32}
                        />
                        <p className='font-black tracking-[-0.04em]'>
                            ROM
                            <span className='from-primary to-secondary bg-linear-to-r bg-clip-text text-transparent'>
                                Grid
                            </span>
                        </p>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>{'Home'}</TooltipContent>
            </Tooltip>
            <NavigationMenu className='w-full justify-between rounded-full border px-2 py-1'>
                <NavigationMenuList>
                    {navigationMenuItems.map((item: NavigationMenuItemType) => {
                        const isActive = pathname === item.href
                        return (
                            <Tooltip key={item.title + '-' + item.href}>
                                <TooltipTrigger asChild>
                                    <NavigationMenuItem className='mx-1'>
                                        <NavigationMenuLink
                                            asChild
                                            active={isActive}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                'rounded-full',
                                                'data-active:bg-primary data-active:text-primary-foreground data-active:hover:bg-primary data-active:focus:bg-primary data-active:focus:text-primary-foreground',
                                            )}
                                        >
                                            <Link href={item.href}>
                                                {item.icon}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </NavigationMenuList>
                <ThemeSelector />
            </NavigationMenu>
        </div>
    )
}
