import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from './icon'

const badgeVariants = cva('inline-flex items-center gap-1.5 font-bold uppercase tracking-widest', {
  variants: {
    variant: {
      default: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
      primary: 'bg-primary/80 backdrop-blur-md text-white',
      gold: 'bg-gold-accent/20 text-gold-accent border border-gold-accent/30',
      success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      tag: 'bg-black/50 backdrop-blur-md text-white border border-white/10 normal-case tracking-normal',
      label: 'bg-primary/20 text-primary normal-case tracking-normal',
      outline: 'bg-transparent border border-white/30 text-white backdrop-blur-sm',
      solid: 'bg-surface-dark text-white border border-white/5',
    },
    size: {
      xs: 'text-[9px] px-2 py-0.5 rounded',
      sm: 'text-[10px] px-2.5 py-1 rounded-md',
      md: 'text-[10px] px-3 py-1.5 rounded-full',
      lg: 'text-xs px-4 py-2 rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  icon?: IconName | string
  iconPosition?: 'left' | 'right'
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, size, icon, iconPosition = 'left', children, ...props }, ref) => {
  return (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && iconPosition === 'left' && <Icon name={icon} size="xs" />}
      {children}
      {icon && iconPosition === 'right' && <Icon name={icon} size="xs" />}
    </span>
  )
})

Badge.displayName = 'Badge'

const ExclusiveBadge = React.forwardRef<HTMLSpanElement, Omit<BadgeProps, 'variant' | 'children'>>((props, ref) => (
  <Badge ref={ref} variant="default" icon="auto_awesome" {...props}>
    Exclusif
  </Badge>
))
ExclusiveBadge.displayName = 'ExclusiveBadge'

const BestsellerBadge = React.forwardRef<HTMLSpanElement, Omit<BadgeProps, 'variant' | 'children'>>((props, ref) => (
  <Badge ref={ref} variant="primary" icon="star" {...props}>
    Meilleure Vente
  </Badge>
))
BestsellerBadge.displayName = 'BestsellerBadge'

const NewBadge = React.forwardRef<HTMLSpanElement, Omit<BadgeProps, 'variant' | 'children'>>((props, ref) => (
  <Badge ref={ref} variant="gold" {...props}>
    Nouveau
  </Badge>
))
NewBadge.displayName = 'NewBadge'

const VerifiedBadge = React.forwardRef<HTMLSpanElement, Omit<BadgeProps, 'variant' | 'children'>>((props, ref) => (
  <Badge ref={ref} variant="success" icon="verified" {...props}>
    Vérifié
  </Badge>
))
VerifiedBadge.displayName = 'VerifiedBadge'

export { Badge, badgeVariants, ExclusiveBadge, BestsellerBadge, NewBadge, VerifiedBadge }
