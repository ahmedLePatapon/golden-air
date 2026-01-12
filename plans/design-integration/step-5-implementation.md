# Step 5: Page Catalogue avec Filtres Fonctionnels

## Goal
Créer la page catalogue des séjours avec une sidebar de filtres fonctionnels (budget, destination, durée, expérience, sports), un système de tri, et une grille responsive de cards avec filtrage côté client et synchronisation URL.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
```bash
git checkout feat/design-integration
```

**Important :** Les étapes 1 à 4 doivent être complétées avant de commencer cette étape.

**Installer le package requis :**
```bash
npm install @radix-ui/react-slider
```

---

## Step-by-Step Instructions

### Step 5.1: Créer le hook useFilters

- [ ] Créer le fichier `lib/hooks/use-filters.ts` avec le contenu :

```typescript
'use client'

import { useCallback, useMemo, useReducer } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Stay } from '@/lib/types'

// Filter state type
export interface FilterState {
  search: string
  priceRange: [number, number]
  destinations: string[]
  durations: string[]
  experiences: string[]
  sports: string[]
  wellness: string[]
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'rating'
}

// Action types
type FilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
  | { type: 'TOGGLE_DESTINATION'; payload: string }
  | { type: 'TOGGLE_DURATION'; payload: string }
  | { type: 'TOGGLE_EXPERIENCE'; payload: string }
  | { type: 'TOGGLE_SPORT'; payload: string }
  | { type: 'TOGGLE_WELLNESS'; payload: string }
  | { type: 'SET_SORT'; payload: FilterState['sortBy'] }
  | { type: 'RESET_ALL' }
  | { type: 'HYDRATE'; payload: Partial<FilterState> }

// Initial state
const initialState: FilterState = {
  search: '',
  priceRange: [500, 10000],
  destinations: [],
  durations: [],
  experiences: [],
  sports: [],
  wellness: [],
  sortBy: 'recommended',
}

// Reducer
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload }
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload }
    case 'TOGGLE_DESTINATION':
      return {
        ...state,
        destinations: state.destinations.includes(action.payload)
          ? state.destinations.filter((d) => d !== action.payload)
          : [...state.destinations, action.payload],
      }
    case 'TOGGLE_DURATION':
      return {
        ...state,
        durations: state.durations.includes(action.payload)
          ? state.durations.filter((d) => d !== action.payload)
          : [...state.durations, action.payload],
      }
    case 'TOGGLE_EXPERIENCE':
      return {
        ...state,
        experiences: state.experiences.includes(action.payload)
          ? state.experiences.filter((e) => e !== action.payload)
          : [...state.experiences, action.payload],
      }
    case 'TOGGLE_SPORT':
      return {
        ...state,
        sports: state.sports.includes(action.payload)
          ? state.sports.filter((s) => s !== action.payload)
          : [...state.sports, action.payload],
      }
    case 'TOGGLE_WELLNESS':
      return {
        ...state,
        wellness: state.wellness.includes(action.payload)
          ? state.wellness.filter((w) => w !== action.payload)
          : [...state.wellness, action.payload],
      }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload }
    case 'RESET_ALL':
      return initialState
    case 'HYDRATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// Filter stays function
function filterStays(stays: Stay[], filters: FilterState): Stay[] {
  return stays.filter((stay) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        stay.title.toLowerCase().includes(searchLower) ||
        stay.location.toLowerCase().includes(searchLower) ||
        stay.country.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    // Price range filter
    if (stay.price < filters.priceRange[0] || stay.price > filters.priceRange[1]) {
      return false
    }

    // Destination filter
    if (filters.destinations.length > 0) {
      const stayDestination = `${stay.location}, ${stay.country}`.toLowerCase()
      const matchesDestination = filters.destinations.some(
        (d) =>
          stayDestination.includes(d.toLowerCase()) ||
          stay.country.toLowerCase().includes(d.toLowerCase())
      )
      if (!matchesDestination) return false
    }

    // Duration filter
    if (filters.durations.length > 0) {
      const stayDuration = stay.duration?.toLowerCase() || ''
      const matchesDuration = filters.durations.some((d) => {
        if (d === 'weekend') return stayDuration.includes('2') || stayDuration.includes('3')
        if (d === 'week') return stayDuration.includes('7')
        if (d === 'long') return stayDuration.includes('14') || stayDuration.includes('21')
        return false
      })
      if (!matchesDuration) return false
    }

    // Experience filter
    if (filters.experiences.length > 0) {
      const stayTags = [...(stay.tags || []), ...(stay.services || [])].map((t) =>
        t.toLowerCase()
      )
      const matchesExperience = filters.experiences.some((e) =>
        stayTags.some((tag) => tag.includes(e.toLowerCase()))
      )
      if (!matchesExperience) return false
    }

    // Sports filter
    if (filters.sports.length > 0) {
      const staySports = (stay.sports || []).map((s) => s.toLowerCase())
      const matchesSport = filters.sports.some((s) =>
        staySports.some((sport) => sport.includes(s.toLowerCase()))
      )
      if (!matchesSport) return false
    }

    // Wellness filter
    if (filters.wellness.length > 0) {
      const stayWellness = (stay.wellness || []).map((w) => w.toLowerCase())
      const matchesWellness = filters.wellness.some((w) =>
        stayWellness.some((wellness) => wellness.includes(w.toLowerCase()))
      )
      if (!matchesWellness) return false
    }

    return true
  })
}

// Sort stays function
function sortStays(stays: Stay[], sortBy: FilterState['sortBy']): Stay[] {
  const sorted = [...stays]
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case 'recommended':
    default:
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }
}

// Main hook
export function useFilters(stays: Stay[]) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const getInitialState = (): FilterState => {
    const state = { ...initialState }

    const search = searchParams.get('q')
    if (search) state.search = search

    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice || maxPrice) {
      state.priceRange = [
        minPrice ? parseInt(minPrice) : 500,
        maxPrice ? parseInt(maxPrice) : 10000,
      ]
    }

    const destinations = searchParams.get('destinations')
    if (destinations) state.destinations = destinations.split(',')

    const durations = searchParams.get('durations')
    if (durations) state.durations = durations.split(',')

    const experiences = searchParams.get('experiences')
    if (experiences) state.experiences = experiences.split(',')

    const sports = searchParams.get('sports')
    if (sports) state.sports = sports.split(',')

    const wellness = searchParams.get('wellness')
    if (wellness) state.wellness = wellness.split(',')

    const sortBy = searchParams.get('sort') as FilterState['sortBy']
    if (sortBy) state.sortBy = sortBy

    return state
  }

  const [filters, dispatch] = useReducer(filterReducer, undefined, getInitialState)

  // Sync filters to URL
  const syncToUrl = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams()

      if (newFilters.search) params.set('q', newFilters.search)
      if (newFilters.priceRange[0] !== 500) params.set('minPrice', String(newFilters.priceRange[0]))
      if (newFilters.priceRange[1] !== 10000) params.set('maxPrice', String(newFilters.priceRange[1]))
      if (newFilters.destinations.length) params.set('destinations', newFilters.destinations.join(','))
      if (newFilters.durations.length) params.set('durations', newFilters.durations.join(','))
      if (newFilters.experiences.length) params.set('experiences', newFilters.experiences.join(','))
      if (newFilters.sports.length) params.set('sports', newFilters.sports.join(','))
      if (newFilters.wellness.length) params.set('wellness', newFilters.wellness.join(','))
      if (newFilters.sortBy !== 'recommended') params.set('sort', newFilters.sortBy)

      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    },
    [router, pathname]
  )

  // Actions with URL sync
  const actions = useMemo(
    () => ({
      setSearch: (value: string) => {
        dispatch({ type: 'SET_SEARCH', payload: value })
        syncToUrl({ ...filters, search: value })
      },
      setPriceRange: (value: [number, number]) => {
        dispatch({ type: 'SET_PRICE_RANGE', payload: value })
        syncToUrl({ ...filters, priceRange: value })
      },
      toggleDestination: (value: string) => {
        const newDestinations = filters.destinations.includes(value)
          ? filters.destinations.filter((d) => d !== value)
          : [...filters.destinations, value]
        dispatch({ type: 'TOGGLE_DESTINATION', payload: value })
        syncToUrl({ ...filters, destinations: newDestinations })
      },
      toggleDuration: (value: string) => {
        const newDurations = filters.durations.includes(value)
          ? filters.durations.filter((d) => d !== value)
          : [...filters.durations, value]
        dispatch({ type: 'TOGGLE_DURATION', payload: value })
        syncToUrl({ ...filters, durations: newDurations })
      },
      toggleExperience: (value: string) => {
        const newExperiences = filters.experiences.includes(value)
          ? filters.experiences.filter((e) => e !== value)
          : [...filters.experiences, value]
        dispatch({ type: 'TOGGLE_EXPERIENCE', payload: value })
        syncToUrl({ ...filters, experiences: newExperiences })
      },
      toggleSport: (value: string) => {
        const newSports = filters.sports.includes(value)
          ? filters.sports.filter((s) => s !== value)
          : [...filters.sports, value]
        dispatch({ type: 'TOGGLE_SPORT', payload: value })
        syncToUrl({ ...filters, sports: newSports })
      },
      toggleWellness: (value: string) => {
        const newWellness = filters.wellness.includes(value)
          ? filters.wellness.filter((w) => w !== value)
          : [...filters.wellness, value]
        dispatch({ type: 'TOGGLE_WELLNESS', payload: value })
        syncToUrl({ ...filters, wellness: newWellness })
      },
      setSortBy: (value: FilterState['sortBy']) => {
        dispatch({ type: 'SET_SORT', payload: value })
        syncToUrl({ ...filters, sortBy: value })
      },
      resetAll: () => {
        dispatch({ type: 'RESET_ALL' })
        router.push(pathname, { scroll: false })
      },
    }),
    [filters, syncToUrl, router, pathname]
  )

  // Filtered and sorted results
  const filteredStays = useMemo(() => {
    const filtered = filterStays(stays, filters)
    return sortStays(filtered, filters.sortBy)
  }, [stays, filters])

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.priceRange[0] !== 500 || filters.priceRange[1] !== 10000) count++
    count += filters.destinations.length
    count += filters.durations.length
    count += filters.experiences.length
    count += filters.sports.length
    count += filters.wellness.length
    return count
  }, [filters])

  return {
    filters,
    actions,
    filteredStays,
    totalCount: stays.length,
    filteredCount: filteredStays.length,
    activeFiltersCount,
  }
}
```

