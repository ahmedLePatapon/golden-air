# Step 1: Configuration et Fondations

## Goal
Configurer les fondations du projet Golden Air : palette de couleurs Tailwind, fonts, icônes Material Symbols, ThemeProvider pour le dark/light mode, types TypeScript enrichis et données mock complètes.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
```bash
git checkout feat/design-integration
# ou créer la branche si elle n'existe pas :
git checkout -b feat/design-integration
```

---

## Step-by-Step Instructions

### Step 1.1: Désinstaller lucide-react

- [x] Exécuter la commande suivante dans le terminal :
```bash
npm uninstall lucide-react
```

#### Vérification 1.1
- [x] `lucide-react` n'apparaît plus dans `package.json`
- [x] Pas d'erreur lors de la désinstallation

---

### Step 1.2: Mettre à jour la configuration Tailwind

- [x] Remplacer entièrement le contenu de `tailwind.config.ts` par :

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand color
        primary: {
          DEFAULT: '#1152d4',
          50: '#eff5ff',
          100: '#dbe8fe',
          200: '#bfd4fe',
          300: '#93b8fd',
          400: '#6092fa',
          500: '#3b6cf6',
          600: '#1152d4',
          700: '#1a3fc4',
          800: '#1c359f',
          900: '#1c327d',
        },
        // Gold accent
        gold: {
          DEFAULT: '#C5A059',
          light: '#D4B77A',
          dark: '#A88A45',
        },
        // Background colors
        background: {
          light: '#f6f6f8',
          dark: '#101622',
        },
        // Surface colors (cards, sidebars)
        surface: {
          light: '#ffffff',
          dark: '#1e2738',
        },
        // Card colors
        card: {
          light: '#ffffff',
          dark: '#1e293b',
        },
        // Text colors
        'text-muted': {
          light: '#6b7280',
          dark: '#92a4c9',
        },
        // Border colors
        border: {
          light: '#e5e7eb',
          dark: '#232f48',
          'dark-light': '#324467',
        },
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(17, 82, 212, 0.3)',
        'glow-gold': '0 0 20px rgba(197, 160, 89, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shine': 'shine 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shine-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      },
    },
  },
  plugins: [],
}

export default config
```

#### Vérification 1.2
- [ ] Pas d'erreur TypeScript dans le fichier
- [ ] Les nouvelles couleurs sont disponibles (vérifiable après le build)

---

### Step 1.3: Mettre à jour les styles globaux CSS

- [x] Remplacer entièrement le contenu de `app/globals.css` par :

```css
@import "tailwindcss";

/* ========================================
   CUSTOM PROPERTIES - LIGHT MODE (DEFAULT)
   ======================================== */
:root {
  /* Colors */
  --color-primary: #1152d4;
  --color-gold: #C5A059;
  --color-background: #f6f6f8;
  --color-surface: #ffffff;
  --color-card: #ffffff;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 20px rgba(17, 82, 212, 0.2);

  /* Typography */
  --font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

/* ========================================
   CUSTOM PROPERTIES - DARK MODE
   ======================================== */
.dark {
  --color-background: #101622;
  --color-surface: #1e2738;
  --color-card: #1e293b;
  --color-text: #f9fafb;
  --color-text-muted: #92a4c9;
  --color-border: #232f48;
  --shadow-glow: 0 0 20px rgba(17, 82, 212, 0.3);
}

/* ========================================
   BASE STYLES
   ======================================== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  background-color: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ========================================
   TYPOGRAPHY
   ======================================== */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
}

/* ========================================
   SCROLLBAR STYLING
   ======================================== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

/* ========================================
   SELECTION
   ======================================== */
::selection {
  background-color: rgba(17, 82, 212, 0.2);
  color: inherit;
}

/* ========================================
   FOCUS STATES
   ======================================== */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ========================================
   GLASS MORPHISM UTILITIES
   ======================================== */
