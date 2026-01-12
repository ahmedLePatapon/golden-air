# Step 8: Page Contact avec Envoi de Formulaire

## Goal
Créer une page contact complète avec un formulaire multi-sections numéroté, des compteurs de voyageurs, des boutons quick services, une carte concierge avec statut online, et une sidebar avec contacts et mini carte.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
Si ce n'est pas le cas, exécutez : `git checkout feat/design-integration`

**Steps 1-7 doivent être complétés** (layout global, composants UI de base)

---

### Step-by-Step Instructions

#### Step 1: Installer Zod et Créer les Types

- [ ] Installer Zod pour la validation du formulaire :

```bash
npm install zod
```

- [ ] Créer le fichier `lib/utils.ts` (si non existant) avec la fonction `cn` :

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] Ajouter les types de contact dans `lib/types/index.ts` :

```typescript
// ===== Step 8: Types pour la page contact =====

export interface ContactFormData {
  fullName: string
  email: string
  destination?: string
  travelWindow?: string
  adults: number
  children: number
  message?: string
  services: string[]
}

export interface ContactFormState {
  success: boolean
  message: string
  errors?: {
    fullName?: string[]
    email?: string[]
    destination?: string[]
    travelWindow?: string[]
    adults?: string[]
    children?: string[]
    message?: string[]
    services?: string[]
    _form?: string[]
  }
}

export interface ServiceOption {
  id: string
  label: string
  icon: string
}
```

##### Step 1 Verification Checklist
- [ ] Zod est installé (`npm list zod`)
- [ ] Pas d'erreurs TypeScript
- [ ] Les types ContactFormData, ContactFormState, ServiceOption sont exportés

#### Step 1 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 2: Créer la Server Action pour le Formulaire

- [ ] Créer le fichier `app/actions/contact.ts` :

```typescript
'use server'

import { z } from 'zod'
import type { ContactFormState } from '@/lib/types'

const ContactFormSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  destination: z.string().optional(),
  travelWindow: z.string().optional(),
  adults: z.coerce.number().min(1, 'Au moins 1 adulte requis'),
  children: z.coerce.number().min(0).optional().default(0),
  message: z.string().max(2000, 'Le message ne doit pas dépasser 2000 caractères').optional(),
  services: z.array(z.string()).optional().default([]),
})

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Extraire les services sélectionnés
  const services: string[] = []
  formData.forEach((value, key) => {
    if (key === 'services' && typeof value === 'string') {
      services.push(value)
    }
  })

  const rawData = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    destination: formData.get('destination') as string || undefined,
    travelWindow: formData.get('travelWindow') as string || undefined,
    adults: formData.get('adults') as string,
    children: formData.get('children') as string,
    message: formData.get('message') as string || undefined,
    services,
  }

  const validatedFields = ContactFormSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Veuillez corriger les erreurs du formulaire',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Simuler un délai d'envoi
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // TODO: Implémenter l'envoi d'email ou sauvegarde en base
  // await sendEmail(validatedFields.data)
  // await saveToDatabase(validatedFields.data)

  console.log('Contact form submitted:', validatedFields.data)

  return {
    success: true,
    message: 'Votre demande a été envoyée avec succès. Notre équipe vous contactera sous 2h.',
  }
}
```

##### Step 2 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le fichier exporte `submitContactForm`
- [ ] La validation Zod couvre tous les champs

#### Step 2 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 3: Créer les Composants UI (Counter et Textarea)

- [ ] Créer le fichier `components/ui/counter.tsx` :