#### Vérification 5.1
- [ ] Le fichier existe dans `lib/hooks/`
- [ ] Pas d'erreur TypeScript

---

### Step 5.2: Créer le composant PriceRangeSlider

- [ ] Créer le fichier `components/catalogue/price-range-slider.tsx` avec le contenu :

```tsx
'use client'

import * as Slider from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

interface PriceRangeSliderProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function PriceRangeSlider({
  value,
  onChange,
  min = 500,
  max = 10000,
  step = 100,
  className,
}: PriceRangeSliderProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000) return '10k+ €'
    return `${price.toLocaleString('fr-FR')} €`
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Budget
        </h3>
        <span className="text-xs text-text-muted-dark">Par nuit</span>
      </div>

      {/* Slider */}
      <Slider.Root
        className="relative flex h-[38px] w-full touch-none select-none items-center pt-4"
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track className="relative h-1 w-full grow rounded-full bg-border-dark">
          <Slider.Range className="absolute h-full rounded-full bg-primary" />
        </Slider.Track>

        {/* Left Thumb */}
        <Slider.Thumb
          className={cn(
            'group block h-4 w-4 cursor-pointer rounded-full border-2 border-white bg-primary shadow-lg',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark',
            'transition-transform hover:scale-110'
          )}
          aria-label="Prix minimum"
        >
          {/* Tooltip */}
          <div
            className={cn(
              'absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-white px-2 py-1 text-xs font-bold text-background-dark shadow-lg',
              'opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100'
            )}
          >
            {formatPrice(value[0])}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
          </div>
        </Slider.Thumb>

        {/* Right Thumb */}
        <Slider.Thumb
          className={cn(
            'group block h-4 w-4 cursor-pointer rounded-full border-2 border-white bg-primary shadow-lg',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark',
            'transition-transform hover:scale-110'
          )}
          aria-label="Prix maximum"
        >
          {/* Tooltip */}
          <div
            className={cn(
              'absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-white px-2 py-1 text-xs font-bold text-background-dark shadow-lg',
              'opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100'
            )}
          >
            {formatPrice(value[1])}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
          </div>
        </Slider.Thumb>
      </Slider.Root>

      {/* Min/Max Labels */}
      <div className="-mt-2 flex justify-between text-xs text-text-muted-dark">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  )
}
```

