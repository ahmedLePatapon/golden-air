# Step 7: Page Concept & Philosophie

## Goal
Créer la page "Notre Concept" avec un hero full-screen, une section citation philosophie, des sections feature alternées image/texte, une timeline verticale historique, une grille de logos partenaires et un CTA final avec effet glass.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
```bash
git checkout feat/design-integration
```

**Important :** Les étapes 1 à 5 doivent être complétées avant de commencer cette étape.

---

## Step-by-Step Instructions

### Step 7.1: Créer le composant PageHero

- [ ] Créer le fichier `components/concept/page-hero.tsx` avec le contenu :

```tsx
'use client'

import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'

interface PageHeroProps {
  badge: string
  title: string
  description: string
  backgroundImage: string
  showScrollIndicator?: boolean
  className?: string
}

export function PageHero({
  badge,
  title,
  description,
  backgroundImage,
  showScrollIndicator = true,
  className,
}: PageHeroProps) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    })
  }

  return (
    <section
      className={cn(
        'relative flex h-[85vh] w-full items-center justify-center overflow-hidden',
        className
      )}
    >
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(16, 22, 34, 0.4), rgba(16, 22, 34, 0.85)), url('${backgroundImage}')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* Badge */}
        <span
          className={cn(
            'mb-6 inline-block rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5',
            'text-xs font-bold uppercase tracking-[0.2em] text-primary'
          )}
        >
          {badge}
        </span>

        {/* Title */}
        <h1 className="mb-8 text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
          {title}
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-slate-200 md:text-xl">
          {description}
        </p>

        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <button
            onClick={scrollToContent}
            className="mt-12 opacity-50 transition-opacity hover:opacity-100"
            aria-label="Défiler vers le contenu"
          >
            <Icon
              name="keyboard_double_arrow_down"
              className="animate-bounce text-3xl text-white"
            />
          </button>
        )}
      </div>
    </section>
  )
}
```

#### Vérification 7.1
- [ ] Le fichier existe dans `components/concept/`
- [ ] Pas d'erreur TypeScript

---

### Step 7.2: Créer le composant QuoteSection

- [ ] Créer le fichier `components/concept/quote-section.tsx` avec le contenu :

```tsx
import { cn } from '@/lib/utils'

interface QuoteSectionProps {
  title: string
  quote: string
  className?: string
}

export function QuoteSection({ title, quote, className }: QuoteSectionProps) {
  return (
    <section className={cn('mx-auto max-w-4xl px-6 py-24 text-center', className)}>
      <h2 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
        {title}
      </h2>
      <p className="text-lg italic leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
        &ldquo;{quote}&rdquo;
      </p>
    </section>
  )
}
```

#### Vérification 7.2
- [ ] Le fichier existe dans `components/concept/`
- [ ] Les guillemets français s'affichent correctement

---

### Step 7.3: Créer le composant FeatureRow

- [ ] Créer le fichier `components/concept/feature-row.tsx` avec le contenu :

```tsx
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Stat {
  value: string
  label: string
}

interface FeatureRowProps {
  tagline: string
  title: string
  description: string
  image: string
  imageAlt: string
  imagePosition?: 'left' | 'right'
  link?: {
    text: string
    href: string
  }
  stats?: Stat[]
  showBlurCircle?: boolean
  className?: string
}

export function FeatureRow({
  tagline,
  title,
  description,
  image,
  imageAlt,
  imagePosition = 'left',
  link,
  stats,
  showBlurCircle = false,
  className,
}: FeatureRowProps) {
  const isImageLeft = imagePosition === 'left'

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-12 md:gap-16',
        isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse',
        className
      )}
    >
      {/* Image Side */}
      <div className="relative w-full md:w-1/2">
        {showBlurCircle && (
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        )}
        <div
          className="relative z-10 aspect-[4/3] w-full rounded-xl bg-cover bg-center shadow-2xl"
          style={{ backgroundImage: `url('${image}')` }}
          role="img"
          aria-label={imageAlt}
        />
      </div>

      {/* Content Side */}
      <div className="w-full md:w-1/2">
        {/* Tagline */}
        <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-primary">
          {tagline}
        </span>

        {/* Title */}
        <h3 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>

        {/* Link (if provided) */}
        {link && (
          <Link
            href={link.href}
            className="group flex cursor-pointer items-center gap-4"
          >
            <span className="h-px w-12 bg-primary transition-all group-hover:w-20" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              {link.text}
            </span>
          </Link>
        )}

        {/* Stats (if provided) */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg border border-white/5 bg-white/5 p-4 backdrop-blur-sm',
                  'dark:border-slate-700 dark:bg-slate-800/50'
                )}
              >
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-tight text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

#### Vérification 7.3
- [ ] Le fichier existe dans `components/concept/`
- [ ] L'alternance gauche/droite fonctionne

---

### Step 7.4: Créer le composant VerticalTimeline

- [ ] Créer le fichier `components/concept/vertical-timeline.tsx` avec le contenu :

```tsx
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'

