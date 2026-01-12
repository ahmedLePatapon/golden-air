# Step 3: Layout Global (Header + Footer)

## Goal
Créer le layout global de l'application Golden Air avec un header fixe responsive (navigation, logo, CTA, toggle thème, menu mobile) et un footer 4 colonnes avec newsletter, le tout intégré dans le layout principal.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
```bash
git checkout feat/design-integration
```

**Important :** Les étapes 1 et 2 doivent être complétées avant de commencer cette étape. Si ce n'est pas le cas, certains composants seront créés en parallèle.

---

## Step-by-Step Instructions

### Step 3.1: Créer le fichier utilitaire cn()

- [ ] Créer le fichier `lib/utils.ts` avec le contenu :

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### Vérification 3.1
- [ ] Le fichier `lib/utils.ts` existe
- [ ] Pas d'erreur d'import

---

### Step 3.2: Créer le composant Icon

- [ ] Créer le fichier `components/ui/icon.tsx` avec le contenu :

```tsx
import { cn } from '@/lib/utils'

export interface IconProps {
  /** Material Symbols icon name */
  name: string
  /** Size in pixels or Tailwind class */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  /** Whether to use filled variant */
  filled?: boolean
  /** Additional CSS classes */
  className?: string
  /** onClick handler */
  onClick?: () => void
}

const sizeClasses = {
  sm: 'text-[18px]',
  md: 'text-[24px]',
  lg: 'text-[32px]',
  xl: 'text-[48px]',
}

export function Icon({
  name,
  size = 'md',
  filled = false,
  className,
  onClick,
}: IconProps) {
  const sizeClass = typeof size === 'number' ? `text-[${size}px]` : sizeClasses[size]

  return (
    <span
      className={cn(
        'material-symbols-outlined select-none',
        filled && 'filled',
        sizeClass,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  )
}
```

#### Vérification 3.2
- [ ] Le fichier existe dans `components/ui/`
- [ ] Pas d'erreur TypeScript

---

### Step 3.3: Créer le composant Button (si non existant)

- [ ] Créer le fichier `components/ui/button.tsx` avec le contenu :

```tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

const variantClasses = {
  primary:
    'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20',
  secondary:
    'bg-surface-dark hover:bg-surface-dark/80 text-white border border-white/10',
  ghost: 'bg-transparent hover:bg-white/5 text-white',
  outline:
    'bg-transparent border border-white/20 hover:border-white/40 text-white',
}

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[18px]">
              progress_activity
            </span>
            <span>Chargement...</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

#### Vérification 3.3
- [ ] Le fichier existe dans `components/ui/`
- [ ] Pas d'erreur TypeScript

---

### Step 3.4: Créer le composant Input (si non existant)

- [ ] Créer le fichier `components/ui/input.tsx` avec le contenu :

```tsx
import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  icon?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full rounded-lg border bg-surface-dark px-4 py-2.5 text-sm text-white placeholder:text-gray-500',
            'border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
            'transition-colors duration-200',
            'dark:bg-surface-dark dark:text-white',
            'light:bg-white light:text-gray-900 light:border-gray-200',
            icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'
```

#### Vérification 3.4
- [ ] Le fichier existe dans `components/ui/`
- [ ] Pas d'erreur TypeScript

---

### Step 3.5: Créer le composant ThemeToggle

- [ ] Créer le fichier `components/layout/theme-toggle.tsx` avec le contenu :

```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Prevent hydration mismatch
    return (
      <button
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          'bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white',
          className
        )}
        aria-label="Toggle theme"
      >
        <span className="material-symbols-outlined text-[20px]">dark_mode</span>
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full',
        'bg-white/5 text-gray-400 transition-all duration-300 hover:bg-white/10 hover:text-white',
        'dark:bg-white/5 dark:hover:bg-white/10',
        'light:bg-gray-100 light:hover:bg-gray-200 light:text-gray-600 light:hover:text-gray-900',
        className
      )}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      <span
        className={cn(
          'material-symbols-outlined text-[20px] transition-transform duration-300',
          isDark ? 'rotate-0' : 'rotate-180'
        )}
      >
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}
```

#### Vérification 3.5
- [ ] Le fichier existe dans `components/layout/`
- [ ] Pas d'erreur TypeScript

---

### Step 3.6: Créer le composant MobileMenu

- [ ] Créer le fichier `components/layout/mobile-menu.tsx` avec le contenu :

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'

interface NavItem {
  label: string
  href: string
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-[280px] bg-background-dark border-l border-white/10',
          'transform transition-transform duration-300 ease-out',
          'dark:bg-background-dark',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Fermer le menu"
          >
            <Icon name="close" size="md" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span className="text-base font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">Thème</span>
            <ThemeToggle />
          </div>
          <Button fullWidth size="lg">
            Réserver
          </Button>
        </div>
      </div>
    </>
  )
}
```

