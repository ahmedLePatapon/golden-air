# Step 6.1: Page Détails - Structure et Composants Principaux

## Goal
Créer la page dynamique de détails d'un séjour avec la galerie d'images (grid 4 colonnes + lightbox), le header (badges, titre, rating, localisation), et la section "Ce qui est inclus" en grid 2x2.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
```bash
git checkout feat/design-integration
```

**Important :** Les étapes 1 à 5 doivent être complétées avant de commencer cette étape.

---

## Step-by-Step Instructions

### Step 6.1.1: Créer le type Inclusion et mettre à jour les données

- [ ] Mettre à jour le fichier `lib/types/index.ts` pour ajouter le type Inclusion :

Ajouter à la fin du fichier, avant la dernière accolade ou export :

```typescript
// Types pour la page détails
export interface Inclusion {
  icon: string
  title: string
  description: string
}
```

- [ ] Mettre à jour le fichier `lib/data/stays.ts` pour ajouter le champ `inclusions` aux séjours existants.

Ajouter le champ `inclusions` à chaque séjour. Exemple pour le premier séjour :

```typescript
inclusions: [
  { icon: 'restaurant', title: 'Dîner Étoilé', description: 'Chef privé pour tous les repas' },
  { icon: 'airport_shuttle', title: 'Transfert de Luxe', description: 'Hélicoptère ou Mercedes Classe S' },
  { icon: 'spa', title: 'Spa & Bien-être', description: 'Massage quotidien & sauna privatif' },
  { icon: 'concierge', title: 'Majordome 24/7', description: 'Équipe de service dédiée' },
],
```

#### Vérification 6.1.1
- [ ] Pas d'erreur TypeScript
- [ ] Les séjours ont le champ `inclusions`

---

### Step 6.1.2: Créer le composant ImageGallery

- [ ] Créer le dossier `components/details/` s'il n'existe pas
- [ ] Créer le fichier `components/details/image-gallery.tsx` avec le contenu :

```tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'

interface ImageGalleryProps {
  images: string[]
  title: string
  className?: string
}

export function ImageGallery({ images, title, className }: ImageGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Ensure we have at least 5 images for the grid (repeat if needed)
  const galleryImages = images.length >= 5 
    ? images.slice(0, 5) 
    : [...images, ...images, ...images, ...images, ...images].slice(0, 5)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isLightboxOpen, goToPrevious, goToNext])

  return (
    <>
      {/* Gallery Grid */}
      <section className={cn('mb-10', className)}>
        <div className="relative grid h-[500px] grid-cols-1 grid-rows-2 gap-3 overflow-hidden rounded-2xl md:grid-cols-4">
          {/* Main Image (2x2) */}
          <div
            className="relative h-full cursor-pointer overflow-hidden bg-gray-800 md:col-span-2 md:row-span-2"
            onClick={() => openLightbox(0)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out hover:scale-105"
              style={{ backgroundImage: `url('${galleryImages[0]}')` }}
              role="img"
              aria-label={`${title} - Image 1`}
            />
          </div>

          {/* Secondary Images (4 small) */}
          {galleryImages.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative h-full cursor-pointer overflow-hidden bg-gray-800"
              onClick={() => openLightbox(index + 1)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out hover:scale-105"
                style={{ backgroundImage: `url('${image}')` }}
                role="img"
                aria-label={`${title} - Image ${index + 2}`}
              />
              
              {/* "View all photos" button on last image */}
              {index === 3 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openLightbox(0)
                  }}
                  className={cn(
                    'absolute bottom-4 right-4 flex items-center gap-2 rounded-lg px-4 py-2',
                    'bg-white text-black shadow-lg transition',
                    'hover:bg-gray-100',
                    'dark:bg-black/80 dark:text-white dark:hover:bg-black',
                    'text-sm font-bold'
                  )}
                >
                  <Icon name="grid_view" style={{ fontSize: '18px' }} />
                  Voir toutes les photos
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Fermer"
          >
            <Icon name="close" size="lg" />
          </button>

          {/* Image Counter */}
          <div className="absolute left-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Image précédente"
          >
            <Icon name="chevron_left" size="lg" />
          </button>

          {/* Current Image */}
          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Image suivante"
          >
            <Icon name="chevron_right" size="lg" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={cn(
                  'h-16 w-16 overflow-hidden rounded-lg border-2 transition',
                  index === currentIndex
                    ? 'border-white'
                    : 'border-transparent opacity-50 hover:opacity-100'
                )}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
```

#### Vérification 6.1.2
- [ ] Le fichier existe dans `components/details/`
- [ ] Pas d'erreur TypeScript

---