#### Vérification 5.2
- [ ] Le fichier existe dans `components/catalogue/`
- [ ] Pas d'erreur TypeScript

---

### Step 5.3: Créer le composant FilterGroup

- [ ] Créer le fichier `components/catalogue/filter-group.tsx` avec le contenu :

```tsx
'use client'

import { cn } from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
}

interface FilterGroupProps {
  title: string
  options: FilterOption[]
  selectedValues: string[]
  onToggle: (value: string) => void
  className?: string
}

export function FilterGroup({
  title,
  options,
  selectedValues,
  onToggle,
  className,
}: FilterGroupProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-white">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const isChecked = selectedValues.includes(option.value)
          return (
            <label
              key={option.value}
              className="group flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(option.value)}
                className={cn(
                  'h-5 w-5 rounded border-border-dark bg-transparent text-primary',
                  'focus:ring-0 focus:ring-offset-0',
                  'checked:bg-primary checked:border-primary'
                )}
              />
              <span
                className={cn(
                  'text-sm transition-colors',
                  isChecked
                    ? 'font-medium text-white'
                    : 'text-text-muted-dark group-hover:text-white'
                )}
              >
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
```

#### Vérification 5.3
- [ ] Le fichier existe dans `components/catalogue/`
- [ ] Les checkboxes sont stylisés

