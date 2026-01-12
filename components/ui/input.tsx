import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon } from './icon'

const inputVariants = cva(
    'w-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                default:
                    'bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#324467] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 dark:placeholder:text-text-muted text-gray-900 dark:text-white',
                glass:
                    'bg-white/5 backdrop-blur-md border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-white/40 text-white',
                search:
                    'bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#3b4354] rounded-full focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 dark:placeholder:text-text-muted text-gray-900 dark:text-white',
            },
            inputSize: {
                sm: 'h-9 px-3 text-sm',
                md: 'h-11 px-4 text-sm',
                lg: 'h-12 px-4 text-base',
                xl: 'h-14 px-5 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            inputSize: 'md',
        },
    }
)

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    label?: string
    error?: string
    hint?: string
    leftIcon?: string
    rightIcon?: string
    onRightIconClick?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            variant,
            inputSize,
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            onRightIconClick,
            type = 'text',
            ...props
        },
        ref
    ) => {
        const id = React.useId()
        const inputId = (props as any).id || id

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-text-muted pointer-events-none">
                            <Icon name={leftIcon} size="md" />
                        </div>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(inputVariants({ variant, inputSize }), className)}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <button
                            type="button"
                            onClick={onRightIconClick}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-white transition-colors"
                        >
                            <Icon name={rightIcon} size="md" />
                        </button>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                        <Icon name="error" size="xs" />
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="mt-1.5 text-sm text-gray-500 dark:text-text-muted">{hint}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input, inputVariants }