### Step 6.1.3: Créer le composant StayHeader

- [ ] Créer le fichier `components/details/stay-header.tsx` avec le contenu :

```tsx
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'

interface StayHeaderProps {
  title: string
  location: string
  country: string
  rating?: number
  reviewCount?: number
  tags?: string[]
  badge?: 'exclusive' | 'new' | 'all-inclusive' | 'best-seller'
  className?: string
}

export function StayHeader({
  title,
  location,
  country,
  rating = 5.0,
  reviewCount = 0,
  tags = [],
  badge,
  className,
}: StayHeaderProps) {
  // Build badges array from tags and badge prop
  const badges: string[] = [...tags]
  
  if (badge) {
    const badgeLabels: Record<string, string> = {
      'exclusive': 'Exclusif',
      'new': 'Nouveau',
      'all-inclusive': 'Tout Inclus',
      'best-seller': 'Best-seller',
    }
    if (!badges.includes(badgeLabels[badge])) {
      badges.unshift(badgeLabels[badge])
    }
  }

  return (
    <header
      className={cn(
        'border-b border-gray-200 pb-8 dark:border-gray-800',
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {badges.map((tag, index) => (
              <span
                key={index}
                className="rounded bg-primary/20 px-2 py-1 text-sm font-bold uppercase tracking-wider text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white md:text-5xl">
          {title}
        </h1>

        {/* Rating + Location */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 md:text-base">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Icon
              name="star"
              filled
              className="text-primary"
              style={{ fontSize: '20px' }}
            />
            <span className="font-bold text-slate-900 dark:text-white">
              {rating.toFixed(1)}
            </span>
            {reviewCount > 0 && (
              <span>({reviewCount} avis)</span>
            )}
          </div>

          {/* Separator */}
          <span className="hidden sm:inline">•</span>

          {/* Location */}
          <span>
            {location}, {country}
          </span>
        </div>
      </div>
    </header>
  )
}
```

#### Vérification 6.1.3
- [ ] Le fichier existe dans `components/details/`
- [ ] Pas d'erreur TypeScript

---

### Step 6.1.4: Créer le composant InclusionsGrid

- [ ] Créer le fichier `components/details/inclusions-grid.tsx` avec le contenu :

```tsx
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import type { Inclusion } from '@/lib/types'

interface InclusionsGridProps {
  inclusions: Inclusion[]
  className?: string
}

export function InclusionsGrid({ inclusions, className }: InclusionsGridProps) {
  if (!inclusions || inclusions.length === 0) {
    return null
  }

  return (
    <section className={cn('', className)}>
      <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
        Ce qui est inclus
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {inclusions.map((inclusion, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-4 rounded-xl border p-4',
              'border-gray-100 bg-white',
              'dark:border-gray-800 dark:bg-card-dark'
            )}
          >
            {/* Icon */}
            <div className="rounded-full bg-primary/20 p-2 text-primary">
              <Icon name={inclusion.icon} style={{ fontSize: '24px' }} />
            </div>

            {/* Text */}
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                {inclusion.title}
              </p>
              <p className="text-sm text-gray-500">
                {inclusion.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

#### Vérification 6.1.4
- [ ] Le fichier existe dans `components/details/`
- [ ] Pas d'erreur TypeScript

---

### Step 6.1.5: Créer le fichier index des exports

- [ ] Créer le fichier `components/details/index.ts` avec le contenu :

```typescript
export { ImageGallery } from './image-gallery'
export { StayHeader } from './stay-header'
export { InclusionsGrid } from './inclusions-grid'
```

#### Vérification 6.1.5
- [ ] Le fichier existe
- [ ] Tous les exports sont corrects

---

### Step 6.1.6: Créer la page de détails

- [ ] Créer le dossier `app/sejours/[slug]/`
- [ ] Créer le fichier `app/sejours/[slug]/page.tsx` avec le contenu :

```tsx
import { notFound } from 'next/navigation'
import { stays } from '@/lib/data/stays'
import { ImageGallery, StayHeader, InclusionsGrid } from '@/components/details'

