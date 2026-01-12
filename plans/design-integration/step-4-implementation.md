# Step 4: Page d'Accueil

## Goal
Créer la page d'accueil complète de Golden Air avec Hero plein écran, SearchBar, sections Services, Bien-être & Sport, Collection de séjours et Témoignage client.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
```bash
git checkout feat/design-integration
```

**Important :** Les étapes 1, 2 et 3 doivent être complétées avant de commencer cette étape.

---

## Step-by-Step Instructions

### Step 4.1: Créer le composant StayCard

- [ ] Créer le fichier `components/stays/stay-card.tsx` avec le contenu :

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import type { Stay } from '@/lib/types'

interface StayCardProps {
  stay: Stay
  className?: string
}

export function StayCard({ stay, className }: StayCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  // Determine which amenities to show as badges
  const badges = []
  if (stay.guests) badges.push(`${stay.guests} Invités`)
  if (stay.beds) badges.push(`${stay.beds} Lits`)
  if (stay.amenities?.[0]) badges.push(stay.amenities[0])

  return (
    <Link
      href={`/sejours/${stay.slug}`}
      className={cn('group block cursor-pointer', className)}
    >
      {/* Image Container */}
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl">
        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />

        {/* Image */}
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${stay.image}')` }}
        />

        {/* Badge (if exists) */}
        {stay.badge && (
          <div className="absolute left-4 top-4 z-20">
            <span
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider',
                stay.badge === 'exclusive' && 'bg-gold text-black',
                stay.badge === 'new' && 'bg-primary text-white',
                stay.badge === 'best-seller' && 'bg-white text-black',
                stay.badge === 'all-inclusive' && 'bg-emerald-500 text-white'
              )}
            >
              {stay.badge === 'exclusive' && 'Exclusif'}
              {stay.badge === 'new' && 'Nouveau'}
              {stay.badge === 'best-seller' && 'Best-seller'}
              {stay.badge === 'all-inclusive' && 'Tout inclus'}
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <div className="absolute right-4 top-4 z-20">
          <button
            onClick={toggleFavorite}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200',
              isFavorite
                ? 'bg-white text-red-500'
                : 'bg-white/10 text-white hover:bg-white hover:text-red-500'
            )}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Icon name="favorite" size="sm" filled={isFavorite} />
          </button>
        </div>

        {/* Bottom Badges */}
        {badges.length > 0 && (
          <div className="absolute bottom-4 left-4 z-20 flex gap-2">
            {badges.slice(0, 2).map((badge, index) => (
              <span
                key={index}
                className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-md"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-white transition-colors group-hover:text-primary">
            {stay.title}
          </h3>
          {stay.rating && (
            <div className="flex items-center gap-1 text-sm font-bold text-white">
              <Icon name="star" size="sm" className="text-primary" filled />
              {stay.rating.toFixed(2)}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-400">
          {stay.location}, {stay.country}
        </p>
        <p className="mt-2 text-sm font-medium text-white">
          <span className="font-bold">€{stay.price.toLocaleString('fr-FR')}</span>
          <span className="font-normal text-gray-500">
            {' '}
            / {stay.priceType === 'per_night' ? 'nuit' : 'séjour'}
          </span>
        </p>
      </div>
    </Link>
  )
}
```

#### Vérification 4.1
- [ ] Le fichier existe dans `components/stays/`
- [ ] Pas d'erreur TypeScript

---

### Step 4.2: Créer le composant HeroSection

- [ ] Créer le fichier `components/home/hero-section.tsx` avec le contenu :

```tsx
import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full scale-105 transform bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')",
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background-dark/40 via-background-dark/20 to-background-dark" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-[1280px] px-4 text-center md:px-10">
        {/* Tagline */}
        <span className="mb-4 block text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Bienvenue chez Golden Air
        </span>

        {/* Main Heading */}
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl md:text-7xl">
          L&apos;Art de Vivre,
          <br />
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Redéfini.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-gray-200 md:text-xl">
          Vivez l&apos;expérience ultime du luxe tout inclus dans des propriétés
          d&apos;exception, avec chef privé, conciergerie dédiée et activités
          sur mesure.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/sejours">
            <Button
              size="lg"
              className="h-14 bg-white px-8 text-base font-bold text-background-dark hover:bg-gray-100"
            >
              Explorer Notre Collection
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            className="h-14 border border-white/30 bg-white/5 px-8 backdrop-blur-sm hover:bg-white/10"
          >
            <Icon name="play_circle" size="sm" className="mr-2" />
            Voir le Film
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-32 left-1/2 z-20 -translate-x-1/2 animate-bounce">
        <Icon name="expand_more" size="lg" className="text-white/50" />
      </div>
    </section>
  )
}
```

#### Vérification 4.2
- [ ] Le fichier existe dans `components/home/`
- [ ] Pas d'erreur TypeScript

---

### Step 4.3: Créer le composant SearchBar

- [ ] Créer le fichier `components/home/search-bar.tsx` avec le contenu :

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [dates, setDates] = useState('')
  const [guests, setGuests] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (dates) params.set('dates', dates)
    if (guests) params.set('guests', guests)
    router.push(`/sejours?${params.toString()}`)
  }

  return (
    <div className={cn('w-full px-4', className)}>
      <div className="mx-auto max-w-[960px] rounded-2xl border border-white/10 bg-background-dark/90 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Destination */}
          <div className="group flex-1 cursor-pointer rounded-lg px-4 py-3 transition-colors hover:bg-white/5">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors group-hover:text-primary">
              Destination
            </label>
            <div className="flex items-center text-white">
              <Icon name="location_on" size="sm" className="mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Partout"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent font-medium placeholder:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-white/10 md:block" />

          {/* Dates */}
          <div className="group flex-1 cursor-pointer rounded-lg px-4 py-3 transition-colors hover:bg-white/5">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors group-hover:text-primary">
              Dates
            </label>
            <div className="flex items-center text-white">
              <Icon name="calendar_month" size="sm" className="mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Ajouter dates"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full bg-transparent font-medium placeholder:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-white/10 md:block" />

          {/* Guests */}
          <div className="group flex-1 cursor-pointer rounded-lg px-4 py-3 transition-colors hover:bg-white/5">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors group-hover:text-primary">
              Invités
            </label>
            <div className="flex items-center text-white">
              <Icon name="group" size="sm" className="mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Ajouter invités"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent font-medium placeholder:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            size="lg"
            className="h-14 w-full rounded-xl px-8 md:h-16 md:w-auto"
          >
            <Icon name="search" size="sm" className="mr-2 md:mr-0" />
            <span className="md:hidden">Rechercher</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
```

#### Vérification 4.3
- [ ] Le fichier existe dans `components/home/`
- [ ] Pas d'erreur TypeScript

---

### Step 4.4: Créer le composant ServicesSection

- [ ] Créer le fichier `components/home/services-section.tsx` avec le contenu :

```tsx
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'

const services = [
  {
    icon: 'restaurant',
    title: 'Chef Privé',
    description:
      'Savourez des repas gastronomiques préparés quotidiennement par votre chef personnel, avec des menus adaptés à vos préférences.',
  },
  {
    icon: 'concierge',
    title: 'Conciergerie 24/7',
    description:
      'Des réservations de restaurants aux locations de yachts, notre équipe réalise chacune de vos envies à toute heure.',
  },
  {
    icon: 'spa',
    title: 'Bien-être & Spa',
    description:
      'Massages en villa, séances de yoga privées et rituels de beauté pour une détente absolue.',
  },
]

export function ServicesSection() {
  return (
    <section className="bg-background-dark py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="flex-1">
            <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl">
              Plus qu&apos;un séjour.
              <br />
              Une expérience fluide.
            </h2>
            <p className="max-w-md leading-relaxed text-gray-400">
              Nous allons au-delà de la location de luxe pour créer des moments
              inoubliables, orchestrés par notre équipe dédiée.
            </p>
          </div>
          <Link
            href="/concept"
            className="group flex items-center gap-2 font-bold text-primary"
          >
            Découvrir notre concept
            <Icon
              name="arrow_forward"
              size="sm"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface ServiceCardProps {
  icon: string
  title: string
  description: string
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div
      className={cn(
        'group rounded-2xl border border-white/5 bg-surface-dark p-8',
        'transition-all duration-300 hover:border-primary/30'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'mb-6 flex h-12 w-12 items-center justify-center rounded-xl',
          'bg-primary/10 text-primary transition-colors',
          'group-hover:bg-primary group-hover:text-white'
        )}
      >
        <Icon name={icon} size="md" />
      </div>

      {/* Content */}
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-400">{description}</p>
    </div>
  )
}
```

#### Vérification 4.4
- [ ] Le fichier existe dans `components/home/`
- [ ] Les 3 services sont affichés
- [ ] Pas d'erreur TypeScript

---

### Step 4.5: Créer le composant WellnessSection

- [ ] Créer le fichier `components/home/wellness-section.tsx` avec le contenu :

```tsx
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'

const categories = [
  {
    icon: 'sports_tennis',
    title: 'Sport Exclusif',
    description: 'Coaching privé et accès à des installations d\'élite.',
    tags: ['Golf', 'Tennis', 'Voile', 'Ski'],
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
  },
  {
    icon: 'self_improvement',
    title: 'Retraites Bien-être',
    description: 'Programmes holistiques pour nourrir corps et esprit.',
    tags: ['Spa', 'Yoga', 'Détox', 'Méditation'],
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
  },
]

export function WellnessSection() {
  return (
    <section className="bg-background-dark py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
            Art de vivre
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Bien-être & Mouvement
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-400">
            Une approche holistique du luxe qui prend soin de votre corps et de
            votre esprit, avec des activités encadrées par des experts.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category, index) => (
            <WellnessCard key={index} {...category} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/sejours?filter=wellness"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary"
          >
            Explorer nos expériences bien-être
            <Icon
              name="arrow_forward"
              size="sm"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

interface WellnessCardProps {
  icon: string
  title: string
  description: string
  tags: string[]
  image: string
}

function WellnessCard({ icon, title, description, tags, image }: WellnessCardProps) {
  return (
    <div className="group relative h-[500px] overflow-hidden rounded-2xl border border-white/5">
      {/* Overlays */}
      <div className="absolute inset-0 z-10 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {/* Background Image */}
      <div
        className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 z-20 w-full p-8">
        {/* Icon & Title */}
        <div className="mb-2 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary backdrop-blur-md">
            <Icon name={icon} size="sm" />
          </span>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>

        {/* Description */}
        <p className="mb-6 max-w-sm text-sm text-gray-300">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={cn(
                'rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md',
                'transition-colors hover:bg-white hover:text-black'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
```

#### Vérification 4.5
- [ ] Le fichier existe dans `components/home/`
- [ ] Les 2 cards wellness sont affichées
- [ ] Les tags sont interactifs
- [ ] Pas d'erreur TypeScript

---

### Step 4.6: Créer le composant CollectionSection

- [ ] Créer le fichier `components/home/collection-section.tsx` avec le contenu :

```tsx
'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { StayCard } from '@/components/stays/stay-card'
import { getFeaturedStays } from '@/lib/data/stays'

export function CollectionSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const featuredStays = getFeaturedStays()

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-background-dark py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
              Notre Collection
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Évasions Uniques
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => scroll('left')}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white',
                'transition-colors hover:bg-white hover:text-black'
              )}
              aria-label="Précédent"
            >
              <Icon name="arrow_back" size="sm" />
            </button>
            <button
              onClick={() => scroll('right')}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white',
                'transition-colors hover:bg-white hover:text-black'
              )}
              aria-label="Suivant"
            >
              <Icon name="arrow_forward" size="sm" />
            </button>
          </div>
        </div>

        {/* Stays Carousel */}
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-4 flex gap-6 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0"
        >
          {featuredStays.map((stay) => (
            <div key={stay.id} className="w-[300px] flex-shrink-0 md:w-[350px]">
              <StayCard stay={stay} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/sejours">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-sm font-bold uppercase tracking-widest"
            >
              Voir Toutes les Propriétés
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

#### Vérification 4.6
- [ ] Le fichier existe dans `components/home/`
- [ ] Le carousel fonctionne
- [ ] Les flèches permettent de naviguer
- [ ] Pas d'erreur TypeScript

---

### Step 4.7: Créer le composant TestimonialSection

- [ ] Créer le fichier `components/home/testimonial-section.tsx` avec le contenu :

```tsx
import { Icon } from '@/components/ui/icon'

const testimonial = {
  quote:
    "Notre séjour à la Villa Azure n'était rien de moins que la perfection. Chaque détail avait été pensé, le chef était extraordinaire, et la conciergerie a transformé nos moindres souhaits en réalité. Une expérience qui restera gravée à jamais.",
  author: 'Elena Rostova',
  location: 'Séjour à Nice',
  date: 'Juillet 2024',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
}

export function TestimonialSection() {
  return (
    <section className="relative bg-[#0d121c] py-24">
      <div className="mx-auto max-w-[800px] px-6 text-center">
        {/* Quote Icon */}
        <div className="mb-8 flex justify-center text-primary">
          <Icon name="format_quote" size="xl" />
        </div>

        {/* Quote */}
        <blockquote className="mb-8 font-serif text-2xl font-light italic leading-normal text-white md:text-4xl">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div
            className="mb-3 h-12 w-12 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url('${testimonial.avatar}')` }}
          />
          <cite className="text-lg font-bold not-italic text-white">
            {testimonial.author}
          </cite>
          <span className="text-sm text-gray-500">
            {testimonial.location}, {testimonial.date}
          </span>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </section>
  )
}
```

#### Vérification 4.7
- [ ] Le fichier existe dans `components/home/`
- [ ] La citation s'affiche correctement
- [ ] Pas d'erreur TypeScript

---

### Step 4.8: Créer le fichier index des exports home

- [ ] Créer le fichier `components/home/index.ts` avec le contenu :

```typescript
export { HeroSection } from './hero-section'
export { SearchBar } from './search-bar'
export { ServicesSection } from './services-section'
export { WellnessSection } from './wellness-section'
export { CollectionSection } from './collection-section'
export { TestimonialSection } from './testimonial-section'
```

#### Vérification 4.8
- [ ] Le fichier existe
- [ ] Tous les exports sont corrects

---

### Step 4.9: Créer le fichier index des exports stays

- [ ] Créer le fichier `components/stays/index.ts` avec le contenu :

```typescript
export { StayCard } from './stay-card'
```

#### Vérification 4.9
- [ ] Le fichier existe
- [ ] L'export est correct

---

### Step 4.10: Ajouter les styles CSS pour le scrollbar caché

- [ ] Ajouter les styles suivants à la fin de `app/globals.css` :

```css
/* ========================================
   SCROLLBAR HIDE UTILITY
   ======================================== */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

#### Vérification 4.10
- [ ] Les styles sont ajoutés au fichier `globals.css`

---

### Step 4.11: Mettre à jour la page d'accueil

- [ ] Remplacer entièrement le contenu de `app/page.tsx` par :

```tsx
import {
  HeroSection,
  SearchBar,
  ServicesSection,
  WellnessSection,
  CollectionSection,
  TestimonialSection,
} from '@/components/home'

export default function HomePage() {
  return (
    <>
      {/* Hero with Search Bar */}
      <div className="relative">
        <HeroSection />
        <div className="absolute bottom-0 left-0 z-20 w-full translate-y-1/2">
          <SearchBar />
        </div>
      </div>

      {/* Spacer for Search Bar */}
      <div className="h-24" />

      {/* Services */}
      <ServicesSection />

      {/* Wellness & Sport */}
      <WellnessSection />

      {/* Collection */}
      <CollectionSection />

      {/* Testimonial */}
      <TestimonialSection />
    </>
  )
}
```

#### Vérification 4.11
- [ ] Le fichier est mis à jour
- [ ] La page d'accueil s'affiche correctement
- [ ] Toutes les sections sont visibles

---

## Verification Checklist Finale - Step 4

### Structure des fichiers
- [ ] `components/stays/stay-card.tsx` existe
- [ ] `components/stays/index.ts` existe
- [ ] `components/home/hero-section.tsx` existe
- [ ] `components/home/search-bar.tsx` existe
- [ ] `components/home/services-section.tsx` existe
- [ ] `components/home/wellness-section.tsx` existe
- [ ] `components/home/collection-section.tsx` existe
- [ ] `components/home/testimonial-section.tsx` existe
- [ ] `components/home/index.ts` existe
- [ ] `app/page.tsx` est mis à jour

### Tests Fonctionnels
- [ ] `npm run dev` démarre sans erreur
- [ ] La page d'accueil s'affiche à `http://localhost:3000`
- [ ] Le hero avec background image est visible
- [ ] La SearchBar est positionnée à cheval entre hero et contenu
- [ ] Les 3 cards services sont affichées avec effet hover
- [ ] Les 2 cards wellness sont affichées avec les tags
- [ ] Le carousel de séjours fonctionne (scroll horizontal)
- [ ] Les flèches de navigation du carousel fonctionnent
- [ ] Les StayCards affichent le prix, rating et badges
- [ ] Le bouton favori fonctionne sur les StayCards
- [ ] La section testimonial s'affiche avec la citation
- [ ] Le header reste visible (fixe) lors du scroll
- [ ] Le footer est visible en bas de page

### Tests Responsive
- [ ] Mobile (320px) : layout vertical, carousel scroll
- [ ] Tablet (768px) : grid 2 colonnes pour services
- [ ] Desktop (1024px+) : layout complet, flèches carousel

### Commande de test
```bash
npm run dev
# Ouvrir http://localhost:3000
# Tester le scroll, les hovers, le carousel
```

---

## Step 4 STOP & COMMIT

**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

Commande de commit suggérée :
```bash
git add .
git commit -m "feat: step 4 - page d'accueil complète

- Crée HeroSection avec background image et overlay
- Crée SearchBar flottante avec 3 champs
- Crée ServicesSection avec 3 cards (Chef, Conciergerie, Spa)
- Crée WellnessSection avec cards Sport et Bien-être
- Crée CollectionSection avec carousel de séjours
- Crée TestimonialSection avec citation client
- Crée StayCard réutilisable avec favoris et badges
- Layout responsive complet pour toutes les sections"
```
