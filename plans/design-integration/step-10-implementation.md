# Step 10: Responsive & Animations Finales

## Goal
Finaliser l'intégration en effectuant un audit responsive complet, en ajoutant des animations subtiles avec Framer Motion, en optimisant les images avec next/image, et en améliorant l'accessibilité de tous les composants.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
Si ce n'est pas le cas, exécutez : `git checkout feat/design-integration`

**Steps 1-9 doivent être complétés** (tous les composants et pages créés)

---

### Step-by-Step Instructions

#### Step 1: Installer Framer Motion et Créer les Animations

- [ ] Installer framer-motion :

```bash
npm install framer-motion
```

- [ ] Créer le fichier `lib/animations.ts` :

```typescript
import { Variants } from 'framer-motion'

// Fade in vers le haut
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

// Fade in simple
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

// Container pour stagger children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

// Scale up
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 }
  }
}

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}
```

##### Step 1 Verification Checklist
- [ ] framer-motion est installé (`npm list framer-motion`)
- [ ] Pas d'erreurs TypeScript dans `lib/animations.ts`

#### Step 1 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 2: Créer les Composants d'Animation Réutilisables

- [ ] Créer le fichier `components/ui/animate-on-scroll.tsx` :

```typescript
'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { fadeInUp } from '@/lib/animations'

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
  variants?: Variants
  once?: boolean
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  variants = fadeInUp,
  once = true
}: AnimateOnScrollProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] Créer le fichier `components/ui/stagger-list.tsx` :

```typescript
'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode, Children } from 'react'
import { staggerContainer, fadeInUp } from '@/lib/animations'

interface StaggerListProps {
  children: ReactNode
  className?: string
  itemVariants?: Variants
  once?: boolean
}

