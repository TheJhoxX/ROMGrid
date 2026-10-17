import { Button } from '@/components/ui/button'
import { X, type LucideIcon } from 'lucide-react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'

export const PanelDrawer = ({
    title,
    description,
    Icon,
    open,
    onOpenChange,
    children,
}: {
    title: string
    description?: string
    Icon: LucideIcon
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}) => (
    <Drawer
        modal={false}
        open={open}
        onOpenChange={onOpenChange}
    >
        <DrawerTrigger asChild>
            <Button
                variant='outline'
                className='w-full'
            >
                <Icon />
                {title}
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader className='flex flex-row items-start justify-between gap-4'>
                <div className='flex flex-col gap-0.5 text-left'>
                    <DrawerTitle>{title}</DrawerTitle>
                    {description && (
                        <DrawerDescription>{description}</DrawerDescription>
                    )}
                </div>
                <DrawerClose asChild>
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Close'
                    >
                        <X />
                    </Button>
                </DrawerClose>
            </DrawerHeader>
            <div className='overflow-y-auto px-4 pb-6'>{children}</div>
        </DrawerContent>
    </Drawer>
)
