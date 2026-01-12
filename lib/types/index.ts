/**
 * Types pour l'application Golden Air
 */

// ========================================
// STAY TYPES
// ========================================

export type BadgeType = 'exclusive' | 'new' | 'best-seller' | 'all-inclusive'

export type PriceType = 'per_night' | 'total'

export interface ItineraryDay {
    day: number
    title: string
    description: string
    activities?: string[]
}

export interface Accommodation {
    name: string
    category?: string
    description?: string
    roomType?: string
}

export interface Host {
    name: string
    role: string
    image: string
    description: string
    languages?: string[]
    isOnline?: boolean
}

export interface Review {
    id: string
    author: string
    avatar?: string
    rating: number
    date: string
    comment: string
    stayTitle?: string
}

export interface Stay {
    // Identifiers
    id: string
    slug: string

    // Basic info
    title: string
    subtitle?: string
    location: string
    country: string
    region?: string

    // Pricing
    price: number
    priceType: PriceType
    originalPrice?: number

    // Duration & capacity
    duration: string
    guests: number
    bedrooms?: number
    beds?: number
    bathrooms?: number

    // Media
    image: string
    gallery: string[]

    // Rating & reviews
    rating: number
    reviewCount: number

    // Categorization
    badge?: BadgeType
    tags?: string[]
    category?: 'villa' | 'chalet' | 'resort' | 'yacht' | 'apartment'

    // Features
    services: string[]
    amenities: string[]
    sports: string[]
    wellness: string[]

    // Content
    description: string
    shortDescription?: string
    highlights: string[]

    // Details
    itinerary: ItineraryDay[]
    accommodation: Accommodation
    host?: Host
    reviews?: Review[]

    // Metadata
    featured?: boolean
    createdAt?: string
    updatedAt?: string
}

// ========================================
// FILTER TYPES
// ========================================

export interface FilterState {
    priceRange: [number, number]
    destinations: string[]
    durations: string[]
    experiences: string[]
    sports: string[]
    wellness: string[]
    amenities: string[]
    sortBy: SortOption
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

// ========================================
// FORM TYPES
// ========================================

export interface ContactFormData {
    firstName: string
    lastName: string
    email: string
    phone?: string
    destination?: string
    departureDate?: string
    returnDate?: string
    travelers: number
    services: string[]
    message: string
    budget?: string
}

export interface QuoteFormData {
    // Step 1: Objective
    objective: 'relaxation' | 'celebration' | 'exploration' | 'sport' | 'wellness'

    // Step 2: Preferences
    preferences: string[]
    accommodationType?: string

    // Step 3: Dates & Guests
    departureDate: string
    returnDate: string
    adults: number
    children: number

    // Step 4: Details
    specialRequests?: string
    budget?: 'standard' | 'premium' | 'luxury' | 'ultra-luxury'
    contactEmail: string
    contactPhone?: string
}

// ========================================
// SEARCH TYPES
// ========================================

export interface SearchParams {
    destination?: string
    checkIn?: string
    checkOut?: string
    guests?: number
}

// ========================================
// UI TYPES
// ========================================

export interface NavItem {
    label: string
    href: string
    children?: NavItem[]
}

export interface Testimonial {
    id: string
    author: string
    role?: string
    avatar?: string
    content: string
    rating: number
    stayTitle?: string
    location?: string
}

export interface Service {
    id: string
    icon: string
    title: string
    description: string
    image?: string
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
    error?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