#### Vérification 3.6
- [ ] Le fichier existe dans `components/layout/`
- [ ] Pas d'erreur TypeScript

---

### Step 3.7: Créer le composant Header

- [ ] Créer le fichier `components/layout/header.tsx` avec le contenu :

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { MobileMenu } from './mobile-menu'

const navItems = [
  { label: 'Séjours', href: '/sejours' },
  { label: 'Concept', href: '/concept' },
  { label: 'Contact', href: '/contact' },
  { label: 'Devis', href: '/devis' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'border-b',
          isScrolled
            ? 'bg-background-dark/95 backdrop-blur-lg border-white/10 shadow-lg shadow-black/10'
            : 'bg-background-dark/80 backdrop-blur-md border-white/5',
          'dark:bg-background-dark/80 dark:border-white/5',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:h-20 md:px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center text-primary">
              <Icon name="diamond" size="lg" />
            </div>
            <span className="text-xl font-bold uppercase tracking-tight">
              Golden Air
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                  'text-gray-300 hover:text-white hover:bg-white/5'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Desktop only */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* CTA Button - Desktop only */}
            <div className="hidden md:block">
              <Button size="md">
                <Icon name="calendar_month" size="sm" />
                <span>Réserver</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5 md:hidden"
              aria-label="Ouvrir le menu"
            >
              <Icon name="menu" size="md" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16 md:h-20" />
    </>
  )
}
```

#### Vérification 3.7
- [ ] Le fichier existe dans `components/layout/`
- [ ] Pas d'erreur TypeScript
- [ ] Le header est fixe en haut de page
- [ ] La navigation desktop est visible sur écrans > 768px
- [ ] Le menu hamburger est visible sur mobile

---

### Step 3.8: Créer le composant Footer

- [ ] Créer le fichier `components/layout/footer.tsx` avec le contenu :

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const footerLinks = {
  discover: [
    { label: 'Notre Collection', href: '/sejours' },
    { label: 'Destinations', href: '/sejours?view=destinations' },
    { label: 'Expériences', href: '/sejours?view=experiences' },
    { label: 'Journal', href: '/blog' },
  ],
  company: [
    { label: 'Notre Concept', href: '/concept' },
    { label: 'Conciergerie', href: '/contact' },
    { label: 'Devenir Partenaire', href: '/partenaires' },
    { label: 'Carrières', href: '/carrieres' },
  ],
  legal: [
    { label: 'Confidentialité', href: '/confidentialite' },
    { label: 'Conditions', href: '/conditions' },
    { label: 'Plan du site', href: '/sitemap' },
  ],
}

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'IG' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'TW' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'LI' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubscribed(true)
    setIsSubmitting(false)
    setEmail('')
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-background-dark pt-16 pb-8 dark:bg-background-dark">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-10">
        {/* Main Grid */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 text-white">
              <Icon name="diamond" size="md" className="text-primary" />
              <span className="text-lg font-bold uppercase tracking-tight">
                Golden Air
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Redéfinir le voyage de luxe avec des séjours tout compris
              sélectionnés dans les destinations les plus exclusives du monde.
            </p>
          </div>

          {/* Column 2: Discover */}
          <div>
            <h3 className="mb-4 font-bold text-white">Découvrir</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="mb-4 font-bold text-white">Entreprise</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="mb-4 font-bold text-white">Restez Inspiré</h3>
            <p className="mb-4 text-sm text-gray-400">
              Rejoignez notre newsletter pour des offres exclusives et des
              inspirations de voyage.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-green-400">
                <Icon name="check_circle" size="sm" />
                <span className="text-sm">Merci pour votre inscription !</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button
                  type="submit"
                  size="md"
                  className="px-3"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <Icon name="arrow_forward" size="sm" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {currentYear} Golden Air. Tous droits réservés.
          </p>

          {/* Legal Links */}
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

#### Vérification 3.8
- [ ] Le fichier existe dans `components/layout/`
- [ ] Pas d'erreur TypeScript
- [ ] Le footer a 4 colonnes sur desktop
- [ ] Le formulaire newsletter est fonctionnel (simulation)

---

### Step 3.9: Créer le fichier index des exports layout

- [ ] Créer le fichier `components/layout/index.ts` avec le contenu :

```typescript
export { Header } from './header'
export { Footer } from './footer'
export { MobileMenu } from './mobile-menu'
export { ThemeToggle } from './theme-toggle'
```

#### Vérification 3.9
- [ ] Le fichier existe
- [ ] Tous les exports sont corrects

---

### Step 3.10: Mettre à jour le Layout principal

- [ ] Remplacer entièrement le contenu de `app/layout.tsx` par :

```tsx
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
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
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

