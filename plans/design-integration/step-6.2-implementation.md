# Step 6.2: Page Détails - Contenu Enrichi et Booking Sidebar

## Goal
Compléter la page détails d'un séjour avec les composants de contenu enrichi (activités, équipements, timeline, host, reviews) et la sidebar de réservation sticky.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
Si ce n'est pas le cas, exécutez : `git checkout feat/design-integration`

**Step 6.1 doit être complété** (page [slug] de base, galerie, header, inclusions)

---

### Step-by-Step Instructions

#### Step 1: Ajouter les Types et Données Mock

- [ ] Ouvrir `lib/types/index.ts` et **ajouter** les nouveaux types à la fin du fichier :

```typescript
// ===== Step 6.2: Types pour la page détails enrichie =====

export interface Activity {
  id: string
  title: string
  description: string
  image: string
  icon: string
}

export interface Equipment {
  name: string
  brand: string
  icon: string
  color: 'blue' | 'purple' | 'orange' | 'green' | 'red' | 'yellow'
}

export interface Host {
  name: string
  role: string
  experience: string
  avatar: string
  quote: string
}

export interface ReviewStats {
  average: number
  total: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}
```

- [ ] **Mettre à jour** l'interface `Stay` existante dans `lib/types/index.ts` pour ajouter les nouveaux champs optionnels :

```typescript
// Ajouter ces champs à l'interface Stay existante
export interface Stay {
  // ... champs existants (id, name, slug, description, etc.)
  
  // Step 6.2 - Contenu enrichi
  activities?: Activity[]
  equipment?: Equipment[]
  host?: Host
  reviewStats?: ReviewStats
}
```

- [ ] Ouvrir `lib/data/stays.ts` et **enrichir les données mock** d'au moins 2 séjours avec les nouvelles propriétés :

```typescript
// Ajouter ces données aux séjours existants (exemple pour le premier séjour)

// Dans le premier séjour du tableau stays, ajouter :
activities: [
  {
    id: 'act-1',
    title: 'Séances de HIIT avec coach privé',
    description: 'Séances de conditionnement métabolique en altitude adaptées à votre niveau.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    icon: 'timer'
  },
  {
    id: 'act-2',
    title: 'Randonnées guidées',
    description: 'Explorez des sentiers sauvages avec des guides locaux experts.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    icon: 'hiking'
  },
  {
    id: 'act-3',
    title: 'Yoga au lever du soleil',
    description: 'Séances régénératrices sur la terrasse panoramique.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    icon: 'self_improvement'
  }
],
equipment: [
  { name: 'Vélos Carbone', brand: 'BMC Roadmachine', icon: 'directions_bike', color: 'blue' },
  { name: 'Kits de Yoga', brand: 'Tapis Manduka Pro', icon: 'spa', color: 'purple' },
  { name: 'Équipement Rando', brand: 'Black Diamond', icon: 'hiking', color: 'orange' },
  { name: 'Montres Connectées', brand: 'Garmin Fenix 7', icon: 'watch', color: 'green' }
],
host: {
  name: 'Elara',
  role: 'Concierge Senior',
  experience: '8 ans chez Golden Air',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  quote: "Je me spécialise dans la création d'expériences alpines fluides. De la réservation des meilleures tables à l'organisation de célébrations surprises, je suis là pour rendre votre séjour inoubliable."
},
reviewStats: {
  average: 5.0,
  total: 12,
  distribution: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 }
}
```

##### Step 1 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Les types Activity, Equipment, Host, ReviewStats sont exportés
- [ ] L'interface Stay inclut les nouveaux champs optionnels
- [ ] Au moins 1 séjour a les données mock complètes

#### Step 1 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 2: Créer le Composant ActivityCard

- [ ] Créer le fichier `components/details/activity-card.tsx` :

```typescript
'use client'

import Image from 'next/image'
import { Icon } from '@/components/ui/icon'
import type { Activity } from '@/lib/types'

interface ActivityCardProps {
  activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
      <Image
        src={activity.image}
        alt={activity.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-full bg-primary text-white">
            <Icon name={activity.icon} className="text-lg" />
          </div>
        </div>
        <h4 className="text-white font-bold text-lg leading-tight">
          {activity.title}
        </h4>
        <p className="text-gray-300 text-sm mt-1 line-clamp-2">
          {activity.description}
        </p>
      </div>
    </div>
  )
}
```