interface StayDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all stays
export async function generateStaticParams() {
  return stays.map((stay) => ({
    slug: stay.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: StayDetailPageProps) {
  const { slug } = await params
  const stay = stays.find((s) => s.slug === slug)

  if (!stay) {
    return {
      title: 'Séjour non trouvé - Golden Air',
    }
  }

  return {
    title: `${stay.title} - Golden Air`,
    description: stay.description || stay.shortDescription,
  }
}

export default async function StayDetailPage({ params }: StayDetailPageProps) {
  const { slug } = await params
  const stay = stays.find((s) => s.slug === slug)

  if (!stay) {
    notFound()
  }

  // Prepare gallery images (use main image + gallery)
  const allImages = [stay.image, ...(stay.gallery || [])]

  return (
    <main className="min-h-screen bg-white pb-20 dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <ImageGallery images={allImages} title={stay.title} />

        {/* Main Content Layout */}
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left Column - Content (65%) */}
          <div className="w-full space-y-12 lg:w-[65%]">
            {/* Stay Header */}
            <StayHeader
              title={stay.title}
              location={stay.location}
              country={stay.country}
              rating={stay.rating}
              reviewCount={stay.reviewCount}
              tags={stay.tags}
              badge={stay.badge}
            />

            {/* Description */}
            {stay.description && (
              <section>
                <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                  À propos
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                  {stay.description}
                </p>
              </section>
            )}

            {/* Inclusions */}
            {stay.inclusions && stay.inclusions.length > 0 && (
              <InclusionsGrid inclusions={stay.inclusions} />
            )}

            {/* Placeholder for Step 6.2 components */}
            {/* Activities, Equipment, Timeline, Host, Reviews will be added here */}
          </div>

          {/* Right Column - Booking Sidebar (35%) */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-24">
              {/* Placeholder for BookingCard - will be added in Step 6.2 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700/50 dark:bg-card-dark">
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stay.price.toLocaleString('fr-FR')} €
                    </span>
                    <span className="text-sm text-gray-500">
                      {' '}/ {stay.priceType === 'per_night' ? 'nuit' : 'séjour'}
                    </span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500">
                  Booking card complet dans Step 6.2
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
```

#### Vérification 6.1.6
- [ ] Le dossier `app/sejours/[slug]/` existe
- [ ] Le fichier `page.tsx` existe
- [ ] Pas d'erreur TypeScript

---

### Step 6.1.7: Ajouter la couleur card-dark au Tailwind (si manquante)

- [ ] Vérifier dans `tailwind.config.ts` que la couleur `card-dark` existe. Si elle n'existe pas, l'ajouter :

Dans la section `theme.extend.colors`, ajouter :

```typescript
'card-dark': '#1e293b',
```

#### Vérification 6.1.7
- [ ] La couleur `card-dark` est disponible

---

## Verification Checklist Finale - Step 6.1

### Structure des fichiers
- [ ] `components/details/image-gallery.tsx` existe
- [ ] `components/details/stay-header.tsx` existe
- [ ] `components/details/inclusions-grid.tsx` existe
- [ ] `components/details/index.ts` existe
- [ ] `app/sejours/[slug]/page.tsx` existe

### Tests Fonctionnels
- [ ] `npm run dev` démarre sans erreur
- [ ] Naviguer vers `/sejours/[slug]` affiche la page (remplacer par un slug valide)
- [ ] La galerie affiche 5 images en grid (1 grande + 4 petites)
- [ ] Hover sur les images : effet zoom scale-105
- [ ] Clic sur une image : ouvre la lightbox
- [ ] Lightbox : navigation avec flèches ← →
- [ ] Lightbox : fermeture avec Escape ou clic sur backdrop
- [ ] Lightbox : thumbnails cliquables en bas
- [ ] Header affiche les badges en primary/20
- [ ] Header affiche le titre en text-4xl/5xl
- [ ] Header affiche rating + location
- [ ] Section "Ce qui est inclus" affiche les 4 items en grid 2x2
- [ ] Chaque inclusion a son icône + titre + description
- [ ] Layout 2 colonnes sur desktop (65%/35%)
- [ ] Sidebar sticky au scroll (top-24)

### Tests Responsive
- [ ] Mobile (320px) : galerie en 1 colonne empilée
- [ ] Tablet (768px) : galerie en grid 4 colonnes
- [ ] Desktop (1024px+) : layout 2 colonnes avec sidebar

### Commande de test
```bash
npm run dev
# Ouvrir http://localhost:3000/sejours/[slug-valide]
# Tester la galerie, le lightbox, le responsive
```

---

## Step 6.1 STOP & COMMIT

**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

Commande de commit suggérée :
```bash
git add .
git commit -m "feat: step 6.1 - page détails structure et composants principaux

- Crée ImageGallery avec grid 4 colonnes et lightbox modal
- Crée StayHeader avec badges, titre, rating et localisation
- Crée InclusionsGrid pour la section 'Ce qui est inclus'
- Crée la page dynamique app/sejours/[slug]/page.tsx
- Layout 2 colonnes (65%/35%) préparé pour booking sidebar
- Support responsive mobile/tablet/desktop
- Navigation clavier dans lightbox (Escape, ← →)"
```