```typescript
'use client'

import { cn } from '@/lib/utils'

interface CounterProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  name: string
}

export function Counter({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
  name
}: CounterProps) {
  const decrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const increment = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-[#3b4354] rounded-lg">
      <span className="font-medium text-slate-900 dark:text-white">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={cn(
            'size-8 rounded-full border flex items-center justify-center transition-all',
            value <= min
              ? 'border-slate-300 dark:border-slate-600 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : 'border-slate-500 hover:bg-primary/20 hover:border-primary text-slate-700 dark:text-slate-300'
          )}
        >
          -
        </button>
        <span className="w-4 text-center font-bold text-slate-900 dark:text-white">
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className={cn(
            'size-8 rounded-full border flex items-center justify-center transition-all',
            value >= max
              ? 'border-slate-300 dark:border-slate-600 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : 'border-slate-500 hover:bg-primary/20 hover:border-primary text-slate-700 dark:text-slate-300'
          )}
        >
          +
        </button>
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  )
}
```

- [ ] Créer le fichier `components/ui/textarea.tsx` :

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'w-full bg-white dark:bg-[#1c1f27] border rounded-lg p-4 outline-none transition-all resize-none',
          'text-slate-900 dark:text-white placeholder:text-slate-400',
          error
            ? 'border-red-500 focus:ring-1 focus:ring-red-500/50'
            : 'border-slate-200 dark:border-[#3b4354] focus:ring-1 focus:ring-primary',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
```

##### Step 3 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Les composants Counter et Textarea sont créés
- [ ] Counter a les boutons +/- fonctionnels
- [ ] Textarea supporte la prop `error`

#### Step 3 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 4: Créer le Composant FormSection

- [ ] Créer le fichier `components/contact/form-section.tsx` :

```typescript
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  number: string
  title: string
  icon: string
  children: React.ReactNode
  className?: string
}

export function FormSection({
  number,
  title,
  icon,
  children,
  className
}: FormSectionProps) {
  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <Icon name={icon} className="text-gold-accent" />
        <h3 className="text-xl font-bold uppercase tracking-widest text-sm text-slate-900 dark:text-white">
          {number}. {title}
        </h3>
      </div>
      {children}
    </section>
  )
}
```

##### Step 4 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] FormSection affiche le numéro et le titre avec l'icône gold

#### Step 4 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 5: Créer le Composant ServiceQuickPick

- [ ] Créer le fichier `components/contact/service-quick-pick.tsx` :

```typescript
'use client'

import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import type { ServiceOption } from '@/lib/types'

interface ServiceQuickPickProps {
  services: ServiceOption[]
  selectedServices: string[]
  onToggle: (serviceId: string) => void
}

export function ServiceQuickPick({
  services,
  selectedServices,
  onToggle
}: ServiceQuickPickProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {services.map((service) => {
        const isSelected = selectedServices.includes(service.id)
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onToggle(service.id)}
            className={cn(
              'flex flex-col items-center gap-3 p-4 border rounded-xl transition-colors group',
              isSelected
                ? 'border-primary bg-primary/10'
                : 'border-slate-200 dark:border-white/10 hover:border-primary/50'
            )}
          >
            <Icon
              name={service.icon}
              className={cn(
                'text-2xl transition-colors',
                isSelected
                  ? 'text-primary'
                  : 'text-slate-500 group-hover:text-primary'
              )}
            />
            <span className="text-xs font-bold uppercase tracking-tighter text-slate-700 dark:text-white">
              {service.label}
            </span>
          </button>
        )
      })}
      {/* Hidden inputs for form submission */}
      {selectedServices.map((serviceId) => (
        <input key={serviceId} type="hidden" name="services" value={serviceId} />
      ))}
    </div>
  )
}

export const AVAILABLE_SERVICES: ServiceOption[] = [
  { id: 'private-jet', label: 'Jet Privé', icon: 'flight_takeoff' },
  { id: 'chauffeur', label: 'Chauffeur', icon: 'directions_car' },
  { id: 'private-chef', label: 'Chef Privé', icon: 'restaurant' },
  { id: 'security', label: 'Sécurité VIP', icon: 'security' },
]
```

##### Step 5 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Les 4 services s'affichent en grille
- [ ] Les boutons changent d'état visuellement au clic
- [ ] AVAILABLE_SERVICES est exporté

#### Step 5 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 6: Créer le Composant ConciergeCard

- [ ] Créer le fichier `components/contact/concierge-card.tsx` :

```typescript
interface ConciergeCardProps {
  name?: string
  avatar?: string
  responseTime?: string
}