- [ ] Créer le fichier `components/details/activities-section.tsx` :

```typescript
import { ActivityCard } from './activity-card'
import type { Activity } from '@/lib/types'

interface ActivitiesSectionProps {
  activities: Activity[]
}

export function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  if (!activities || activities.length === 0) return null

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Focus Bien-être & Performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  )
}
```

##### Step 2 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Les composants ActivityCard et ActivitiesSection sont créés
- [ ] L'effet de zoom au hover fonctionne (group-hover:scale-110)

#### Step 2 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 3: Créer le Composant EquipmentGrid

- [ ] Créer le fichier `components/details/equipment-grid.tsx` :

```typescript
import { Icon } from '@/components/ui/icon'
import type { Equipment } from '@/lib/types'

interface EquipmentGridProps {
  equipment: Equipment[]
}

const colorClasses: Record<Equipment['color'], { bg: string; text: string }> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-primary'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400'
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    text: 'text-yellow-600 dark:text-yellow-400'
  }
}

export function EquipmentGrid({ equipment }: EquipmentGridProps) {
  if (!equipment || equipment.length === 0) return null

  return (
    <section className="mt-16">
      <div className="bg-gray-50 dark:bg-[#161f2f] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="inventory_2" className="text-primary" />
            Équipements Sportifs Fournis
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Matériel haut de gamme inclus dans votre séjour
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {equipment.map((item, index) => {
            const colors = colorClasses[item.color]
            return (
              <div
                key={index}
                className="flex items-center gap-3 bg-white dark:bg-card-dark p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm transition-colors hover:border-primary/50"
              >
                <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center ${colors.text}`}>
                  <Icon name={item.icon} />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.brand}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

##### Step 3 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Chaque équipement a la couleur d'icône appropriée
- [ ] L'effet hover sur les items fonctionne (border-primary/50)

#### Step 3 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 4: Créer le Composant Timeline

- [ ] Créer le fichier `components/details/timeline.tsx` :

```typescript
import type { ItineraryDay } from '@/lib/types'

interface TimelineProps {
  itinerary: ItineraryDay[]
}

export function Timeline({ itinerary }: TimelineProps) {
  if (!itinerary || itinerary.length === 0) return null

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
        Votre Itinéraire sur Mesure
      </h3>
      <div className="relative pl-8 border-l border-gray-200 dark:border-gray-700 space-y-10">
        {itinerary.map((day, index) => (
          <div key={index} className="relative">
            {/* Dot indicator */}
            <div 
              className={`absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-background-dark ${
                index === 0 
                  ? 'bg-primary' 
                  : 'bg-gray-400 dark:bg-gray-600'
              }`}
            />
            <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Jour {day.day} : {day.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {day.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

##### Step 4 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le premier jour a un dot bleu (bg-primary)
- [ ] Les jours suivants ont un dot gris
- [ ] La ligne verticale connecte tous les jours

#### Step 4 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 5: Créer le Composant HostCard

- [ ] Créer le fichier `components/details/host-card.tsx` :

```typescript
import type { Host } from '@/lib/types'

interface HostCardProps {
  host: Host
}

export function HostCard({ host }: HostCardProps) {
  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Votre Concierge Dédié
      </h3>
      <div className="flex items-start gap-6 p-6 rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800">
        <div className="flex-shrink-0">
          <div 
            className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-primary"
            style={{ backgroundImage: `url("${host.avatar}")` }}
          />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Hôte : {host.name}
          </h4>
          <p className="text-sm text-primary font-medium mb-2">
            {host.role} • {host.experience}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm italic">
            "{host.quote}"
          </p>
        </div>
      </div>
    </section>
  )
}
```

##### Step 5 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] L'avatar s'affiche avec la bordure primary
- [ ] La citation est en italique

#### Step 5 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 6: Créer le Composant ReviewSection

- [ ] Créer le fichier `components/details/review-section.tsx` :

```typescript
import { Icon } from '@/components/ui/icon'
import type { ReviewStats } from '@/lib/types'

interface ReviewSectionProps {
  stats: ReviewStats
}