.glass-nav {
  background: rgba(16, 22, 34, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-card {
  background: rgba(30, 39, 56, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-card-light {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* ========================================
   GRADIENT UTILITIES
   ======================================== */
.luxury-gradient {
  background: linear-gradient(135deg, #1152d4 0%, #0a3a9d 100%);
}

.gold-gradient {
  background: linear-gradient(135deg, #C5A059 0%, #D4B77A 50%, #A88A45 100%);
}

.text-gradient-gold {
  background: linear-gradient(135deg, #C5A059 0%, #D4B77A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.overlay-gradient {
  background: linear-gradient(to top, rgba(16, 22, 34, 0.9) 0%, rgba(16, 22, 34, 0.4) 50%, transparent 100%);
}

.overlay-gradient-full {
  background: linear-gradient(to bottom, rgba(16, 22, 34, 0.6) 0%, rgba(16, 22, 34, 0.8) 100%);
}

/* ========================================
   TEXT UTILITIES
   ======================================== */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

/* ========================================
   BUTTON SHINE EFFECT
   ======================================== */
.btn-shine {
  position: relative;
  overflow: hidden;
}

.btn-shine::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

/* ========================================
   CARD HOVER EFFECTS
   ======================================== */
.card-hover {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* ========================================
   IMAGE HOVER ZOOM
   ======================================== */
.img-hover-zoom {
  overflow: hidden;
}

.img-hover-zoom img {
  transition: transform var(--transition-slow);
}

.img-hover-zoom:hover img {
  transform: scale(1.05);
}

/* ========================================
   MATERIAL SYMBOLS STYLING
   ======================================== */
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  vertical-align: middle;
}

.material-symbols-outlined.filled {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

/* ========================================
   CONTAINER UTILITIES
   ======================================== */
.container-luxury {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container-luxury {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-luxury {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* ========================================
   ASPECT RATIOS
   ======================================== */
.aspect-card {
  aspect-ratio: 4 / 3;
}

.aspect-hero {
  aspect-ratio: 16 / 9;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}

/* ========================================
   LINE CLAMP UTILITIES
   ======================================== */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ========================================
   TRANSITION UTILITIES
   ======================================== */
.transition-colors-opacity {
  transition-property: color, background-color, border-color, opacity;
  transition-timing-function: ease;
  transition-duration: 200ms;
}
```

#### Vérification 1.3
- [x] Pas d'erreur de syntaxe CSS
- [x] Les variables CSS sont définies pour les deux modes

---

### Step 1.4: Mettre à jour le Layout principal

- [x] Remplacer entièrement le contenu de `app/layout.tsx` par :

```tsx
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Golden Air | Séjours de Luxe & Expériences Exclusives',
    template: '%s | Golden Air',
  },
  description:
    'Découvrez des séjours de luxe sur mesure avec Golden Air. Villas d\'exception, services conciergerie, bien-être et sport haut de gamme.',
  keywords: [
    'séjours de luxe',
    'voyage haut de gamme',
    'villa privée',
    'conciergerie',
    'bien-être',
    'sport',
    'expériences exclusives',
  ],
  authors: [{ name: 'Golden Air' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Golden Air',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Fonts - Plus Jakarta Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background-light font-jakarta text-gray-900 antialiased dark:bg-background-dark dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

#### Vérification 1.4
- [x] Le fichier n'a pas d'erreur TypeScript
- [x] Les imports de fonts sont présents dans le `<head>`
- [x] `ThemeProvider` est importé (créé à l'étape suivante)

---

### Step 1.5: Créer le ThemeProvider

- [x] Créer le fichier `components/providers/theme-provider.tsx` avec le contenu :

```tsx
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

#### Vérification 1.5
- [x] Le fichier est créé dans le bon répertoire
- [x] Pas d'erreur TypeScript
- [x] Le composant exporte correctement `ThemeProvider`

---

### Step 1.6: Mettre à jour les Types TypeScript

- [x] Remplacer entièrement le contenu de `lib/types/index.ts` par :

```typescript
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
```

#### Vérification 1.6
- [x] Pas d'erreur TypeScript
- [x] Tous les types nécessaires sont exportés
- [x] Les types correspondent aux données mock

---

### Step 1.7: Enrichir les Données Mock

- [x] Remplacer entièrement le contenu de `lib/data/stays.ts` par :

```typescript
import { Stay } from '@/lib/types'

export const stays: Stay[] = [
  {
    id: 'stay-001',
    slug: 'villa-paradis-maldives',
    title: 'Villa Paradis aux Maldives',
    subtitle: 'Luxe absolu sur pilotis',
    location: 'Malé',
    country: 'Maldives',
    region: 'Atoll de Malé Nord',
    price: 4500,
    priceType: 'per_night',
    duration: '7 nuits minimum',
    guests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 5,
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80',
      'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=1200&q=80',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80',
      'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=1200&q=80',
    ],
    rating: 4.98,
    reviewCount: 47,
    badge: 'exclusive',
    tags: ['Plage', 'Overwater', 'Romantique'],
    category: 'villa',
    services: ['Chef privé', 'Majordome', 'Transfert hydravion', 'Spa privatif'],
    amenities: ['Piscine à débordement', 'Jacuzzi', 'Terrasse panoramique', 'Cinéma privé'],
    sports: ['Plongée', 'Snorkeling', 'Paddle', 'Jet-ski'],
    wellness: ['Spa', 'Yoga au lever', 'Massage balinais', 'Méditation'],
    description:
      'Découvrez l\'ultime escapade aux Maldives dans cette villa sur pilotis d\'exception. Avec ses 4 chambres luxueuses, sa piscine à débordement donnant sur l\'océan Indien et son personnel dévoué, vivez une expérience inoubliable.',
    shortDescription: 'Villa sur pilotis avec piscine privée et vue océan',
    highlights: [
      'Vue panoramique sur l\'océan depuis chaque chambre',
      'Accès direct au lagon cristallin',
      'Chef privé disponible 24h/24',
      'Spa et centre de bien-être exclusif',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivée au Paradis',
        description: 'Transfert en hydravion depuis Malé, cocktail de bienvenue et installation dans votre villa.',
        activities: ['Transfert hydravion', 'Cocktail de bienvenue', 'Dîner gastronomique'],
      },
      {
        day: 2,
        title: 'Exploration Marine',
        description: 'Découverte des fonds marins avec plongée ou snorkeling guidé.',
        activities: ['Petit-déjeuner flottant', 'Plongée guidée', 'Dîner sur la plage'],
      },
      {
        day: 3,
        title: 'Journée Bien-être',
        description: 'Séance de yoga matinale, soins spa et après-midi détente.',
        activities: ['Yoga sunrise', 'Massage duo', 'Coucher de soleil en yacht'],
      },
    ],
    accommodation: {
      name: 'Ocean Pool Villa',
      category: '5 étoiles',
      description: 'Villa sur pilotis avec piscine privée à débordement',
      roomType: 'Suite présidentielle',
    },
    host: {
      name: 'Aisha Rahman',
      role: 'Concierge personnelle',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      description: 'Votre concierge dédiée, disponible 24h/24 pour réaliser tous vos souhaits.',
      languages: ['Français', 'Anglais', 'Arabe'],
      isOnline: true,
    },
    featured: true,
  },
  {
    id: 'stay-002',
    slug: 'chalet-alpin-courchevel',
    title: 'Chalet Alpin à Courchevel',
    subtitle: 'Ski-in Ski-out de prestige',
    location: 'Courchevel 1850',
    country: 'France',
    region: 'Alpes',
    price: 8500,
    priceType: 'per_night',
    duration: '7 nuits minimum',
    guests: 12,
    bedrooms: 6,
    beds: 8,
    bathrooms: 7,
    image: 'https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80',
      'https://images.unsplash.com/photo-1595521624992-48a59aef95e3?w=1200&q=80',
    ],
    rating: 4.95,
    reviewCount: 32,
    badge: 'best-seller',
    tags: ['Ski', 'Montagne', 'Famille'],
    category: 'chalet',
    services: ['Chef étoilé', 'Ski valet', 'Chauffeur', 'Moniteur privé'],
    amenities: ['Piscine intérieure', 'Hammam', 'Cave à vin', 'Salle de cinéma'],
    sports: ['Ski alpin', 'Snowboard', 'Raquettes', 'Ski de fond'],
    wellness: ['Spa alpin', 'Sauna', 'Massage après-ski', 'Jacuzzi extérieur'],
    description:
      'Ce chalet d\'exception offre un accès ski-in ski-out aux pistes de Courchevel 1850. Avec son spa privé, sa piscine intérieure et son chef étoilé, vivez le luxe alpin dans toute sa splendeur.',
    shortDescription: 'Chalet de luxe avec accès direct aux pistes',
    highlights: [
      'Accès ski-in ski-out',
      'Piscine intérieure chauffée',
      'Chef étoilé à demeure',
      'Vue imprenable sur les sommets',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivée alpine',
        description: 'Transfert depuis l\'héliport, vin chaud de bienvenue et installation.',
        activities: ['Transfert hélicoptère', 'Champagne de bienvenue', 'Dîner gastronomique'],
      },
      {
        day: 2,
        title: 'Première glisse',
        description: 'Cours de ski privé et découverte du domaine.',
        activities: ['Petit-déjeuner gourmet', 'Ski avec moniteur', 'Spa après-ski'],
      },
    ],
    accommodation: {
      name: 'Chalet L\'Apogée',
      category: '5 étoiles',
      description: 'Chalet traditionnel savoyard avec finitions ultra-luxe',
      roomType: 'Master suite avec cheminée',
    },
    featured: true,
  },
  {
    id: 'stay-003',
    slug: 'ryokan-kyoto-imperial',
    title: 'Ryokan Impérial à Kyoto',
    subtitle: 'Tradition japonaise d\'exception',
    location: 'Kyoto',
    country: 'Japon',
    region: 'Kansai',
    price: 3200,
    priceType: 'per_night',
    duration: '3 nuits minimum',
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80',
      'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=1200&q=80',
    ],
    rating: 5.0,
    reviewCount: 28,
    badge: 'exclusive',
    tags: ['Culture', 'Zen', 'Gastronomie'],
    category: 'resort',
    services: ['Kaiseki privé', 'Guide culturel', 'Cérémonie du thé', 'Transfert'],
    amenities: ['Onsen privatif', 'Jardin zen', 'Tatami authentique', 'Futon de luxe'],
    sports: ['Arts martiaux', 'Méditation zen'],
    wellness: ['Onsen', 'Shiatsu', 'Bain de forêt', 'Ikebana'],
    description:
      'Immergez-vous dans la tradition japonaise dans ce ryokan centenaire. Onsen privé, cuisine kaiseki étoilée et service impeccable pour une expérience authentique.',
    shortDescription: 'Ryokan traditionnel avec onsen privé',
    highlights: [
      'Onsen privé avec vue sur jardin',
      'Cuisine kaiseki 3 étoiles',
      'Architecture historique préservée',
      'Cérémonie du thé quotidienne',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Immersion culturelle',
        description: 'Arrivée, cérémonie du thé et premier bain thermal.',
        activities: ['Cérémonie du thé', 'Onsen', 'Dîner kaiseki'],
      },
    ],
    accommodation: {
      name: 'Suite Impériale',
      category: 'Ryokan de luxe',
      description: 'Suite traditionnelle avec jardin privé',
      roomType: 'Suite avec onsen privatif',
    },
    featured: true,
  },
  {
    id: 'stay-004',
    slug: 'villa-santorini-sunset',
    title: 'Villa Sunset à Santorin',
    subtitle: 'Vue caldera spectaculaire',
    location: 'Oia',
    country: 'Grèce',
    region: 'Cyclades',
    price: 2800,
    priceType: 'per_night',
    duration: '5 nuits minimum',
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',
      'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80',
    ],
    rating: 4.92,
    reviewCount: 64,
    badge: 'best-seller',
    tags: ['Romantique', 'Vue mer', 'Coucher de soleil'],
    category: 'villa',
    services: ['Chef grec', 'Concierge', 'Yacht privé', 'Sommelier'],
    amenities: ['Piscine à débordement', 'Terrasse sunset', 'Cave à vin', 'Jacuzzi'],
    sports: ['Voile', 'Plongée', 'Randonnée'],
    wellness: ['Massage grec', 'Yoga sunset', 'Aromathérapie'],
    description:
      'Perchée sur les falaises d\'Oia, cette villa offre une vue imprenable sur la caldera et les couchers de soleil les plus célèbres au monde. Piscine à débordement et raffinement méditerranéen.',
    shortDescription: 'Villa avec vue caldera et piscine à débordement',
    highlights: [
      'Vue légendaire sur le coucher de soleil',
      'Piscine à débordement face à la caldera',
      'Architecture cycladique authentique',
      'Accès yacht privatif',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bienvenue en Grèce',
        description: 'Transfert VIP, installation et premier coucher de soleil.',
        activities: ['Transfert héliport', 'Champagne sunset', 'Dîner méditerranéen'],
      },
    ],
    accommodation: {
      name: 'Caldera Dream Villa',
      category: 'Villa de luxe',
      description: 'Villa cave traditionnelle rénovée avec luxe moderne',
      roomType: 'Suite master avec terrasse',
    },
    featured: false,
  },
  {
    id: 'stay-005',
    slug: 'lodge-safari-kenya',
    title: 'Lodge Safari au Kenya',
    subtitle: 'Au cœur de la savane',
    location: 'Masai Mara',
    country: 'Kenya',
    region: 'Vallée du Rift',
    price: 5500,
    priceType: 'per_night',
    duration: '4 nuits minimum',
    guests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 4,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=80',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=80',
      'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1200&q=80',
    ],
    rating: 4.97,
    reviewCount: 19,
    badge: 'new',
    tags: ['Safari', 'Nature', 'Aventure'],
    category: 'resort',
    services: ['Guide Masai', 'Chef bush', 'Transfert avion-brousse', 'Sundowner'],
    amenities: ['Tente de luxe', 'Terrasse savane', 'Feu de camp', 'Observatoire'],
    sports: ['Safari 4x4', 'Safari à pied', 'Vol en montgolfière'],
    wellness: ['Massage bush', 'Yoga savane', 'Méditation nature'],
    description:
      'Vivez l\'aventure ultime dans ce lodge exclusif au cœur du Masai Mara. Safari privé, immersion avec les Masai et luxe en pleine nature pour une expérience inoubliable.',
    shortDescription: 'Lodge de luxe avec safari privé',
    highlights: [
      'Safari privé avec guide Masai',
      'Big Five garanti',
      'Dîner bush sous les étoiles',
      'Vol en montgolfière au lever du soleil',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bienvenue dans la savane',
        description: 'Vol en avion-brousse, installation et premier game drive.',
        activities: ['Vol panoramique', 'Installation lodge', 'Safari coucher de soleil'],
      },
    ],
    accommodation: {
      name: 'Tented Suite',
      category: 'Lodge 5 étoiles',
      description: 'Tente de luxe avec vue sur la migration',
      roomType: 'Suite avec deck privé',
    },
    featured: true,
  },
  {
    id: 'stay-006',
    slug: 'palazzo-amalfi-coast',
    title: 'Palazzo sur la Côte Amalfitaine',
    subtitle: 'Dolce Vita italienne',
    location: 'Positano',
    country: 'Italie',
    region: 'Campanie',
    price: 3800,
    priceType: 'per_night',
    duration: '5 nuits minimum',
    guests: 10,
    bedrooms: 5,
    beds: 6,
    bathrooms: 5,
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1200&q=80',
      'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=1200&q=80',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80',
      'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1200&q=80',
    ],
    rating: 4.94,
    reviewCount: 41,
    badge: 'all-inclusive',
    tags: ['Romantique', 'Gastronomie', 'Culture'],
    category: 'villa',
    services: ['Chef italien', 'Sommelier', 'Yacht journée', 'Guide privé'],
    amenities: ['Piscine panoramique', 'Terrasse citronniers', 'Cave à vin', 'Piano'],
    sports: ['Voile', 'Kayak', 'Randonnée sentier des dieux'],
    wellness: ['Spa citron', 'Massage italien', 'Yoga terrasse'],
    description:
      'Ce palazzo historique du XVIIIe siècle domine la côte amalfitaine avec une vue époustouflante. Cuisine italienne authentique, limoncello maison et art de vivre à l\'italienne.',
    shortDescription: 'Palazzo historique avec vue mer panoramique',
    highlights: [
      'Vue à 180° sur la côte amalfitaine',
      'Cours de cuisine italienne',
      'Excursion yacht à Capri',
      'Dégustation de vins locaux',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Benvenuti!',
        description: 'Transfert en bateau depuis Naples, apéritivo et dîner italien.',
        activities: ['Transfert bateau', 'Tour du palazzo', 'Dîner gastronomique'],
      },
    ],
    accommodation: {
      name: 'Palazzo Positano',
      category: 'Demeure historique',
      description: 'Palazzo du XVIIIe siècle entièrement rénové',
      roomType: 'Suite royale avec balcon',
    },
    featured: false,
  },
  {
    id: 'stay-007',
    slug: 'chalet-verbier-ultra',
    title: 'Chalet Ultra-Luxe à Verbier',
    subtitle: 'Le summum du ski suisse',
    location: 'Verbier',
    country: 'Suisse',
    region: 'Valais',
    price: 12000,
    priceType: 'per_night',
    duration: '7 nuits minimum',
    guests: 14,
    bedrooms: 7,
    beds: 10,
    bathrooms: 8,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80',
      'https://images.unsplash.com/photo-1595521624992-48a59aef95e3?w=1200&q=80',
      'https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?w=1200&q=80',
    ],
    rating: 5.0,
    reviewCount: 15,
    badge: 'exclusive',
    tags: ['Ski', 'Ultra-luxe', 'Famille'],
    category: 'chalet',
    services: ['Chef 2 étoiles', 'Butler', 'Héliski', 'Moniteur olympique'],
    amenities: ['Piscine intérieure', 'Spa complet', 'Salle de sport', 'Nightclub privé'],
    sports: ['Héliski', 'Freeride', 'Ski de randonnée', 'Parapente'],
    wellness: ['Cryothérapie', 'Massage sportif', 'Hammam', 'Sauna finlandais'],
    description:
      'Le chalet le plus exclusif de Verbier. Avec son hélipad privé, son spa de 500m² et son chef doublement étoilé, vivez le ski dans sa forme la plus luxueuse.',
    shortDescription: 'Le summum du luxe alpin avec hélipad',
    highlights: [
      'Hélipad privé',
      'Spa de 500m² avec piscine',
      'Chef 2 étoiles Michelin',
      'Nightclub privé',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivée royale',
        description: 'Atterrissage hélipad, champagne et installation VIP.',
        activities: ['Vol hélicoptère', 'Tour du chalet', 'Dîner étoilé'],
      },
    ],
    accommodation: {
      name: 'Chalet Émeraude',
      category: 'Ultra-luxe',
      description: 'Le plus grand chalet privé de Verbier',
      roomType: 'Master suite panoramique',
    },
    featured: true,
  },
  {
    id: 'stay-008',
    slug: 'yacht-mediterranee',
    title: 'Yacht Privé en Méditerranée',
    subtitle: 'Croisière sur mesure',
    location: 'Monaco',
    country: 'France',
    region: 'Côte d\'Azur',
    price: 15000,
    priceType: 'per_night',
    duration: '7 nuits minimum',
    guests: 12,
    bedrooms: 6,
    beds: 6,
    bathrooms: 6,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=80',
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200&q=80',
      'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1200&q=80',
    ],
    rating: 4.99,
    reviewCount: 23,
    badge: 'exclusive',
    tags: ['Yacht', 'Méditerranée', 'Aventure'],
    category: 'yacht',
    services: ['Équipage 10 personnes', 'Chef gastronomique', 'Capitaine expérimenté', 'Stewardess'],
    amenities: ['Jacuzzi pont', 'Jet-ski', 'Tender', 'Salle de cinéma'],
    sports: ['Plongée', 'Wakeboard', 'Jet-ski', 'Paddle'],
    wellness: ['Massage à bord', 'Yoga pont', 'Spa flottant'],
    description:
      'Embarquez pour une croisière inoubliable à bord de ce yacht de 50 mètres. De Monaco à Saint-Tropez, explorez la Méditerranée avec tout le confort d\'un palace flottant.',
    shortDescription: 'Yacht 50m avec équipage complet',
    highlights: [
      'Yacht 50 mètres tout équipé',
      'Équipage de 10 personnes',
      'Itinéraire personnalisé',
      'Water toys inclus',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Embarquement Monaco',
        description: 'Accueil au port Hercule, champagne et briefing croisière.',
        activities: ['Embarquement VIP', 'Cocktail de bienvenue', 'Première navigation'],
      },
    ],
    accommodation: {
      name: 'M/Y Golden Dream',
      category: 'Yacht de luxe',
      description: 'Yacht à moteur de 50 mètres avec 6 cabines',
      roomType: 'Suite armateur',
    },
    featured: true,
  },
]

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getStayBySlug(slug: string): Stay | undefined {
  return stays.find((stay) => stay.slug === slug)
}