interface TimelineItem {
  year: string
  title: string
  description: string
  icon: string
  isActive?: boolean
}

interface VerticalTimelineProps {
  title: string
  items: TimelineItem[]
  className?: string
}

export function VerticalTimeline({
  title,
  items,
  className,
}: VerticalTimelineProps) {
  return (
    <section
      className={cn(
        'bg-slate-50 py-32 dark:bg-[#0c111d]',
        className
      )}
    >
      <div className="mx-auto max-w-3xl px-6">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative grid grid-cols-[40px_1fr] gap-x-8">
          {/* Vertical Line */}
          <div className="absolute bottom-6 left-[19px] top-6 w-[2px] bg-slate-200 dark:bg-slate-800" />

          {items.map((item, index) => (
            <div key={index} className="contents">
              {/* Icon Circle */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-white',
                    item.isActive
                      ? 'bg-primary'
                      : 'bg-slate-800 dark:bg-slate-700'
                  )}
                >
                  <Icon name={item.icon} style={{ fontSize: '20px' }} />
                </div>
              </div>

              {/* Content */}
              <div
                className={cn(
                  'pt-2',
                  index < items.length - 1 ? 'pb-16' : ''
                )}
              >
                <p
                  className={cn(
                    'mb-1 text-sm font-bold uppercase tracking-widest',
                    item.isActive ? 'text-primary' : 'text-slate-500'
                  )}
                >
                  {item.year}
                </p>
                <h4 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

#### Vérification 7.4
- [ ] Le fichier existe dans `components/concept/`
- [ ] La ligne verticale est visible
- [ ] Les icônes s'affichent

---

### Step 7.5: Créer le composant PartnerLogos

- [ ] Créer le fichier `components/concept/partner-logos.tsx` avec le contenu :

```tsx
import { cn } from '@/lib/utils'

interface PartnerLogo {
  name: string
  fontClass: string
}

interface PartnerLogosProps {
  label: string
  logos: PartnerLogo[]
  className?: string
}

export function PartnerLogos({ label, logos, className }: PartnerLogosProps) {
  return (
    <section
      className={cn(
        'border-t border-slate-200 py-24 dark:border-slate-800',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Label */}
        <p className="mb-12 text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
          {label}
        </p>

        {/* Logos Grid */}
        <div
          className={cn(
            'grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6',
            'opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0'
          )}
        >
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex h-12 items-center justify-center"
            >
              <span
                className={cn(
                  'text-2xl text-slate-700 dark:text-slate-300',
                  logo.fontClass
                )}
              >
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

#### Vérification 7.5
- [ ] Le fichier existe dans `components/concept/`
- [ ] Les logos sont en grille responsive

---

### Step 7.6: Créer le composant CTASection

- [ ] Créer le fichier `components/concept/cta-section.tsx` avec le contenu :

```tsx
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CTASectionProps {
  title: string
  description: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton: {
    text: string
    href: string
  }
  className?: string
}

export function CTASection({
  title,
  description,
  primaryButton,
  secondaryButton,
  className,
}: CTASectionProps) {
  return (
    <section className={cn('relative px-6 py-24', className)}>
      <div
        className={cn(
          'relative mx-auto max-w-5xl overflow-hidden rounded-2xl p-12 text-center md:p-20',
          'border border-white/5 bg-white/5 backdrop-blur-md',
          'dark:border-slate-700/50 dark:bg-slate-800/30'
        )}
      >
        {/* Decorative Blur Circles */}
        <div className="absolute -mr-32 -mt-32 right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -mb-32 -ml-32 bottom-0 left-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        {/* Content */}
        <h2 className="relative z-10 mb-6 text-4xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="relative z-10 mx-auto mb-10 max-w-xl text-lg text-slate-600 dark:text-slate-400">
          {description}
        </p>

        {/* Buttons */}
        <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="shadow-xl shadow-primary/20">
            <Link href={primaryButton.href}>{primaryButton.text}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={secondaryButton.href}>{secondaryButton.text}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

#### Vérification 7.6
- [ ] Le fichier existe dans `components/concept/`
- [ ] L'effet glass blur est visible
- [ ] Les cercles décoratifs s'affichent

---

### Step 7.7: Créer le fichier index des exports

- [ ] Créer le fichier `components/concept/index.ts` avec le contenu :

```typescript
export { PageHero } from './page-hero'
export { QuoteSection } from './quote-section'
export { FeatureRow } from './feature-row'
export { VerticalTimeline } from './vertical-timeline'
export { PartnerLogos } from './partner-logos'
export { CTASection } from './cta-section'
```

#### Vérification 7.7
- [ ] Le fichier existe
- [ ] Tous les exports sont corrects

---

### Step 7.8: Créer la page Concept

- [ ] Créer le fichier `app/concept/page.tsx` avec le contenu :

```tsx
import {
  PageHero,
  QuoteSection,
  FeatureRow,
  VerticalTimeline,
  PartnerLogos,
  CTASection,
} from '@/components/concept'

// Timeline data
const timelineItems = [
  {
    year: '2020',
    title: 'La Genèse',
    description:
      'Une vision du luxe accessible est née dans un contexte de voyage en mutation, mettant l\'accent sur la confidentialité et la flexibilité absolue.',
    icon: 'auto_awesome',
    isActive: true,
  },
  {
    year: '2022',
    title: 'La Curation',
    description:
      'Expansion de notre empreinte en construisant un réseau de partenaires exclusifs à travers la Méditerranée et les régions alpines.',
    icon: 'handshake',
    isActive: false,
  },
  {
    year: '2024 & Au-delà',
    title: 'Rayonnement Mondial',
    description:
      'Étendre le standard Golden Air à l\'international, garantissant un luxe sans faille partout où nos clients choisissent d\'explorer.',
    icon: 'public',
    isActive: false,
  },
]

// Partner logos data
const partnerLogos = [
  { name: 'ELYSIAN', fontClass: 'font-black italic tracking-tighter' },
  { name: 'AZURE', fontClass: 'font-light tracking-[0.4em]' },
  { name: 'NEXUS', fontClass: 'font-bold tracking-widest' },
  { name: 'Aura.', fontClass: 'font-serif' },
  { name: 'V-Vista', fontClass: 'font-mono uppercase' },
  { name: 'SOLIS', fontClass: 'font-black' },
]

export default function ConceptPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-background-dark">
      {/* Hero Section */}
      <PageHero
        badge="La Vision"
        title="Le Luxe Accessible"
        description="Redéfinir les séjours premium avec une approche sur mesure du luxe moderne. Le luxe n'est plus seulement une destination ; c'est une expérience créée spécifiquement pour vous."
        backgroundImage="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
        showScrollIndicator
      />

      {/* Philosophy Quote */}
      <QuoteSection
        title="Notre Philosophie"
        quote="Golden Air fait le pont entre le luxe premium et la flexibilité des courts séjours, garantissant que chaque voyage soit aussi unique que nos clients. Nous croyons en un service haut de gamme qui se veut invisible mais indispensable."
      />

      {/* Feature Sections */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* Feature Row 1 - Image Left */}
        <FeatureRow
          tagline="Personnalisation"
          title="Une Approche Sur Mesure"
          description="Chaque séjour Golden Air est unique. Notre équipe de concierges élabore des itinéraires qui vont au-delà des simples réservations, intégrant vos préférences, vos désirs culinaires et vos objectifs de bien-être personnel dans un récit harmonieux."
          image="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
          imageAlt="Approche personnalisée Golden Air"
          imagePosition="left"
          showBlurCircle
          link={{
            text: 'Découvrir le Processus',
            href: '/devis',
          }}
          className="mb-32"
        />

        {/* Feature Row 2 - Image Right */}
        <FeatureRow
          tagline="La Curation"
          title="Réseau Exclusif"
          description="Nous ne trouvons pas simplement des chambres ; nous offrons des expériences. Notre réseau se compose de propriétaires triés sur le volet et de prestataires de services qui partagent notre engagement pour l'excellence absolue et la discrétion."
          image="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"
          imageAlt="Réseau exclusif de propriétés"
          imagePosition="right"
          stats={[
            { value: '500+', label: 'Propriétés Privées' },
            { value: '24/7', label: 'Conciergerie Lifestyle' },
          ]}
        />
      </section>

      {/* Timeline Section */}
      <VerticalTimeline
        title="L'Histoire de Golden Air"
        items={timelineItems}
      />

      {/* Partner Logos */}
      <PartnerLogos
        label="La Confiance de Nos Partenaires Mondiaux"
        logos={partnerLogos}
      />

      {/* CTA Section */}
      <CTASection
        title="Vivez la Vision"
        description="Êtes-vous prêt à redéfinir votre conception du voyage ? Rejoignez notre cercle de membres pour un accès exclusif aux séjours les plus uniques au monde."
        primaryButton={{
          text: 'Devenir Membre',
          href: '/contact',
        }}
        secondaryButton={{
          text: 'Voir les Destinations',
          href: '/sejours',
        }}
      />
    </main>
  )
}
```

#### Vérification 7.8
- [ ] Le fichier existe dans `app/concept/`
- [ ] Pas d'erreur TypeScript

---

## Verification Checklist Finale - Step 7

### Structure des fichiers
- [ ] `components/concept/page-hero.tsx` existe
- [ ] `components/concept/quote-section.tsx` existe
- [ ] `components/concept/feature-row.tsx` existe
- [ ] `components/concept/vertical-timeline.tsx` existe
- [ ] `components/concept/partner-logos.tsx` existe
- [ ] `components/concept/cta-section.tsx` existe
- [ ] `components/concept/index.ts` existe
- [ ] `app/concept/page.tsx` existe

### Tests Fonctionnels
- [ ] `npm run dev` démarre sans erreur
- [ ] La page est accessible à `http://localhost:3000/concept`
- [ ] Le hero full-screen s'affiche avec le badge "La Vision"
- [ ] Le scroll indicator bounce animation fonctionne
- [ ] Cliquer sur le scroll indicator fait défiler la page
- [ ] La section quote s'affiche avec guillemets français
- [ ] Feature Row 1 : image à gauche, texte à droite
- [ ] Feature Row 2 : image à droite, texte à gauche
- [ ] Le lien "Découvrir le Processus" a une animation au hover
- [ ] Les stats (500+, 24/7) s'affichent dans des cards glass
- [ ] La timeline verticale affiche les 3 étapes
- [ ] Le premier item de la timeline est en primary (bleu)
- [ ] Les icônes Material Symbols s'affichent dans la timeline
- [ ] Les logos partenaires sont en grayscale par défaut
- [ ] Au hover sur la zone logos, ils deviennent colorés
- [ ] La section CTA a un effet glass blur
- [ ] Les cercles décoratifs blur sont visibles
- [ ] Les deux boutons CTA fonctionnent

### Tests Responsive
- [ ] Mobile (320px) : layout en colonnes, hero 85vh
- [ ] Tablet (768px) : feature rows en 2 colonnes, logos 4 colonnes
- [ ] Desktop (1024px+) : logos 6 colonnes, spacing optimal

### Tests Dark/Light Mode
- [ ] Basculer le thème : backgrounds changent correctement
- [ ] Textes lisibles dans les deux modes
- [ ] Timeline background change (#0c111d en dark)

### Commande de test
```bash
npm run dev
# Ouvrir http://localhost:3000/concept
# Tester le scroll, les hovers, le responsive
# Basculer dark/light mode
```

---

## Step 7 STOP & COMMIT

**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

Commande de commit suggérée :
```bash
git add .
git commit -m "feat: step 7 - page concept et philosophie

- Crée PageHero avec badge, titre et scroll indicator
- Crée QuoteSection pour la citation philosophie
- Crée FeatureRow avec layout alternant image/texte
- Crée VerticalTimeline avec icônes et ligne verticale
- Crée PartnerLogos avec grille et effet grayscale hover
- Crée CTASection avec effet glass blur et cercles décoratifs
- Assemble tous les composants dans app/concept/page.tsx
- Support complet dark/light mode
- Layout responsive mobile/tablet/desktop"
```
