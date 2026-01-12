import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('overflow-hidden transition-all duration-300', {
    variants: {
        variant: {
            default: 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl',
            glass: 'bg-white/5 dark:bg-[#1c1f27]/60 backdrop-blur-xl border border-white/10 rounded-2xl',
            elevated: 'bg-white dark:bg-surface-dark rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-[#232f48]',
            feature: 'bg-gray-50 dark:bg-[#1a2230] rounded-2xl border border-gray-200 dark:border-white/5 hover:border-primary/30 group',
            image: 'rounded-2xl group cursor-pointer',
        },
        hover: {
            none: '',
            lift: 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10',
            glow: 'hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/20',
            scale: 'hover:scale-[1.02]',
        },
        padding: {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
            xl: 'p-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        hover: 'none',
        padding: 'none',
    },
})

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, hover, padding, ...props }, ref) => {
    return <div ref={ref} className={cn(cardVariants({ variant, hover, padding }), className)} {...props} />
})
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-xl font-bold leading-tight text-gray-900 dark:text-white', className)} {...props} />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500 dark:text-text-muted', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'

interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
    src: string
    alt: string
    aspectRatio?: 'square' | 'video' | 'portrait' | 'wide'
    overlay?: boolean
    overlayPosition?: 'bottom' | 'full'
}

const aspectRatioClasses: Record<string, string> = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[4/3]',
}

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(({ className, src, alt, aspectRatio = 'video', overlay = false, overlayPosition = 'bottom', children, ...props }, ref) => {
    return (
        <div ref={ref} className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio], className)} {...props}>
            <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            {overlay && <div className={cn('absolute inset-0')} />}
            {children && <div className="absolute inset-0 flex flex-col justify-end p-4">{children}</div>}
        </div>
    )
})
CardImage.displayName = 'CardImage'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage, cardVariants }
