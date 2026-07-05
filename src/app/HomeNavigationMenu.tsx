'use client'
import { House, Info, PencilRuler, Settings } from 'lucide-react'
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

type NavigationMenuItemType = {
    title: string
    href: string
    icon: React.ReactNode
}

const navigationMenuItems: NavigationMenuItemType[] = [
    {
        title: 'Home',
        href: '/',
        icon: <House />,
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
        <NavigationMenu className='bg-background/15 fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-xl border p-1 backdrop-blur-md'>
            <NavigationMenuList>
                {navigationMenuItems.map((item: NavigationMenuItemType) => {
                    const isActive = pathname === item.href
                    return (
                        <NavigationMenuItem
                            className='mx-0.5'
                            key={item.title + '-' + item.href}
                        >
                            <NavigationMenuLink
                                asChild
                                active={isActive}
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    'data-active:bg-primary data-active:text-background data-active:hover:bg-primary data-active:focus:bg-primary data-active:focus:text-background',
                                )}
                            >
                                <Link href={item.href}>
                                    {item.title}
                                    {item.icon}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
            <ThemeSelector />
        </NavigationMenu>
    )
}