---

### Step 5.4: Créer le composant SortSelect

- [ ] Créer le fichier `components/catalogue/sort-select.tsx` avec le contenu :

```tsx
'use client'

import { cn } from '@/lib/utils'

type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating'

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
  className?: string
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommandés' },
  { value: 'price-asc', label: 'Prix : Croissant' },
  { value: 'price-desc', label: 'Prix : Décroissant' },
  { value: 'rating', label: 'Mieux notés' },
]

export function SortSelect({ value, onChange, className }: SortSelectProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-text-muted-dark">Trier par :</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className={cn(
          'cursor-pointer border-none bg-transparent p-0 pr-6 text-sm font-medium text-white',
          'focus:ring-0 focus:outline-none'
        )}
      >
        {sortOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-surface-dark text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
```

#### Vérification 5.4
- [ ] Le fichier existe dans `components/catalogue/`
- [ ] Le select fonctionne

---

### Step 5.5: Créer le composant FilterSidebar

- [ ] Créer le fichier `components/catalogue/filter-sidebar.tsx` avec le contenu :

```tsx
'use client'

import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { PriceRangeSlider } from './price-range-slider'
import { FilterGroup } from './filter-group'
import type { FilterState } from '@/lib/hooks/use-filters'

// Filter options data
const destinationOptions = [
  { value: 'maldives', label: 'Maldives' },
  { value: 'santorin', label: 'Santorin' },
  { value: 'aspen', label: 'Aspen' },
  { value: 'kyoto', label: 'Kyoto' },
  { value: 'amalfi', label: 'Côte Amalfitaine' },
  { value: 'france', label: 'France' },
  { value: 'suisse', label: 'Suisse' },
  { value: 'kenya', label: 'Kenya' },
]

const durationOptions = [
  { value: 'weekend', label: 'Week-end (2-3 nuits)' },
  { value: 'week', label: 'Semaine (7 nuits)' },
  { value: 'long', label: 'Long séjour (14+ nuits)' },
]

const experienceOptions = [
  { value: 'wellness', label: 'Bien-être & Spa' },
  { value: 'aventure', label: 'Aventure' },
  { value: 'gastronomie', label: 'Gastronomie' },
  { value: 'romantique', label: 'Romantique' },
  { value: 'sport', label: 'Sport & Fitness' },
]

const sportOptions = [
  { value: 'tennis', label: 'Tennis' },
  { value: 'golf', label: 'Golf' },
  { value: 'ski', label: 'Ski alpin' },
  { value: 'cyclisme', label: 'Cyclisme' },
  { value: 'plongee', label: 'Plongée' },
  { value: 'voile', label: 'Voile' },
]

const wellnessOptions = [
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'detox', label: 'Détox' },
  { value: 'spa', label: 'Spa & Massage' },
  { value: 'meditation', label: 'Méditation' },
]

interface FilterSidebarProps {
  filters: FilterState
  actions: {
    setSearch: (value: string) => void
    setPriceRange: (value: [number, number]) => void
    toggleDestination: (value: string) => void
    toggleDuration: (value: string) => void
    toggleExperience: (value: string) => void
    toggleSport: (value: string) => void
    toggleWellness: (value: string) => void
    resetAll: () => void
  }
  activeFiltersCount: number
  className?: string
}

export function FilterSidebar({
  filters,
  actions,
  activeFiltersCount,
  className,
}: FilterSidebarProps) {
  return (
    <aside
      className={cn(
        'flex w-full flex-col gap-6 rounded-xl bg-surface-dark p-6',
        'lg:sticky lg:top-24 lg:w-[280px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Filtres</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.resetAll}
            className="text-xs text-text-muted-dark hover:text-white"
          >
            Réinitialiser ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher une destination..."
          value={filters.search}
          onChange={(e) => actions.setSearch(e.target.value)}
          className={cn(
            'h-12 w-full rounded-lg border border-border-dark bg-surface-dark px-4 pl-11',
            'text-white placeholder-text-muted-dark',
            'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
          )}
        />
        <Icon
          name="search"
          size="sm"
          className="absolute left-3 top-3.5 text-text-muted-dark"
        />
      </div>

      {/* Price Range */}
      <PriceRangeSlider
        value={filters.priceRange}
        onChange={actions.setPriceRange}
      />

      <hr className="border-border-dark" />

      {/* Destination */}
      <FilterGroup
        title="Destination"
        options={destinationOptions}
        selectedValues={filters.destinations}
        onToggle={actions.toggleDestination}
      />

      <hr className="border-border-dark" />

      {/* Duration */}
      <FilterGroup
        title="Durée"
        options={durationOptions}
        selectedValues={filters.durations}
        onToggle={actions.toggleDuration}
      />

      <hr className="border-border-dark" />

      {/* Experience Type */}
      <FilterGroup
        title="Type d'expérience"
        options={experienceOptions}
        selectedValues={filters.experiences}
        onToggle={actions.toggleExperience}
      />

      <hr className="border-border-dark" />

      {/* Sports */}
      <FilterGroup
        title="Sport"
        options={sportOptions}
        selectedValues={filters.sports}
        onToggle={actions.toggleSport}
      />

      <hr className="border-border-dark" />

      {/* Wellness */}
      <FilterGroup
        title="Bien-être"
        options={wellnessOptions}
        selectedValues={filters.wellness}
        onToggle={actions.toggleWellness}
      />
    </aside>
  )
}
```

