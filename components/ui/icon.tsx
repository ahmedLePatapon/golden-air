import { cn } from '@/lib/utils'

export type IconName =
    | 'diamond'
    | 'menu'
    | 'close'
    | 'search'
    | 'arrow_forward'
    | 'arrow_back'
    | 'restaurant'
    | 'concierge'
    | 'spa'
    | 'airport_shuttle'
    | 'sports_tennis'
    | 'fitness_center'
    | 'hiking'
    | 'downhill_skiing'
    | 'directions_bike'
    | 'pool'
    | 'self_improvement'
    | 'grass'
    | 'hot_tub'
    | 'favorite'
    | 'favorite_border'
    | 'star'
    | 'play_circle'
    | 'location_on'
    | 'calendar_month'
    | 'group'
    | 'verified'
    | 'lock'
    | 'chat'
    | 'check_circle'
    | 'email'
    | 'phone'
    | 'schedule'
    | 'king_bed'
    | 'bathtub'
    | 'wifi'
    | 'local_parking'
    | 'ac_unit'
    | 'kitchen'
    | 'yard'
    | 'pets'
    | 'smoke_free'
    | 'chevron_right'
    | 'chevron_left'
    | 'expand_more'
    | 'expand_less'
    | 'tune'
    | 'sort'
    | 'grid_view'
    | 'view_list'
    | 'add'
    | 'remove'
    | 'dark_mode'
    | 'light_mode'
    | 'send'
    | 'auto_awesome'
    | 'format_quote'

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

interface IconProps {
    name: IconName | string
    size?: IconSize
    filled?: boolean
    className?: string
}

const sizeClasses: Record<IconSize, string> = {
    xs: 'text-[14px]',
    sm: 'text-[16px]',
    md: 'text-[20px]',
    lg: 'text-[24px]',
    xl: 'text-[28px]',
    '2xl': 'text-[32px]',
    '3xl': 'text-[40px]',
    '4xl': 'text-[48px]',
}

export function Icon({ name, size = 'md', filled = false, className }: IconProps) {
    return (
        <span
            className={cn('material-symbols-outlined select-none', sizeClasses[size], className)}
            style={{
                fontVariationSettings: filled
                    ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                    : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
            }}
        >
            {name}
        </span>
    )
}

export default Icon