#### Vérification 3.10
- [ ] Le layout intègre Header et Footer
- [ ] Le ThemeProvider enveloppe tout le contenu
- [ ] Les fonts Google sont chargées
- [ ] Material Symbols est chargé

---

### Step 3.11: Créer le ThemeProvider (si non existant)

- [ ] Créer le fichier `components/providers/theme-provider.tsx` avec le contenu :

```tsx
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

#### Vérification 3.11
- [ ] Le fichier existe dans `components/providers/`
- [ ] Pas d'erreur TypeScript

---

### Step 3.12: Créer une page d'accueil temporaire pour tester

- [ ] Remplacer le contenu de `app/page.tsx` par :

```tsx
export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
          Golden Air
        </h1>
        <p className="mb-8 text-lg text-gray-400 md:text-xl">
          Séjours de luxe & expériences exclusives
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/sejours"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            Découvrir les séjours
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-3 font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  )
}
```

#### Vérification 3.12
- [ ] La page d'accueil s'affiche correctement
- [ ] Le header est visible en haut
- [ ] Le footer est visible en bas
- [ ] Le contenu est centré verticalement

---

## Verification Checklist Finale - Step 3

### Structure des fichiers
- [ ] `lib/utils.ts` existe avec la fonction `cn()`
- [ ] `components/ui/icon.tsx` existe
- [ ] `components/ui/button.tsx` existe
- [ ] `components/ui/input.tsx` existe
- [ ] `components/layout/header.tsx` existe
- [ ] `components/layout/footer.tsx` existe
- [ ] `components/layout/mobile-menu.tsx` existe
- [ ] `components/layout/theme-toggle.tsx` existe
- [ ] `components/layout/index.ts` existe
- [ ] `components/providers/theme-provider.tsx` existe

### Tests Fonctionnels
- [ ] `npm run dev` démarre sans erreur
- [ ] Le header est fixe et reste en haut lors du scroll
- [ ] Le header change de style au scroll (effet backdrop-blur renforcé)
- [ ] La navigation desktop affiche les 4 liens
- [ ] Le bouton "Réserver" est visible sur desktop
- [ ] Le toggle de thème fonctionne (dark ↔ light)
- [ ] Sur mobile (< 768px) : le menu hamburger s'affiche
- [ ] Le menu mobile s'ouvre et se ferme correctement
- [ ] Le footer affiche 4 colonnes sur desktop
- [ ] Le footer est responsive (1 col mobile → 2 col tablet → 4 col desktop)
- [ ] Le formulaire newsletter affiche un message de succès après soumission
- [ ] Les liens de navigation fonctionnent

### Test Mobile
```bash
# Ouvrir les DevTools et tester en mode responsive
# Vérifier les breakpoints: 320px, 768px, 1024px, 1280px
```

---

## Step 3 STOP & COMMIT

**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

Commande de commit suggérée :
```bash
git add .
git commit -m "feat: step 3 - layout global avec header et footer

- Crée Header fixe avec navigation, logo, CTA et toggle thème
- Crée Footer 4 colonnes avec newsletter et liens
- Crée MobileMenu avec drawer animé
- Crée ThemeToggle avec animation sun/moon
- Ajoute composants UI de base (Icon, Button, Input)
- Crée utilitaire cn() pour merge des classes
- Intègre Header/Footer dans le layout principal
- Support responsive complet (mobile, tablet, desktop)"
```