#### Vérification 5.5
- [ ] Le fichier existe dans `components/catalogue/`
- [ ] Tous les filtres sont présents
- [ ] Pas d'erreur TypeScript

---

### Step 5.6: Créer le composant StayCardCatalogue

- [ ] Créer le fichier `components/stays/stay-card-catalogue.tsx` avec le contenu :

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import type { Stay } from '@/lib/types'

interface StayCardCatalogueProps {
  stay: Stay
  className?: string
}

// Map service/amenity to icon
const serviceIcons: Record<string, string> = {
  'salle de sport': 'fitness_center',
  'fitness': 'fitness_center',
  'tennis': 'sports_tennis',
  'golf': 'sports_golf',
  'ski': 'downhill_skiing',
  'spa': 'spa',
  'yoga': 'self_improvement',
  'pilates': 'sports_gymnastics',
  'détox': 'restaurant_menu',
  'piscine': 'pool',
  'plongée': 'scuba_diving',
  'voile': 'sailing',
  'chef': 'restaurant',
  'massage': 'spa',
  'méditation': 'grass',
}

function getServiceIcon(service: string): string {
  const lowerService = service.toLowerCase()
  for (const [key, icon] of Object.entries(serviceIcons)) {
    if (lowerService.includes(key)) return icon
  }
  return 'check_circle'
}

