'use client'
import { HexAlphaColorPicker } from 'react-colorful'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type ColorInputProps = {
    value?: string
    onChange?: (value: string) => void
    className?: string
}

function ColorInput({
    value = '#00000000',
    onChange,
    className,
}: ColorInputProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type='button'
                    className={cn(
                        'checkerboard ring-input focus-visible:ring-ring/50 relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-2 focus-visible:ring-3 focus-visible:outline-none',
                        className,
                    )}
                >
                    <div
                        className='absolute inset-0'
                        style={{ backgroundColor: value }}
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-3'>
                <HexAlphaColorPicker
                    color={value}
                    onChange={onChange}
                />
            </PopoverContent>
        </Popover>
    )
}

export { ColorInput }