export function getFeaturedStays(): Stay[] {
  return stays.filter((stay) => stay.featured)
}

export function getStaysByCountry(country: string): Stay[] {
  return stays.filter((stay) => stay.country.toLowerCase() === country.toLowerCase())
}

export function getStaysByPriceRange(min: number, max: number): Stay[] {
  return stays.filter((stay) => stay.price >= min && stay.price <= max)
}

export function getStaysByBadge(badge: Stay['badge']): Stay[] {
  return stays.filter((stay) => stay.badge === badge)
}

export function getAllDestinations(): string[] {
  const destinations = new Set(stays.map((stay) => stay.country))
  return Array.from(destinations).sort()
}

export function getAllSports(): string[] {
  const sports = new Set(stays.flatMap((stay) => stay.sports))
  return Array.from(sports).sort()
}

export function getAllWellnessOptions(): string[] {
  const wellness = new Set(stays.flatMap((stay) => stay.wellness))
  return Array.from(wellness).sort()
}
```

#### Vérification 1.7
- [x] Pas d'erreur TypeScript
- [x] 8 séjours sont définis avec toutes les propriétés requises
- [x] Les fonctions helper sont exportées
- [x] Les images utilisent des URLs Unsplash valides

---

### Step 1.8: Créer la structure des images

- [x] Créer le dossier pour les images :
```bash
mkdir -p public/images/stays
mkdir -p public/images/services
mkdir -p public/images/backgrounds
```

> **Note :** Pour cette étape, nous utilisons des images Unsplash externes. Les images locales pourront être ajoutées ultérieurement si nécessaire.

#### Vérification 1.8
- [x] Les dossiers `public/images/stays`, `public/images/services`, `public/images/backgrounds` existent

---

## Verification Checklist Finale - Step 1

- [x] `lucide-react` n'est plus dans `package.json`
- [x] `tailwind.config.ts` contient toutes les couleurs du design
- [x] `app/globals.css` contient les variables CSS et les classes utilitaires
- [x] `app/layout.tsx` importe les fonts Google et Material Symbols
- [x] `components/providers/theme-provider.tsx` existe et exporte `ThemeProvider`
- [x] `lib/types/index.ts` contient tous les types enrichis
- [x] `lib/data/stays.ts` contient 8 séjours avec toutes les propriétés
- [x] L'application démarre sans erreur : `npm run dev`
- [x] Le mode sombre fonctionne (inspecter `<html class="dark">`)

### Test Rapide

Exécuter ces commandes pour valider :

```bash
# Vérifier que lucide-react est supprimé
grep -r "lucide-react" package.json || echo "✅ lucide-react supprimé"

# Vérifier la compilation TypeScript
npx tsc --noEmit

# Démarrer le serveur de développement
npm run dev
```

---

## Step 1 STOP & COMMIT

**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

Commande de commit suggérée :
```bash
git add .
git commit -m "feat: step 1 - configuration et fondations du design system

- Configure Tailwind avec palette de couleurs luxe (dark/light mode)
- Ajoute Plus Jakarta Sans font et Material Symbols icons
- Crée ThemeProvider avec next-themes
- Enrichit les types TypeScript (Stay, Filter, Form types)
- Ajoute 8 séjours mock variés avec données complètes
- Supprime lucide-react du projet
- Ajoute classes utilitaires CSS (glass, gradients, animations)"
```