export function StayCardCatalogue({ stay, className }: StayCardCatalogueProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  // Get first 3 services/amenities to display
  const displayServices = [
    ...(stay.sports || []).slice(0, 1),
    ...(stay.wellness || []).slice(0, 1),
    ...(stay.amenities || []).slice(0, 1),
  ].slice(0, 3)

  // Badge text and style
  const getBadgeInfo = () => {
    switch (stay.badge) {
      case 'exclusive':
        return {
          text: 'Exclusif',
          className: 'bg-white/10 backdrop-blur-md border border-white/20',
        }
      case 'best-seller':
        return { text: 'Meilleure Vente', className: 'bg-primary/80 backdrop-blur-md' }
      case 'new':
        return { text: 'Nouveau', className: 'bg-gold backdrop-blur-md text-black' }
      case 'all-inclusive':
        return { text: 'Tout inclus', className: 'bg-emerald-500/80 backdrop-blur-md' }
      default:
        return null
    }
  }

  const badgeInfo = getBadgeInfo()

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-transparent bg-surface-dark',
        'transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${stay.image}')` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 via-transparent to-transparent opacity-80" />

        {/* Badge */}
        {badgeInfo && (
          <div className="absolute left-4 top-4">
            <span
              className={cn(
                'rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white',
                badgeInfo.className
              )}
            >
              {badgeInfo.text}
            </span>
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={toggleFavorite}
          className={cn(
            'absolute right-4 top-4 rounded-full p-2 backdrop-blur-md transition-colors',
            isFavorite
              ? 'bg-primary text-white'
              : 'bg-black/20 text-white hover:bg-primary'
          )}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Icon name="favorite" size="sm" filled={isFavorite} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 pt-4">
        {/* Title + Location */}
        <div>
          <h3 className="text-lg font-bold text-white transition-colors group-hover:text-primary">
            {stay.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-text-muted-dark">
            <Icon name="location_on" className="text-primary" style={{ fontSize: '16px' }} />
            <span>
              {stay.location}, {stay.country}
            </span>
          </div>
        </div>

        {/* Services Row */}
        {displayServices.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border-dark/30 py-3">
            {displayServices.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-text-muted-dark"
              >
                <Icon
                  name={getServiceIcon(service)}
                  className="font-light"
                  style={{ fontSize: '20px' }}
                />
                <span className="text-xs">{service}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-1 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-text-muted-dark">À partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">
                {stay.price.toLocaleString('fr-FR')} €
              </span>
              <span className="text-xs text-text-muted-dark">
                / {stay.priceType === 'per_night' ? 'nuit' : 'séjour'}
              </span>
            </div>
          </div>
          <Link
            href={`/sejours/${stay.slug}`}
            className="flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-white"
          >
            Voir les détails
            <Icon name="arrow_forward" style={{ fontSize: '16px' }} />
          </Link>
        </div>
      </div>
    </article>
  )
}
```