export function ConciergeCard({
  name = 'Elena',
  avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  responseTime = '< 2h'
}: ConciergeCardProps) {
  return (
    <div className="flex items-center gap-6 p-6 rounded-xl bg-primary/5 border border-primary/10">
      <div
        className="size-20 rounded-full bg-cover bg-center border-2 border-gold-accent/30 flex-shrink-0"
        style={{ backgroundImage: `url('${avatar}')` }}
      />
      <div>
        <p className="text-lg font-bold text-slate-900 dark:text-white">
          Votre Concierge Dédié : {name}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Prête à créer votre prochain séjour extraordinaire.
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">
            En ligne • Temps de réponse : {responseTime}
          </span>
        </div>
      </div>
    </div>
  )
}
```

##### Step 6 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] L'avatar s'affiche avec la bordure gold
- [ ] Le point vert pulse (animate-pulse)
- [ ] Le texte "En ligne" est en vert

#### Step 6 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 7: Créer le Composant ContactSidebar

- [ ] Créer le fichier `components/contact/contact-sidebar.tsx` :

```typescript
import { Icon } from '@/components/ui/icon'

export function ContactSidebar() {
  return (
    <div className="space-y-8">
      {/* Contact Card */}
      <div className="glass-card p-8 rounded-2xl border border-white/5 shadow-2xl sticky top-32">
        <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
          Assistance Immédiate
        </h4>
        <div className="space-y-6">
          {/* Phone Link */}
          <a className="flex items-center gap-4 group" href="tel:+33800123456">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <Icon name="call" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Ligne Prioritaire
              </p>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                +33 800 123 456
              </p>
            </div>
          </a>

          {/* WhatsApp Link */}
          <a className="flex items-center gap-4 group" href="https://wa.me/33800123456">
            <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
              <Icon name="chat" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                WhatsApp Concierge
              </p>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                Écrire à un conseiller
              </p>
            </div>
          </a>

          {/* Privacy Notice */}
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <Icon name="verified_user" className="text-gold-accent" />
              <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
                Protection Signature
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Toutes vos demandes sont strictement confidentielles et traitées selon nos protocoles de discrétion les plus stricts.
            </p>
          </div>
        </div>

        {/* Mini Map */}
        <div className="mt-8 rounded-xl overflow-hidden h-40 relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent z-10" />
          <img
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800"
            alt="Carte Golden Air"
          />
          <div className="absolute bottom-4 left-4 z-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-accent">
              Siège Social
            </p>
            <p className="text-xs font-bold text-white">
              Paris, France
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="px-4 py-6 border-l-2 border-gold-accent/30">
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 italic">
          "Golden Air a transformé notre simple vision d'escapade en une expérience qui a dépassé nos rêves les plus fous. Leur attention aux détails est inégalée."
        </p>
        <p className="text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300">
          — Marie D., Paris
        </p>
      </div>
    </div>
  )
}
```

##### Step 7 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Les liens téléphone et WhatsApp ont l'effet hover
- [ ] La mini carte a l'effet zoom au hover
- [ ] Le témoignage est en italique avec bordure gold

#### Step 7 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 8: Créer le Composant ContactForm

- [ ] Créer le fichier `components/contact/contact-form.tsx` :

```typescript
'use client'

import { useActionState, useState } from 'react'
import { submitContactForm } from '@/app/actions/contact'
import { FormSection } from './form-section'
import { ConciergeCard } from './concierge-card'
import { ServiceQuickPick, AVAILABLE_SERVICES } from './service-quick-pick'
import { Counter } from '@/components/ui/counter'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import type { ContactFormState } from '@/lib/types'

