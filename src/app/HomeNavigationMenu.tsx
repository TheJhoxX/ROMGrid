'use client'
import { PencilRuler, Settings } from 'lucide-react'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeSelector } from './ThemeSelector'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import Image from 'next/image'

type NavigationMenuItemType = {
    title: string
    href: string
    icon: React.ReactNode
}

const navigationMenuItems: NavigationMenuItemType[] = [
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
        <div className='bg-background/15 sticky flex w-full items-center justify-between gap-1 border-b px-2 py-1 backdrop-blur-md'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href='/'
                        className='hover:bg-muted inline-flex items-center gap-2 rounded-xl px-2 py-1'
                    >
                        <Image
                            src='/images/logo.svg'
                            alt='logo'
                            width={32}
                            height={32}
                        />
                        <p className='font-bold'>ROMGrid</p>
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
                                                'data-active:bg-primary data-active:text-background data-active:hover:bg-primary data-active:focus:bg-primary data-active:focus:text-background',
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