#### Vérification 5.6
- [ ] Le fichier existe dans `components/stays/`
- [ ] Les icônes des services s'affichent correctement
- [ ] Pas d'erreur TypeScript

---

### Step 5.7: Créer le composant ResultsHeader

- [ ] Créer le fichier `components/catalogue/results-header.tsx` avec le contenu :

```tsx
'use client'

import { SortSelect } from './sort-select'
import type { FilterState } from '@/lib/hooks/use-filters'

interface ResultsHeaderProps {
  totalCount: number
  filteredCount: number
  sortBy: FilterState['sortBy']
  onSortChange: (value: FilterState['sortBy']) => void
}

export function ResultsHeader({
  totalCount,
  filteredCount,
  sortBy,
  onSortChange,
}: ResultsHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-text-muted-dark">
        <span className="font-bold text-white">{filteredCount}</span>
        {' '}séjour{filteredCount > 1 ? 's' : ''} sélectionné{filteredCount > 1 ? 's' : ''}
        {filteredCount < totalCount && (
          <span className="text-text-muted-dark"> sur {totalCount}</span>
        )}
      </p>
      <SortSelect value={sortBy} onChange={onSortChange} />
    </div>
  )
}
```

#### Vérification 5.7
- [ ] Le fichier existe dans `components/catalogue/`
- [ ] Pas d'erreur TypeScript

---

### Step 5.8: Créer le fichier index des exports catalogue

- [ ] Créer le fichier `components/catalogue/index.ts` avec le contenu :

```typescript
export { FilterSidebar } from './filter-sidebar'
export { FilterGroup } from './filter-group'
export { PriceRangeSlider } from './price-range-slider'
export { SortSelect } from './sort-select'
export { ResultsHeader } from './results-header'
```

#### Vérification 5.8
- [ ] Le fichier existe
- [ ] Tous les exports sont corrects

---

### Step 5.9: Mettre à jour l'export stays

- [ ] Mettre à jour le fichier `components/stays/index.ts` avec le contenu :

```typescript
export { StayCard } from './stay-card'
export { StayCardCatalogue } from './stay-card-catalogue'
```

#### Vérification 5.9
- [ ] Le fichier inclut les deux exports

---

### Step 5.10: Ajouter les couleurs manquantes au Tailwind (si pas déjà fait)

- [ ] Vérifier que `tailwind.config.ts` contient les couleurs suivantes, sinon les ajouter :

```typescript
// Dans theme.extend.colors, s'assurer que ces couleurs existent :
'text-muted-dark': '#92a4c9',
'border-dark': '#324467',
```

#### Vérification 5.10
- [ ] Les couleurs sont présentes dans la config

---

### Step 5.11: Créer la page Catalogue

- [ ] Créer le dossier et le fichier `app/sejours/page.tsx` avec le contenu :

```tsx
'use client'

import { Suspense } from 'react'
import { stays } from '@/lib/data/stays'
import { useFilters } from '@/lib/hooks/use-filters'
import { FilterSidebar, ResultsHeader } from '@/components/catalogue'
import { StayCardCatalogue } from '@/components/stays'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

function CatalogueContent() {
  const {
    filters,
    actions,
    filteredStays,
    totalCount,
    filteredCount,
    activeFiltersCount,
  } = useFilters(stays)

  return (
    <main className="min-h-screen bg-background-dark pb-20 pt-8">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-10">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Collection Sport & Bien-être
          </h1>
          <p className="max-w-2xl text-lg text-text-muted-dark">
            Découvrez nos séjours d&apos;exception alliant luxe, activités
            sportives et programmes de bien-être personnalisés.
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            actions={actions}
            activeFiltersCount={activeFiltersCount}
          />

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <ResultsHeader
              totalCount={totalCount}
              filteredCount={filteredCount}
              sortBy={filters.sortBy}
              onSortChange={actions.setSortBy}
            />

            {/* Grid */}
            {filteredStays.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {filteredStays.map((stay) => (
                  <StayCardCatalogue key={stay.id} stay={stay} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl bg-surface-dark py-20 text-center">
                <Icon
                  name="search_off"
                  size="xl"
                  className="mb-4 text-text-muted-dark"
                />
                <h3 className="mb-2 text-xl font-bold text-white">
                  Aucun séjour trouvé
                </h3>
                <p className="mb-6 max-w-md text-text-muted-dark">
                  Aucun séjour ne correspond à vos critères de recherche.
                  Essayez de modifier vos filtres.
                </p>
                <Button onClick={actions.resetAll}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}

            {/* Load More (static for now) */}
            {filteredStays.length >= 6 && (
              <div className="mt-16 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border-dark hover:bg-border-dark"
                >
                  Découvrir plus
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background-dark">
          <div className="text-white">Chargement...</div>
        </div>
      }
    >
      <CatalogueContent />
    </Suspense>
  )
}
```