export function ReviewSection({ stats }: ReviewSectionProps) {
  const ratings = [5, 4, 3, 2, 1] as const

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Avis des Voyageurs
      </h3>
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white dark:bg-card-dark p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
        {/* Score global */}
        <div className="flex flex-col items-center gap-2 min-w-[120px]">
          <span className="text-5xl font-black text-slate-900 dark:text-white">
            {stats.average.toFixed(1)}
          </span>
          <div className="flex text-primary">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="star"
                filled={star <= Math.round(stats.average)}
                className="text-xl"
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {stats.total} avis vérifiés
          </span>
        </div>

        {/* Rating bars */}
        <div className="w-full flex-1 space-y-3">
          {ratings.map((rating) => {
            const percentage = stats.distribution[rating]
            return (
              <div key={rating} className="flex items-center gap-3 text-sm">
                <span className="w-3 text-slate-900 dark:text-white font-medium">
                  {rating}
                </span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-500">
                  {percentage}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

##### Step 6 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le score global s'affiche en grand avec les étoiles
- [ ] Les barres de progression reflètent la distribution des avis
- [ ] Layout responsive (colonne sur mobile, ligne sur desktop)

#### Step 6 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 7: Créer le Composant BookingCard

- [ ] Créer le fichier `components/details/booking-card.tsx` :

```typescript
'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import type { Stay } from '@/lib/types'

interface BookingCardProps {
  stay: Stay
}

export function BookingCard({ stay }: BookingCardProps) {
  const [guests, setGuests] = useState(2)
  
  // Calcul des prix (simplifié)
  const basePrice = stay.price
  const serviceFee = Math.round(basePrice * 0.15)
  const taxes = Math.round(basePrice * 0.05)
  const total = basePrice + serviceFee + taxes

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="sticky top-24">
      <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700/50">
        {/* Prix */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {formatPrice(total)}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm"> / total</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-primary font-medium">
            <Icon name="verified" className="text-lg" />
            <span>Meilleur prix garanti</span>
          </div>
        </div>

        {/* Date/Guest Selector */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-xl mb-6 overflow-hidden">
          <div className="grid grid-cols-2 border-b border-gray-300 dark:border-gray-600">
            <div className="p-3 border-r border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Arrivée
              </label>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                Sélectionner
              </div>
            </div>
            <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Départ
              </label>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                Sélectionner
              </div>
            </div>
          </div>
          <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Voyageurs
            </label>
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                {guests} Voyageur{guests > 1 ? 's' : ''}
              </div>
              <Icon name="expand_more" className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button className="w-full py-4 text-lg shadow-lg shadow-blue-900/20 mb-4 flex items-center justify-center gap-2">
          <span>Demande de réservation</span>
          <Icon name="arrow_forward" />
        </Button>

        {/* Notice */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucun prélèvement immédiat
          </p>

          {/* Price breakdown */}
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span className="underline decoration-dotted cursor-help">Prix de base</span>
              <span>{formatPrice(basePrice)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span className="underline decoration-dotted cursor-help">Frais de service</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span className="underline decoration-dotted cursor-help">Taxes de séjour</span>
              <span>{formatPrice(taxes)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between font-bold text-base text-slate-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Secure payment badge */}
        <div className="mt-6 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800/50 p-2 rounded-lg">
          <Icon name="lock" className="text-gray-400 text-lg" />
          <span className="text-xs text-gray-500 font-medium">Paiement sécurisé SSL</span>
        </div>
      </div>

      {/* Contact button */}
      <div className="mt-6 text-center">
        <button className="text-gray-500 hover:text-primary transition-colors text-sm flex items-center justify-center gap-2 w-full">
          <Icon name="chat" className="text-lg" />
          Contacter la Conciergerie
        </button>
      </div>
    </div>
  )
}
```

##### Step 7 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le prix total et le détail des prix s'affichent correctement
- [ ] Les sélecteurs de date/voyageurs ont l'effet hover
- [ ] Le bouton CTA est bien visible
- [ ] Le badge de paiement sécurisé est présent

#### Step 7 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 8: Mettre à jour les Exports et Tailwind Config

- [ ] Mettre à jour le fichier `components/details/index.ts` pour ajouter les nouveaux exports :

```typescript
// Exports existants de Step 6.1
export { ImageGallery } from './image-gallery'
export { StayHeader } from './stay-header'
export { InclusionsGrid } from './inclusions-grid'

// Step 6.2 - Nouveaux composants
export { ActivityCard } from './activity-card'
export { ActivitiesSection } from './activities-section'
export { EquipmentGrid } from './equipment-grid'
export { Timeline } from './timeline'
export { HostCard } from './host-card'
export { ReviewSection } from './review-section'
export { BookingCard } from './booking-card'
```

- [ ] Vérifier que `tailwind.config.ts` contient la couleur `card-dark`. Si elle n'existe pas, l'ajouter dans la section `colors` :

```typescript
// Dans tailwind.config.ts, ajouter dans la section colors si manquant :
'card-dark': '#1e293b',
```

##### Step 8 Verification Checklist
- [ ] Tous les composants sont exportés depuis index.ts
- [ ] La couleur card-dark est disponible dans Tailwind

#### Step 8 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 9: Intégrer tous les composants dans la Page Détails

- [ ] Mettre à jour le fichier `app/sejours/[slug]/page.tsx` pour intégrer tous les nouveaux composants :

```typescript
import { notFound } from 'next/navigation'
import { stays } from '@/lib/data/stays'
import {
  ImageGallery,
  StayHeader,
  InclusionsGrid,
  ActivitiesSection,
  EquipmentGrid,
  Timeline,
  HostCard,
  ReviewSection,
  BookingCard
} from '@/components/details'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return stays.map((stay) => ({
    slug: stay.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const stay = stays.find((s) => s.slug === slug)
  
  if (!stay) {
    return { title: 'Séjour non trouvé' }
  }
  
  return {
    title: `${stay.name} | Golden Air`,
    description: stay.description,
  }
}

export default async function StayDetailPage({ params }: PageProps) {
  const { slug } = await params
  const stay = stays.find((s) => s.slug === slug)

  if (!stay) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Galerie Photos */}
      <ImageGallery images={stay.images} name={stay.name} />

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Colonne gauche - Contenu (65%) */}
          <div className="lg:w-[65%]">
            {/* Header avec badges, titre, rating */}
            <StayHeader stay={stay} />

            {/* Ce qui est inclus */}
            {stay.inclusions && stay.inclusions.length > 0 && (
              <InclusionsGrid inclusions={stay.inclusions} />
            )}

            {/* Activités Bien-être & Performance */}
            {stay.activities && stay.activities.length > 0 && (
              <ActivitiesSection activities={stay.activities} />
            )}

            {/* Équipements Sportifs */}
            {stay.equipment && stay.equipment.length > 0 && (
              <EquipmentGrid equipment={stay.equipment} />
            )}

            {/* Itinéraire */}
            {stay.itinerary && stay.itinerary.length > 0 && (
              <Timeline itinerary={stay.itinerary} />
            )}

            {/* Concierge */}
            {stay.host && <HostCard host={stay.host} />}

            {/* Avis */}
            {stay.reviewStats && <ReviewSection stats={stay.reviewStats} />}
          </div>

          {/* Colonne droite - Booking (35%) */}
          <div className="lg:w-[35%]">
            <BookingCard stay={stay} />
          </div>
        </div>
      </div>
    </main>
  )
}
```

##### Step 9 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] La page s'affiche sans erreur
- [ ] Naviguer vers `/sejours/{slug}` affiche tous les composants
- [ ] Le layout 65%/35% est respecté sur desktop
- [ ] La BookingCard est sticky au scroll
- [ ] Les sections sans données ne s'affichent pas (conditional rendering)

#### Step 9 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

## Summary

### Composants Créés
| Fichier | Description |
|---------|-------------|
| `components/details/activity-card.tsx` | Card activité avec image overlay et effet zoom |
| `components/details/activities-section.tsx` | Grille de 3 activités |
| `components/details/equipment-grid.tsx` | Grille 4 colonnes équipements avec icônes colorées |
| `components/details/timeline.tsx` | Timeline verticale avec dots colorés |
| `components/details/host-card.tsx` | Card concierge avec avatar et citation |
| `components/details/review-section.tsx` | Score global + barres de distribution |
| `components/details/booking-card.tsx` | Sidebar sticky avec prix et CTA |

### Types Ajoutés
- `Activity` - Activité bien-être
- `Equipment` - Équipement sportif
- `Host` - Concierge/Hôte
- `ReviewStats` - Statistiques des avis

### Points d'Attention
- La BookingCard utilise `sticky top-24` pour rester visible au scroll
- Les sélecteurs de date/voyageurs sont visuels uniquement (pas de fonctionnalité dans cette étape)
- Les couleurs d'icônes dans EquipmentGrid sont mappées via `colorClasses`
- Le composant Icon doit supporter la prop `filled` pour les étoiles
