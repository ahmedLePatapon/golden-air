import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from './icon'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30',
        secondary:
          'bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 hover:border-white/20',
        outline:
          'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-primary hover:text-primary/80 hover:bg-primary/5',
        link: 'text-primary underline-offset-4 hover:underline',
        icon: 'bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary',
        'icon-ghost':
          'text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-lg',
        md: 'h-11 px-6 text-sm rounded-lg',
        lg: 'h-12 px-8 text-base rounded-lg',
        xl: 'h-14 px-10 text-base rounded-xl',
        icon: 'h-10 w-10 rounded-full inline-flex items-center justify-center',
        'icon-sm': 'h-8 w-8 rounded-full inline-flex items-center justify-center',
        'icon-lg': 'h-12 w-12 rounded-full inline-flex items-center justify-center',
      },
      rounded: {
        default: '',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: IconName
  rightIcon?: IconName
  iconSize?: 'xs' | 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      leftIcon,
      rightIcon,
      iconSize = 'sm',
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isIconOnly = size === 'icon' || size === 'icon-sm' || size === 'icon-lg'

    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin">
            <Icon name="autorenew" size={iconSize} />
          </span>
        ) : (
          <>
            {leftIcon && !isIconOnly && <Icon name={leftIcon} size={iconSize} />}
            {children}
            {rightIcon && !isIconOnly && (
              <Icon name={rightIcon} size={iconSize} />
            )}
            {isIconOnly && leftIcon && <Icon name={leftIcon} size={iconSize} />}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