const initialState: ContactFormState = {
  success: false,
  message: '',
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  // Afficher le message de succès
  if (state.success) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-green-500/10 mb-6">
          <Icon name="check_circle" className="text-5xl text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Demande Envoyée !
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-12">
      {/* Section 01: Travel Essentials */}
      <FormSection number="01" title="Informations de Voyage" icon="calendar_today">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Nom Complet *
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Jean Dupont"
              required
              className={cn(
                'w-full bg-white dark:bg-[#1c1f27] border rounded-lg p-4 outline-none transition-all',
                'text-slate-900 dark:text-white placeholder:text-slate-400',
                state.errors?.fullName
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500/50'
                  : 'border-slate-200 dark:border-[#3b4354] focus:ring-1 focus:ring-primary'
              )}
            />
            {state.errors?.fullName && (
              <p className="text-red-500 text-xs">{state.errors.fullName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Email *
            </label>
            <input
              type="email"
              name="email"
              placeholder="jean@example.com"
              required
              className={cn(
                'w-full bg-white dark:bg-[#1c1f27] border rounded-lg p-4 outline-none transition-all',
                'text-slate-900 dark:text-white placeholder:text-slate-400',
                state.errors?.email
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500/50'
                  : 'border-slate-200 dark:border-[#3b4354] focus:ring-1 focus:ring-primary'
              )}
            />
            {state.errors?.email && (
              <p className="text-red-500 text-xs">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Destination Souhaitée
            </label>
            <input
              type="text"
              name="destination"
              placeholder="ex: Côte Amalfitaine, Maldives"
              className="w-full bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-[#3b4354] rounded-lg p-4 focus:ring-1 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Période de Voyage
            </label>
            <input
              type="text"
              name="travelWindow"
              placeholder="ex: Octobre 2024"
              className="w-full bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-[#3b4354] rounded-lg p-4 focus:ring-1 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>
      </FormSection>

      {/* Section 02: Party Size */}
      <FormSection number="02" title="Nombre de Voyageurs" icon="group">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Counter
            label="Adultes"
            value={adults}
            onChange={setAdults}
            min={1}
            max={20}
            name="adults"
          />
          <Counter
            label="Enfants"
            value={children}
            onChange={setChildren}
            min={0}
            max={10}
            name="children"
          />
        </div>
        {state.errors?.adults && (
          <p className="text-red-500 text-xs mt-2">{state.errors.adults[0]}</p>
        )}
      </FormSection>

      {/* Section 03: Bespoke Wishes */}
      <FormSection number="03" title="Vos Souhaits" icon="auto_awesome">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Comment pouvons-nous rendre votre séjour extraordinaire ?
            </label>
            <Textarea
              name="message"
              placeholder="Partagez votre vision..."
              rows={5}
              error={!!state.errors?.message}
            />
            {state.errors?.message && (
              <p className="text-red-500 text-xs">{state.errors.message[0]}</p>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
              Services Additionnels
            </label>
            <ServiceQuickPick
              services={AVAILABLE_SERVICES}
              selectedServices={selectedServices}
              onToggle={toggleService}
            />
          </div>
        </div>
      </FormSection>

      {/* Concierge Card */}
      <ConciergeCard />

      {/* Error Message */}
      {state.message && !state.success && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-500 text-sm">{state.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-4 text-lg font-bold shadow-lg hover:shadow-[0_0_30px_rgba(17,82,212,0.3)] transition-all"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi en cours...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Envoyer ma Demande
            <Icon name="arrow_forward" />
          </span>
        )}
      </Button>
    </form>
  )
}
```

##### Step 8 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le formulaire s'affiche avec les 3 sections
- [ ] Les compteurs fonctionnent
- [ ] Les services sont toggleables
- [ ] La carte concierge s'affiche

#### Step 8 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 9: Créer la Page Contact

- [ ] Créer le fichier `app/contact/page.tsx` :

```typescript
import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { ContactSidebar } from '@/components/contact/contact-sidebar'

export const metadata: Metadata = {
  title: 'Contact | Golden Air',
  description: 'Contactez notre équipe de conciergerie pour créer votre voyage sur mesure.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="mb-12">
          <span className="text-gold-accent text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            Voyage Sur Mesure
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
            Demande Personnalisée
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
            Initiez votre voyage avec un curateur de voyage personnel. Chaque demande est traitée avec la plus grande discrétion et expertise.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form - 8 colonnes */}
          <div className="lg:col-span-8">
            <ContactForm />
          </div>

          {/* Sidebar - 4 colonnes */}
          <div className="lg:col-span-4">
            <ContactSidebar />
          </div>
        </div>
      </div>
    </main>
  )
}
```

##### Step 9 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Naviguer vers `/contact` affiche la page
- [ ] Le layout 2 colonnes s'affiche sur desktop
- [ ] La sidebar est sticky au scroll
- [ ] Le formulaire est responsive sur mobile

#### Step 9 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 10: Tester le Formulaire Complet

- [ ] Vérifier tous les champs du formulaire
- [ ] Tester la validation (soumettre avec champs vides)
- [ ] Tester les compteurs +/-
- [ ] Tester la sélection des services
- [ ] Tester l'envoi du formulaire
- [ ] Vérifier le message de succès après soumission
- [ ] Vérifier les états de chargement
- [ ] Vérifier la console pour le log des données

##### Step 10 Verification Checklist
- [ ] La validation s'affiche pour les champs requis manquants
- [ ] Le bouton affiche un spinner pendant l'envoi
- [ ] Le message de succès s'affiche après soumission
- [ ] Les données sont loguées dans la console
- [ ] Responsive : le formulaire est utilisable sur mobile
- [ ] Dark/Light mode : tous les éléments sont visibles dans les deux modes

#### Step 10 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

## Summary

### Fichiers Créés
| Fichier | Description |
|---------|-------------|
| `app/contact/page.tsx` | Page contact avec layout 2 colonnes |
| `app/actions/contact.ts` | Server Action avec validation Zod |
| `components/contact/contact-form.tsx` | Formulaire complet avec useActionState |
| `components/contact/form-section.tsx` | Wrapper section avec numérotation |
| `components/contact/concierge-card.tsx` | Card concierge avec statut online |
| `components/contact/service-quick-pick.tsx` | Boutons services toggleables |
| `components/contact/contact-sidebar.tsx` | Sidebar avec contacts et mini carte |
| `components/ui/counter.tsx` | Composant +/- pour voyageurs |
| `components/ui/textarea.tsx` | Textarea stylisé |
| `lib/utils.ts` | Fonction cn() pour classes conditionnelles |

### Types Ajoutés
- `ContactFormData` - Données du formulaire
- `ContactFormState` - État du formulaire (success/errors)
- `ServiceOption` - Option de service (id, label, icon)

### Icônes Material Symbols Utilisées
| Icône | Usage |
|-------|-------|
| `calendar_today` | Section 01 header |
| `group` | Section 02 header |
| `auto_awesome` | Section 03 header |
| `flight_takeoff` | Service: Jet Privé |
| `directions_car` | Service: Chauffeur |
| `restaurant` | Service: Chef Privé |
| `security` | Service: Sécurité VIP |
| `arrow_forward` | Bouton submit |
| `call` | Contact téléphone |
| `chat` | Contact WhatsApp |
| `verified_user` | Badge confidentialité |
| `check_circle` | Message succès |

### Points d'Attention
- `useActionState` est le hook React 19+ (remplace useFormState)
- La Server Action utilise Zod pour la validation
- Les services sélectionnés sont envoyés via des inputs hidden
- La sidebar utilise `sticky top-32` pour rester visible au scroll
- Le formulaire affiche un état de succès après soumission réussie
