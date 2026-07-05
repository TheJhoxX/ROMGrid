import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const

export function useBreakpoint() {
    const [width, setWidth] = useState(768)
    const [debouncedWidth] = useDebounce(width, 150)

    useEffect(() => {
        setWidth(window.innerWidth)
        const onResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    return {
        isAtLeastSm: debouncedWidth >= BREAKPOINTS.sm,
        isAtLeastMd: debouncedWidth >= BREAKPOINTS.md,
        isAtLeastLg: debouncedWidth >= BREAKPOINTS.lg,
        isAtLeastXl: debouncedWidth >= BREAKPOINTS.xl,
    }
}
