import { cn } from '@/lib/utils'

type TunnelGridProps = {
    className?: string
    strokeColor?: string
}

export const TunnelGrid = ({
    strokeColor = 'var(--color-muted-foreground)',
    className,
}: TunnelGridProps) => {
    return (
        <svg
            className={cn('absolute inset-0 h-full w-full', className)}
            viewBox='0 0 680 480'
            preserveAspectRatio='xMidYMid slice'
            xmlns='http://www.w3.org/2000/svg'
        >
            <defs>
                <radialGradient
                    id='fade-c2'
                    cx='50%'
                    cy='50%'
                    r='50%'
                >
                    <stop
                        offset='0%'
                        stopColor='black'
                        stopOpacity='1'
                    />
                    <stop
                        offset='55%'
                        stopColor='black'
                        stopOpacity='0.9'
                    />
                    <stop
                        offset='100%'
                        stopColor='black'
                        stopOpacity='0'
                    />
                </radialGradient>
                <radialGradient
                    id='fade-e2'
                    cx='50%'
                    cy='50%'
                    r='50%'
                >
                    <stop
                        offset='0%'
                        stopColor='black'
                        stopOpacity='0'
                    />
                    <stop
                        offset='75%'
                        stopColor='black'
                        stopOpacity='0'
                    />
                    <stop
                        offset='100%'
                        stopColor='black'
                        stopOpacity='1'
                    />
                </radialGradient>
                <mask id='mc2'>
                    <rect
                        width='680'
                        height='480'
                        fill='white'
                    />
                    <rect
                        width='680'
                        height='480'
                        fill='url(#fade-c2)'
                    />
                </mask>
                <mask id='me2'>
                    <rect
                        width='680'
                        height='480'
                        fill='white'
                    />
                    <rect
                        width='680'
                        height='480'
                        fill='url(#fade-e2)'
                    />
                </mask>
            </defs>

            <g mask='url(#me2)'>
                <g
                    mask='url(#mc2)'
                    stroke={strokeColor}
                    strokeWidth='0.7'
                    opacity='0.8'
                    fill='none'
                >
                    {/* líneas techo */}
                    {[0, 113, 226, 340, 454, 567, 680].map((x) => (
                        <line
                            key={`t${x}`}
                            x1='340'
                            y1='240'
                            x2={x}
                            y2='0'
                        />
                    ))}
                    {/* líneas suelo */}
                    {[0, 113, 226, 340, 454, 567, 680].map((x) => (
                        <line
                            key={`b${x}`}
                            x1='340'
                            y1='240'
                            x2={x}
                            y2='480'
                        />
                    ))}
                    {/* pared izquierda */}
                    {[0, 80, 160, 240, 320, 400, 480].map((y) => (
                        <line
                            key={`l${y}`}
                            x1='340'
                            y1='240'
                            x2='0'
                            y2={y}
                        />
                    ))}
                    {/* pared derecha */}
                    {[0, 80, 160, 240, 320, 400, 480].map((y) => (
                        <line
                            key={`r${y}`}
                            x1='340'
                            y1='240'
                            x2='680'
                            y2={y}
                        />
                    ))}
                    {/* anillos */}
                    <rect
                        x='60'
                        y='43'
                        width='560'
                        height='394'
                    />
                    <rect
                        x='120'
                        y='85'
                        width='440'
                        height='310'
                    />
                    <rect
                        x='180'
                        y='128'
                        width='320'
                        height='224'
                    />
                    <rect
                        x='240'
                        y='170'
                        width='200'
                        height='140'
                    />
                    <rect
                        x='290'
                        y='200'
                        width='100'
                        height='80'
                    />
                </g>
            </g>
        </svg>
    )
}