export function StaggerList({
  children,
  className,
  itemVariants = fadeInUp,
  once = true
}: StaggerListProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-50px' })
  const childArray = Children.toArray(children)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {childArray.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

##### Step 2 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Les composants sont exportés

#### Step 2 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 3: Créer le Skip Link pour l'Accessibilité

- [ ] Créer le fichier `components/ui/skip-link.tsx` :

```typescript
'use client'

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[100]
        bg-primary text-white
        px-4 py-2 rounded-lg
        font-bold text-sm
        focus:outline-none focus:ring-2 focus:ring-white
        transition-transform
        -translate-y-full focus:translate-y-0
      "
    >
      Aller au contenu principal
    </a>
  )
}
```

- [ ] Mettre à jour `app/layout.tsx` pour intégrer le Skip Link et ajouter l'id au main :

```typescript
// Ajouter l'import en haut du fichier
import { SkipLink } from '@/components/ui/skip-link'

// Dans le return du RootLayout, ajouter SkipLink après <body> et id="main-content" au <main>
// Exemple de structure:
// <body>
//   <SkipLink />
//   <Header />
//   <main id="main-content" tabIndex={-1}>
//     {children}
//   </main>
//   <Footer />
// </body>
```

##### Step 3 Verification Checklist
- [ ] Le Skip Link apparaît quand on Tab au chargement de la page
- [ ] Le Skip Link redirige vers le contenu principal

#### Step 3 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 4: Ajouter les Focus States dans globals.css

- [ ] Ouvrir `app/globals.css` et **ajouter** les styles de focus après les styles existants :

```css
/* ===== Step 10: Focus States & Accessibility ===== */

@layer base {
  /* Focus visible global */
  :focus-visible {
    outline: 2px solid #1152d4;
    outline-offset: 2px;
  }

  /* Reset focus pour les éléments avec styles custom */
  :focus:not(:focus-visible) {
    outline: none;
  }
}

@layer components {
  /* Focus ring pour boutons */
  .focus-ring {
    @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2;
  }

  /* Focus ring en dark mode */
  .focus-ring-dark {
    @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark;
  }

  /* Focus state pour inputs */
  .input-focus {
    @apply focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary;
  }

  /* Focus state pour cards cliquables */
  .card-focus {
    @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4;
  }

  /* Focus state pour liens */
  .link-focus {
    @apply focus:outline-none focus-visible:underline focus-visible:text-primary;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ===== Print Styles ===== */
@media print {
  .no-print {
    display: none !important;
  }
}
```

##### Step 4 Verification Checklist
- [ ] Les focus states sont visibles en naviguant avec Tab
- [ ] Pas d'erreurs de build

#### Step 4 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 5: Créer un Composant Image Optimisé

- [ ] Créer le fichier `components/ui/optimized-image.tsx` :

```typescript
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Placeholder blur en base64 (10x10 gris)
const DEFAULT_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAgIBBAIDAAAAAAAAAAAAAQIDBAAFBhEhEjETQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAAFBv/EABoRAAIDAQEAAAAAAAAAAAAAAAECAAMRITH/2gAMAwEAAhEDEEEA/9oADAMBAAIRAxEAPwCd7N1K1py6NXD2oJEkJHnGGVgR9EEEfWTvd26Nl61rtm1Y0rTZJZnLu7QRksx9k8ftMYTfWgf3pf8AOP8AZP8Ac+p/vS/5xjHSqxAGMvZ/QyZBwJk7P//Z'

interface OptimizedImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  blurDataURL = DEFAULT_BLUR_DATA_URL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier si l'URL est externe (Unsplash, etc.)
  const isExternal = src.startsWith('http')

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      quality={quality}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={blurDataURL}
      className={cn(
        'transition-opacity duration-500',
        isLoading ? 'opacity-0' : 'opacity-100',
        className
      )}
      onLoad={() => setIsLoading(false)}
      unoptimized={isExternal}
    />
  )
}
```

- [ ] Mettre à jour `next.config.ts` pour autoriser les domaines d'images externes :

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
```

##### Step 5 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Les images Unsplash se chargent correctement
- [ ] L'effet blur apparaît pendant le chargement

#### Step 5 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 6: Créer un Composant pour le Mobile Menu Accessible

- [ ] Créer le fichier `components/ui/sheet.tsx` (pour les sidebars mobiles) :

```typescript
'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  side?: 'left' | 'right'
}

export function Sheet({
  isOpen,
  onClose,
  children,
  title,
  side = 'right'
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      const focusableElements = sheetRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      firstElement?.focus()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Menu'}
            initial={{ x: side === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed top-0 bottom-0 z-50 w-full max-w-sm',
              'bg-white dark:bg-background-dark',
              'shadow-2xl overflow-y-auto',
              side === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
              {title && (
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-ring"
              >
                <Icon name="close" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

##### Step 6 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le Sheet s'anime correctement à l'ouverture/fermeture
- [ ] La touche Escape ferme le Sheet
- [ ] Le focus est piégé dans le Sheet

#### Step 6 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 7: Audit Responsive - Header et Navigation

- [ ] Vérifier que le header a ces classes responsive dans `components/layout/header.tsx` :

```typescript
// Classes recommandées pour le header responsive
// Container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
// Nav desktop: "hidden md:flex items-center gap-8"
// Menu mobile button: "flex md:hidden"
// Logo: responsive text-lg sm:text-xl
```

- [ ] Vérifier que le mobile-menu utilise le Sheet ou un pattern accessible similaire

- [ ] S'assurer que tous les liens de navigation ont :
  - `aria-current="page"` sur le lien actif
  - Des focus states visibles

##### Step 7 Verification Checklist
- [ ] Navigation desktop visible à partir de md (768px)
- [ ] Menu hamburger visible en dessous de md
- [ ] Navigation clavier fonctionne correctement

#### Step 7 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 8: Audit Responsive - Page d'Accueil

- [ ] Vérifier/corriger les classes responsive dans `components/home/hero-section.tsx` :

```typescript
// Exemple de classes responsive pour le hero
// Titre: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black"
// Sous-titre: "text-base sm:text-lg md:text-xl max-w-2xl"
// Container: "px-4 sm:px-6 lg:px-8"
// Hauteur: "min-h-[80vh] md:min-h-screen"
```

- [ ] Vérifier/corriger `components/home/search-bar.tsx` :

```typescript
// SearchBar responsive
// Container: "flex flex-col md:flex-row gap-4"
// Inputs: "w-full md:flex-1"
// Button: "w-full md:w-auto"
```

- [ ] Vérifier/corriger `components/home/collection-section.tsx` :

```typescript
// Grille de cards responsive
// "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
```

##### Step 8 Verification Checklist
- [ ] Le hero est lisible sur mobile (texte pas trop grand)
- [ ] La SearchBar empile les champs sur mobile
- [ ] La grille de séjours s'adapte (1 col mobile, 2 tablet, 3-4 desktop)

#### Step 8 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 9: Audit Responsive - Page Catalogue

- [ ] Vérifier/corriger le layout dans `app/sejours/page.tsx` :

```typescript
// Layout 2 colonnes responsive
// Container: "flex flex-col lg:flex-row gap-8"
// Sidebar: "w-full lg:w-80 lg:flex-shrink-0"
// Grille: "flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
```

- [ ] Ajouter un bouton pour ouvrir les filtres sur mobile dans `components/catalogue/filter-sidebar.tsx` :

```typescript
// Ajouter un état pour mobile filter sheet
// Desktop: sidebar toujours visible avec "hidden lg:block"
// Mobile: bouton "Filtres" qui ouvre le Sheet
```

##### Step 9 Verification Checklist
- [ ] Sur mobile : bouton "Filtres" visible, sidebar cachée
- [ ] Sur desktop : sidebar visible à gauche
- [ ] La grille s'adapte au nombre de colonnes

#### Step 9 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 10: Audit Responsive - Page Détails

- [ ] Vérifier/corriger `components/details/image-gallery.tsx` :

```typescript
// Galerie responsive
// Grid: "grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4"
// Image principale: "col-span-2 row-span-2"
// Lightbox: boutons prev/next plus grands sur desktop
```

- [ ] Vérifier/corriger le layout 2 colonnes dans `app/sejours/[slug]/page.tsx` :

```typescript
// Layout responsive
// Container: "flex flex-col lg:flex-row gap-8 lg:gap-12"
// Contenu: "w-full lg:w-[65%]"
// Sidebar: "w-full lg:w-[35%]"
```

- [ ] Vérifier/corriger `components/details/booking-card.tsx` :

```typescript
// Booking card responsive
// Desktop: "lg:sticky lg:top-24"
// Mobile: pas sticky, affichage normal
// Prix: "text-2xl sm:text-3xl"
```

##### Step 10 Verification Checklist
- [ ] La galerie affiche moins d'images par ligne sur mobile
- [ ] Le layout passe en colonne unique sur mobile
- [ ] La booking card n'est pas sticky sur mobile

#### Step 10 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 11: Audit Responsive - Pages Contact et Devis

- [ ] Vérifier/corriger le layout de `app/contact/page.tsx` :

```typescript
// Layout 2 colonnes responsive
// Container: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
// Formulaire: "lg:col-span-8"
// Sidebar: "lg:col-span-4"
```

- [ ] Vérifier/corriger `app/devis/page.tsx` :

```typescript
// Container centré responsive
// "max-w-[800px] mx-auto px-4 sm:px-6"
// Radio cards: "grid grid-cols-1 md:grid-cols-3 gap-4"
// Preferences: "grid grid-cols-1 md:grid-cols-2 gap-4"
```

##### Step 11 Verification Checklist
- [ ] Contact : sidebar sous le formulaire sur mobile
- [ ] Devis : les radio cards s'empilent sur mobile
- [ ] Les formulaires sont utilisables sur mobile

#### Step 11 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 12: Ajouter les Animations aux Sections Principales

- [ ] Mettre à jour les pages pour utiliser `AnimateOnScroll`. Exemple pour la page d'accueil :

```typescript
// Dans app/page.tsx, wrapper les sections avec AnimateOnScroll
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { StaggerList } from '@/components/ui/stagger-list'

// Exemple d'utilisation:
<AnimateOnScroll>
  <HeroSection />
</AnimateOnScroll>

<AnimateOnScroll delay={0.2}>
  <ServicesSection />
</AnimateOnScroll>

// Pour les grilles de cards, utiliser StaggerList:
<StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {stays.map(stay => (
    <StayCard key={stay.id} stay={stay} />
  ))}
</StaggerList>
```

##### Step 12 Verification Checklist
- [ ] Les sections apparaissent en fade-in au scroll
- [ ] Les cards apparaissent avec un effet stagger
- [ ] Les animations respectent prefers-reduced-motion

#### Step 12 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 13: Audit Accessibilité - Formulaires

- [ ] Vérifier tous les formulaires pour s'assurer qu'ils ont :

```typescript
// Checklist pour chaque input:
// 1. Label avec htmlFor correspondant à l'id de l'input
// 2. aria-required="true" si requis
// 3. aria-invalid={!!error} si erreur possible
// 4. aria-describedby pointant vers le message d'erreur
// 5. type approprié (email, tel, etc.)

// Exemple complet:
<div>
  <label htmlFor="email" className="block text-sm font-medium">
    Email <span className="text-red-500" aria-hidden="true">*</span>
  </label>
  <input
    id="email"
    name="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={!!errors?.email}
    aria-describedby={errors?.email ? "email-error" : undefined}
    className="input-focus ..."
  />
  {errors?.email && (
    <p id="email-error" className="text-red-500 text-sm" role="alert">
      {errors.email}
    </p>
  )}
</div>
```

##### Step 13 Verification Checklist
- [ ] Tous les inputs ont un label associé
- [ ] Les erreurs sont annoncées avec role="alert"
- [ ] La navigation Tab parcourt les champs dans l'ordre

#### Step 13 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 14: Audit Accessibilité - Boutons et Interactifs

- [ ] Vérifier tous les boutons icône-only pour s'assurer qu'ils ont un aria-label :

```typescript
// Boutons icône qui nécessitent aria-label:
// - Bouton menu mobile: aria-label="Ouvrir le menu"
// - Bouton fermer: aria-label="Fermer"
// - Bouton favoris: aria-label="Ajouter aux favoris"
// - Boutons navigation galerie: aria-label="Image précédente/suivante"
// - Bouton theme toggle: aria-label="Basculer le thème"

// Exemple:
<button
  type="button"
  onClick={onClose}
  aria-label="Fermer"
  className="focus-ring ..."
>
  <Icon name="close" />
</button>
```

- [ ] Vérifier les boutons toggle :

```typescript
// Pour les toggles (menu, favoris, etc.)
<button
  type="button"
  aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
  aria-expanded={isOpen}
  aria-controls="menu-id"
  className="focus-ring ..."
>
  <Icon name={isOpen ? 'close' : 'menu'} />
</button>
```

##### Step 14 Verification Checklist
- [ ] Tous les boutons icône ont un aria-label descriptif
- [ ] Les toggles ont aria-expanded
- [ ] Les focus states sont visibles sur tous les boutons

#### Step 14 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 15: Audit Accessibilité - Images

- [ ] Vérifier que toutes les images ont un alt approprié :

```typescript
// Images de contenu: alt descriptif
<Image src={stay.image} alt={`Vue du séjour ${stay.name}`} ... />

// Images décoratives: alt vide + role
<Image src={pattern} alt="" role="presentation" ... />

// Images dans les cards: alt contextuel
<Image src={service.image} alt={service.title} ... />

// Avatars: alt avec le nom
<Image src={host.avatar} alt={`Photo de ${host.name}`} ... />
```

##### Step 15 Verification Checklist
- [ ] Toutes les images ont un attribut alt
- [ ] Les alt sont descriptifs et contextuels
- [ ] Les images décoratives ont alt=""

#### Step 15 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 16: Optimiser les Images LCP

- [ ] Identifier et optimiser les images LCP (Largest Contentful Paint) :

```typescript
// Les images LCP sont généralement:
// 1. Hero image sur la page d'accueil
// 2. Image principale dans la galerie détails
// 3. Image de fond des pages concept/contact

// Ajouter priority à ces images:
<Image
  src={heroImage}
  alt="..."
  priority  // Précharge l'image
  sizes="100vw"
  quality={85}
  fill
  className="object-cover"
/>

// Dans le <head> de layout.tsx, précharger la font:
// <link rel="preload" href="fonts/..." as="font" type="font/woff2" crossOrigin="" />
```

##### Step 16 Verification Checklist
- [ ] Les images hero ont priority={true}
- [ ] Les images non-LCP n'ont PAS priority (lazy loading)

#### Step 16 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 17: Prévenir le CLS (Cumulative Layout Shift)

- [ ] Vérifier que toutes les images ont des dimensions définies :

```typescript
// Option 1: width et height explicites
<Image src={src} alt={alt} width={800} height={600} />

// Option 2: fill avec container aspect-ratio
<div className="relative aspect-video">
  <Image src={src} alt={alt} fill className="object-cover" />
</div>

// Option 3: fill avec container dimensions fixes
<div className="relative w-full h-64">
  <Image src={src} alt={alt} fill className="object-cover" />
</div>
```

- [ ] Vérifier que les fonts ne causent pas de CLS :

```typescript
// Dans layout.tsx, utiliser display=swap pour les Google Fonts
// Le CDN Material Symbols inclut déjà display=swap
```

##### Step 17 Verification Checklist
- [ ] Pas de saut de layout au chargement des images
- [ ] Pas de saut au chargement des fonts

#### Step 17 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 18: Tests Finaux - Lighthouse Audit

- [ ] Lancer le serveur de développement :

```bash
npm run build && npm run start
```

- [ ] Ouvrir Chrome DevTools > Lighthouse > Générer un rapport pour :
  - Page d'accueil (`/`)
  - Page catalogue (`/sejours`)
  - Page détails (`/sejours/[un-slug]`)
  - Page contact (`/contact`)
  - Page devis (`/devis`)

- [ ] Vérifier les scores (objectifs minimums) :

| Catégorie | Score Minimum |
|-----------|---------------|
| Performance | 90+ |
| Accessibility | 100 |
| Best Practices | 90+ |
| SEO | 90+ |

- [ ] Corriger les problèmes identifiés par Lighthouse

##### Step 18 Verification Checklist
- [ ] Toutes les pages ont un score Performance >= 90
- [ ] Toutes les pages ont un score Accessibility = 100
- [ ] Toutes les pages ont un score Best Practices >= 90
- [ ] Toutes les pages ont un score SEO >= 90

#### Step 18 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 19: Test Navigation Clavier

- [ ] Tester la navigation clavier sur toutes les pages :

```
Test checklist:
1. Tab pour avancer, Shift+Tab pour reculer
2. Enter/Space pour activer les boutons
3. Escape pour fermer les modals/menus
4. Flèches pour la navigation dans les selects/radio groups
5. Le focus est toujours visible
6. L'ordre de tabulation est logique
```

- [ ] Tester les composants interactifs :
  - Menu mobile (ouverture/fermeture/navigation)
  - Lightbox galerie (navigation entre images)
  - Formulaires (tous les champs accessibles)
  - Filtres (checkboxes, sliders)
  - Radio cards (sélection avec clavier)

##### Step 19 Verification Checklist
- [ ] On peut naviguer sur tout le site sans souris
- [ ] Le focus est toujours visible
- [ ] Les modals piègent le focus correctement
- [ ] Escape ferme les modals/menus

#### Step 19 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 20: Test sur Différents Devices

- [ ] Tester sur les tailles d'écran suivantes (DevTools ou devices réels) :

| Device | Largeur | Points de vérification |
|--------|---------|------------------------|
| iPhone SE | 375px | Menu mobile, formulaires |
| iPhone 14 | 390px | Hero, cards, navigation |
| iPad | 768px | Layout 2 colonnes, grilles |
| iPad Pro | 1024px | Transition mobile/desktop |
| Laptop | 1280px | Layout complet |
| Desktop | 1920px | Pas d'étirement excessif |

- [ ] Vérifier sur chaque device :
  - Texte lisible (pas trop petit)
  - Boutons assez grands pour le touch (min 44x44px)
  - Pas de scroll horizontal
  - Images correctement dimensionnées
  - Formulaires utilisables

##### Step 20 Verification Checklist
- [ ] Le site est utilisable sur tous les devices testés
- [ ] Pas de problèmes de scroll horizontal
- [ ] Les interactions touch fonctionnent

#### Step 20 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

## Summary

### Fichiers Créés/Modifiés
| Fichier | Description |
|---------|-------------|
| `lib/animations.ts` | Variants Framer Motion |
| `components/ui/animate-on-scroll.tsx` | Animation au scroll |
| `components/ui/stagger-list.tsx` | Animation stagger pour listes |
| `components/ui/skip-link.tsx` | Lien d'accessibilité |
| `components/ui/optimized-image.tsx` | Image optimisée avec blur |
| `components/ui/sheet.tsx` | Modal/drawer accessible |
| `app/globals.css` | Focus states, reduced motion |
| `app/layout.tsx` | Skip link, main id |
| `next.config.ts` | Remote patterns images |

### Checklist Accessibilité Complète
- [x] Skip link vers le contenu principal
- [x] Focus states visibles sur tous les interactifs
- [x] aria-label sur tous les boutons icône
- [x] Labels associés à tous les inputs
- [x] Messages d'erreur avec role="alert"
- [x] Alt text sur toutes les images
- [x] Navigation clavier complète
- [x] Support prefers-reduced-motion

### Objectifs Core Web Vitals
| Métrique | Objectif |
|----------|----------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

### Scores Lighthouse Cibles
| Catégorie | Score |
|-----------|-------|
| Performance | 90+ |
| Accessibility | 100 |
| Best Practices | 90+ |
| SEO | 90+ |