#### Vérification 5.11
- [ ] Le fichier existe dans `app/sejours/`
- [ ] La page se charge sans erreur

---

### Step 5.12: Créer le fichier hooks index

- [ ] Créer le fichier `lib/hooks/index.ts` avec le contenu :

```typescript
export { useFilters } from './use-filters'
export type { FilterState } from './use-filters'
```

#### Vérification 5.12
- [ ] Le fichier existe
- [ ] L'export est correct

---

## Verification Checklist Finale - Step 5

### Structure des fichiers
- [ ] `lib/hooks/use-filters.ts` existe
- [ ] `lib/hooks/index.ts` existe
- [ ] `components/catalogue/price-range-slider.tsx` existe
- [ ] `components/catalogue/filter-group.tsx` existe
- [ ] `components/catalogue/sort-select.tsx` existe
- [ ] `components/catalogue/filter-sidebar.tsx` existe
- [ ] `components/catalogue/results-header.tsx` existe
- [ ] `components/catalogue/index.ts` existe
- [ ] `components/stays/stay-card-catalogue.tsx` existe
- [ ] `app/sejours/page.tsx` existe

### Tests Fonctionnels
- [ ] `npm run dev` démarre sans erreur
- [ ] La page catalogue est accessible à `http://localhost:3000/sejours`
- [ ] La sidebar de filtres s'affiche sur desktop
- [ ] Le price range slider fonctionne (déplacer les curseurs)
- [ ] Les checkboxes des filtres fonctionnent
- [ ] Le tri par prix fonctionne (croissant/décroissant)
- [ ] La recherche filtre les séjours en temps réel
- [ ] Les filtres se cumulent (AND logic)
- [ ] Le compteur de résultats se met à jour
- [ ] Le bouton "Réinitialiser" efface tous les filtres
- [ ] Les cards affichent les services avec icônes
- [ ] Le bouton favori fonctionne sur les cards
- [ ] L'URL se met à jour avec les paramètres de filtre
- [ ] Recharger la page conserve les filtres (via URL)
- [ ] Le message "Aucun séjour trouvé" s'affiche si 0 résultats

### Tests Responsive
- [ ] Mobile (320px) : sidebar au-dessus de la grille
- [ ] Tablet (768px) : grille 2 colonnes
- [ ] Desktop (1024px+) : sidebar sticky à gauche, grille 3 colonnes

### Commande de test
```bash
npm run dev
# Ouvrir http://localhost:3000/sejours
# Tester les filtres, le tri, la recherche
# Vérifier l'URL qui change
```

---

## Step 5 STOP & COMMIT

**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

Commande de commit suggérée :
```bash
git add .
git commit -m "feat: step 5 - page catalogue avec filtres fonctionnels

- Crée useFilters hook avec state management et URL sync
- Crée PriceRangeSlider avec Radix UI Slider
- Crée FilterGroup pour les checkboxes de filtres
- Crée FilterSidebar avec tous les groupes de filtres
- Crée SortSelect pour le tri des résultats
- Crée StayCardCatalogue variante pour le catalogue
- Crée ResultsHeader avec compteur et tri
- Implémente le filtrage côté client multi-critères
- Synchronisation bidirectionnelle filtres/URL
- Layout responsive sidebar + grille"
```
