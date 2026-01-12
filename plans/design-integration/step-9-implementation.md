# Step 9: Page Demande de Devis avec Envoi Multi-étapes

## Goal
Créer une page de demande de devis avec un formulaire multi-étapes (4 étapes), des radio cards pour les objectifs et préférences, une barre de progression animée, et une soumission via Server Action.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.
Si ce n'est pas le cas, exécutez : `git checkout feat/design-integration`

**Steps 1-8 doivent être complétés** (notamment Step 8 pour Counter, Textarea, cn() et pattern Server Action)

---

### Step-by-Step Instructions

#### Step 1: Ajouter les Types pour le Formulaire Devis

- [ ] Ouvrir `lib/types/index.ts` et **ajouter** les types à la fin du fichier :

```typescript
// ===== Step 9: Types pour la page devis =====

export type QuoteObjective = 'ressourcement' | 'celebration' | 'exploration'
export type QuotePreference = 'sport' | 'yoga' | 'spa' | 'aventure'

export interface QuoteFormData {
  objective: QuoteObjective | null
  preference: QuotePreference | null
  dates: string
  travelers: number
  specialRequests: string
}

export interface QuoteFormState {
  success: boolean
  message: string
  errors?: {
    objective?: string[]
    preference?: string[]
    dates?: string[]
    travelers?: string[]
    specialRequests?: string[]
    _form?: string[]
  }
}

export interface ObjectiveOption {
  id: QuoteObjective
  label: string
  description: string
  icon: string
  iconBgClass: string
  iconTextClass: string
}

export interface PreferenceOption {
  id: QuotePreference
  label: string
  description: string
  icon: string
  iconBgClass: string
  iconTextClass: string
}
```

##### Step 1 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Les types QuoteObjective, QuotePreference, QuoteFormData, QuoteFormState sont exportés

#### Step 1 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 2: Créer le Hook useMultiStepForm

- [ ] Créer le fichier `lib/hooks/use-multi-step-form.ts` :

```typescript
'use client'

import { useState, useCallback } from 'react'

interface UseMultiStepFormOptions<T> {
  initialData: T
  totalSteps: number
  onStepChange?: (step: number) => void
}

export function useMultiStepForm<T extends Record<string, unknown>>({
  initialData,
  totalSteps,
  onStepChange
}: UseMultiStepFormOptions<T>) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<T>(initialData)

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    }
  }, [currentStep, totalSteps, onStepChange])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    }
  }, [currentStep, onStepChange])

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
      onStepChange?.(step)
    }
  }, [totalSteps, onStepChange])

  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [])

  const resetForm = useCallback(() => {
    setCurrentStep(1)
    setFormData(initialData)
  }, [initialData])

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps
  const progress = (currentStep / totalSteps) * 100

  return {
    currentStep,
    formData,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    resetForm,
    isFirstStep,
    isLastStep,
    progress,
    totalSteps
  }
}
```

##### Step 2 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le hook exporte toutes les fonctions nécessaires

#### Step 2 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 3: Créer la Server Action pour le Devis

- [ ] Créer le fichier `app/actions/quote.ts` :

```typescript
'use server'

import { z } from 'zod'
import type { QuoteFormState } from '@/lib/types'

const QuoteFormSchema = z.object({
  objective: z.enum(['ressourcement', 'celebration', 'exploration'], {
    required_error: 'Veuillez sélectionner un objectif'
  }),
  preference: z.enum(['sport', 'yoga', 'spa', 'aventure'], {
    required_error: 'Veuillez sélectionner une préférence'
  }),
  dates: z.string().min(1, 'Veuillez sélectionner des dates'),
  travelers: z.coerce.number().min(1, 'Au moins 1 voyageur requis'),
  specialRequests: z.string().max(2000, 'Maximum 2000 caractères').optional().default(''),
})

export async function submitQuoteRequest(
  prevState: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  const rawData = {
    objective: formData.get('objective') as string,
    preference: formData.get('preference') as string,
    dates: formData.get('dates') as string,
    travelers: formData.get('travelers') as string,
    specialRequests: formData.get('specialRequests') as string || '',
  }

  const validatedFields = QuoteFormSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Veuillez compléter toutes les étapes du formulaire',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Simuler un délai d'envoi
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // TODO: Implémenter l'envoi d'email ou sauvegarde en base
  // await sendEmail(validatedFields.data)
  // await saveToDatabase(validatedFields.data)

  console.log('Quote request submitted:', validatedFields.data)

  return {
    success: true,
    message: 'Votre demande de devis a été envoyée avec succès. Notre équipe vous contactera sous 24h.',
  }
}
```

##### Step 3 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le fichier exporte `submitQuoteRequest`

#### Step 3 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 4: Créer le Composant StepIndicator

- [ ] Créer le fichier `components/devis/step-indicator.tsx` :

```typescript
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  progress: number
}

const STEP_LABELS = ['Préférences', 'Bien-être', 'Logistique', 'Détails']

export function StepIndicator({ currentStep, totalSteps, progress }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <span className="text-primary text-sm font-bold uppercase tracking-wider">
          Étape {currentStep} sur {totalSteps}
        </span>
        <span className="text-gray-400 dark:text-gray-500 text-xs hidden md:block">
          {STEP_LABELS.join(' • ')}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 dark:bg-[#2a3850] rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(17,82,212,0.6)] relative transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20" />
        </div>
      </div>
    </div>
  )
}
```

##### Step 4 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] La barre de progression a l'effet glow

#### Step 4 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 5: Créer le Composant RadioCard

- [ ] Créer le fichier `components/devis/radio-card.tsx` :

```typescript
'use client'

import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface RadioCardProps {
  id: string
  name: string
  label: string
  description: string
  icon: string
  iconBgClass: string
  iconTextClass: string
  checked: boolean
  onChange: () => void
  variant?: 'vertical' | 'horizontal'
}

export function RadioCard({
  id,
  name,
  label,
  description,
  icon,
  iconBgClass,
  iconTextClass,
  checked,
  onChange,
  variant = 'vertical'
}: RadioCardProps) {
  const isHorizontal = variant === 'horizontal'

  return (
    <label className="group cursor-pointer relative">
      <input
        type="radio"
        name={name}
        value={id}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <div
        className={cn(
          'h-full p-5 rounded-xl border transition-all',
          'border-gray-200 dark:border-[#2a3850]',
          'bg-gray-50 dark:bg-[#1a2332]',
          'hover:border-primary/50 hover:bg-white dark:hover:bg-[#1f2b3e]',
          'peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5 dark:peer-checked:bg-[#1a2332]',
          isHorizontal ? 'flex items-start gap-4' : 'flex flex-col gap-3'
        )}
      >
        <div
          className={cn(
            'rounded-full flex items-center justify-center group-hover:scale-110 transition-transform',
            iconBgClass,
            iconTextClass,
            isHorizontal ? 'shrink-0 size-12' : 'size-10'
          )}
        >
          <Icon name={icon} />
        </div>
        <div className={isHorizontal ? 'flex flex-col' : ''}>
          <h3 className="text-gray-900 dark:text-white font-bold mb-1">{label}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div
        className={cn(
          'absolute text-primary opacity-0 peer-checked:opacity-100 transition-opacity',
          isHorizontal ? 'top-5 right-5' : 'top-4 right-4'
        )}
      >
        <Icon name="check_circle" className="text-xl" />
      </div>
    </label>
  )
}
```

##### Step 5 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le composant supporte les 2 variants (vertical et horizontal)
- [ ] L'icône check apparaît quand sélectionné

#### Step 5 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 6: Créer les Sections Objective et Preferences

- [ ] Créer le fichier `components/devis/objective-section.tsx` :

```typescript
'use client'

import { RadioCard } from './radio-card'
import type { QuoteObjective, ObjectiveOption } from '@/lib/types'

const OBJECTIVES: ObjectiveOption[] = [
  {
    id: 'ressourcement',
    label: 'Ressourcement',
    description: 'Retraites bien-être, journées spa et isolement paisible.',
    icon: 'spa',
    iconBgClass: 'bg-blue-100 dark:bg-[#232f48]',
    iconTextClass: 'text-primary'
  },
  {
    id: 'celebration',
    label: 'Célébration',
    description: 'Événements marquants, fêtes de luxe et rassemblements exclusifs.',
    icon: 'celebration',
    iconBgClass: 'bg-purple-100 dark:bg-[#232f48]',
    iconTextClass: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 'exploration',
    label: 'Exploration',
    description: 'Immersions culturelles, visites urbaines et aventure.',
    icon: 'explore',
    iconBgClass: 'bg-amber-100 dark:bg-[#232f48]',
    iconTextClass: 'text-amber-600 dark:text-amber-400'
  }
]

interface ObjectiveSectionProps {
  value: QuoteObjective | null
  onChange: (value: QuoteObjective) => void
  error?: string
}

export function ObjectiveSection({ value, onChange, error }: ObjectiveSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OBJECTIVES.map((objective) => (
          <RadioCard
            key={objective.id}
            id={objective.id}
            name="objective"
            label={objective.label}
            description={objective.description}
            icon={objective.icon}
            iconBgClass={objective.iconBgClass}
            iconTextClass={objective.iconTextClass}
            checked={value === objective.id}
            onChange={() => onChange(objective.id)}
            variant="vertical"
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
```

- [ ] Créer le fichier `components/devis/preferences-section.tsx` :

```typescript
'use client'

import { RadioCard } from './radio-card'
import type { QuotePreference, PreferenceOption } from '@/lib/types'

const PREFERENCES: PreferenceOption[] = [
  {
    id: 'sport',
    label: 'Sport Intensif',
    description: 'Entraînement énergique, installations de pointe et sports de compétition.',
    icon: 'fitness_center',
    iconBgClass: 'bg-red-100 dark:bg-[#232f48]',
    iconTextClass: 'text-red-600 dark:text-red-400'
  },
  {
    id: 'yoga',
    label: 'Yoga Doux',
    description: 'Enchaînements en pleine conscience, exercices de respiration et méditation au coucher du soleil.',
    icon: 'self_improvement',
    iconBgClass: 'bg-teal-100 dark:bg-[#232f48]',
    iconTextClass: 'text-teal-600 dark:text-teal-400'
  },
  {
    id: 'spa',
    label: 'Spa & Récupération',
    description: 'Hydrothérapie, massage des tissus profonds et relaxation totale.',
    icon: 'hot_tub',
    iconBgClass: 'bg-indigo-100 dark:bg-[#232f48]',
    iconTextClass: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    id: 'aventure',
    label: 'Aventure en plein air',
    description: 'Randonnée, course en sentier, kayak et immersion en nature.',
    icon: 'hiking',
    iconBgClass: 'bg-emerald-100 dark:bg-[#232f48]',
    iconTextClass: 'text-emerald-600 dark:text-emerald-400'
  }
]

interface PreferencesSectionProps {
  value: QuotePreference | null
  onChange: (value: QuotePreference) => void
  error?: string
}

export function PreferencesSection({ value, onChange, error }: PreferencesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREFERENCES.map((preference) => (
          <RadioCard
            key={preference.id}
            id={preference.id}
            name="preference"
            label={preference.label}
            description={preference.description}
            icon={preference.icon}
            iconBgClass={preference.iconBgClass}
            iconTextClass={preference.iconTextClass}
            checked={value === preference.id}
            onChange={() => onChange(preference.id)}
            variant="horizontal"
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
```

##### Step 6 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] ObjectiveSection affiche 3 cartes verticales
- [ ] PreferencesSection affiche 4 cartes horizontales

#### Step 6 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 7: Créer les Composants DatePicker et GuestSelect

- [ ] Créer le fichier `components/ui/date-picker.tsx` :

```typescript
'use client'

import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Sélectionnez vos dates',
  error
}: DatePickerProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name="calendar_month" className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-4 py-3 rounded-lg transition-all cursor-pointer',
          'bg-gray-50 dark:bg-[#1a2332]',
          'text-gray-900 dark:text-white',
          'placeholder-gray-500 dark:placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          error
            ? 'border-red-500 focus:ring-red-500/50 border'
            : 'border border-gray-200 dark:border-[#2a3850] focus:ring-primary'
        )}
      />
    </div>
  )
}
```

- [ ] Créer le fichier `components/ui/guest-select.tsx` :

```typescript
'use client'

import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface GuestSelectProps {
  value: number
  onChange: (value: number) => void
  error?: boolean
}

const OPTIONS = [
  { value: 1, label: '1 Voyageur' },
  { value: 2, label: '2 Voyageurs' },
  { value: 3, label: '3 Voyageurs' },
  { value: 4, label: '4 Voyageurs' },
  { value: 5, label: '5 Voyageurs' },
  { value: 6, label: '6+ Voyageurs' },
]

export function GuestSelect({ value, onChange, error }: GuestSelectProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name="group" className="text-gray-400" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full pl-10 pr-10 py-3 rounded-lg appearance-none cursor-pointer transition-all',
          'bg-gray-50 dark:bg-[#1a2332]',
          'text-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          error
            ? 'border-red-500 focus:ring-red-500/50 border'
            : 'border border-gray-200 dark:border-[#2a3850] focus:ring-primary'
        )}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
        <Icon name="expand_more" />
      </div>
    </div>
  )
}
```

##### Step 7 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] DatePicker a l'icône calendrier
- [ ] GuestSelect a l'icône groupe et la flèche

#### Step 7 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 8: Créer la Section Dates

- [ ] Créer le fichier `components/devis/dates-section.tsx` :

```typescript
'use client'

import { DatePicker } from '@/components/ui/date-picker'
import { GuestSelect } from '@/components/ui/guest-select'

interface DatesSectionProps {
  dates: string
  travelers: number
  onDatesChange: (value: string) => void
  onTravelersChange: (value: number) => void
  errors?: {
    dates?: string
    travelers?: string
  }
}

export function DatesSection({
  dates,
  travelers,
  onDatesChange,
  onTravelersChange,
  errors
}: DatesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Dates souhaitées
          </label>
          <DatePicker
            value={dates}
            onChange={onDatesChange}
            placeholder="Ex: 15-22 Octobre 2024"
            error={!!errors?.dates}
          />
          {errors?.dates && (
            <p className="text-red-500 text-xs">{errors.dates}</p>
          )}
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Voyageurs
          </label>
          <GuestSelect
            value={travelers}
            onChange={onTravelersChange}
            error={!!errors?.travelers}
          />
          {errors?.travelers && (
            <p className="text-red-500 text-xs">{errors.travelers}</p>
          )}
        </div>
      </div>
    </div>
  )
}
```

##### Step 8 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Layout responsive (colonne sur mobile, ligne sur desktop)

#### Step 8 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 9: Créer le Composant FormSection et DetailsSection

- [ ] Créer le fichier `components/devis/form-section.tsx` :

```typescript
import { cn } from '@/lib/utils'

interface FormSectionProps {
  stepNumber: number
  title: string
  isActive: boolean
  children: React.ReactNode
}

export function FormSection({ stepNumber, title, isActive, children }: FormSectionProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-5 p-6 md:p-8 rounded-2xl border shadow-xl',
        'bg-white dark:bg-[#161e2c]',
        'border-gray-200 dark:border-[#232f48]',
        'shadow-black/5 dark:shadow-black/20',
        !isActive && 'opacity-60'
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className={cn(
            'flex items-center justify-center size-8 rounded-full font-bold text-sm',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 dark:bg-[#232f48] text-gray-500 dark:text-gray-300'
          )}
        >
          {stepNumber}
        </span>
        <h2 className="text-gray-900 dark:text-white text-xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  )
}
```

- [ ] Créer le fichier `components/devis/details-section.tsx` :

```typescript
'use client'

import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@/components/ui/icon'

interface DetailsSectionProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function DetailsSection({ value, onChange, error }: DetailsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Dites-nous en plus sur vos préférences
        </label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex : Restrictions alimentaires, besoins d'accessibilité, préférences aériennes ou surprises..."
          rows={4}
          error={!!error}
          className="bg-gray-50 dark:bg-[#1a2332] border-gray-200 dark:border-[#2a3850] rounded-xl"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>

      {/* Note confidentialité */}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a2332]/50 p-3 rounded-lg border border-gray-100 dark:border-[#232f48]">
        <Icon name="lock" className="text-[16px]" />
        <span>Vos données sont chiffrées et traitées avec une stricte confidentialité.</span>
      </div>
    </div>
  )
}
```

##### Step 9 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] FormSection affiche le numéro d'étape avec style actif/inactif
- [ ] DetailsSection a la note de confidentialité

#### Step 9 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 10: Créer le Formulaire Principal QuoteForm

- [ ] Créer le fichier `components/devis/quote-form.tsx` :

```typescript
'use client'

import { useActionState, useEffect } from 'react'
import { submitQuoteRequest } from '@/app/actions/quote'
import { useMultiStepForm } from '@/lib/hooks/use-multi-step-form'
import { StepIndicator } from './step-indicator'
import { FormSection } from './form-section'
import { ObjectiveSection } from './objective-section'
import { PreferencesSection } from './preferences-section'
import { DatesSection } from './dates-section'
import { DetailsSection } from './details-section'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import type { QuoteFormState, QuoteFormData, QuoteObjective, QuotePreference } from '@/lib/types'

const TOTAL_STEPS = 4

const initialFormData: QuoteFormData = {
  objective: null,
  preference: null,
  dates: '',
  travelers: 2,
  specialRequests: ''
}

const initialState: QuoteFormState = {
  success: false,
  message: ''
}

export function QuoteForm() {
  const [state, formAction, isPending] = useActionState(submitQuoteRequest, initialState)
  
  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    resetForm,
    isFirstStep,
    isLastStep,
    progress
  } = useMultiStepForm<QuoteFormData>({
    initialData: initialFormData,
    totalSteps: TOTAL_STEPS
  })

  // Validation par étape
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.objective !== null
      case 2:
        return formData.preference !== null
      case 3:
        return formData.dates.trim() !== '' && formData.travelers >= 1
      case 4:
        return true // Étape optionnelle
      default:
        return false
    }
  }

  // Reset après succès
  useEffect(() => {
    if (state.success) {
      resetForm()
    }
  }, [state.success, resetForm])

  // Afficher le message de succès
  if (state.success) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-[#161e2c] rounded-2xl border border-gray-200 dark:border-[#232f48]">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-green-500/10 mb-6">
          <Icon name="check_circle" className="text-5xl text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Demande Envoyée !
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          {state.message}
        </p>
        <Button onClick={() => window.location.reload()}>
          Nouvelle Demande
        </Button>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* Progress Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} progress={progress} />

      {/* Hidden inputs for form submission */}
      <input type="hidden" name="objective" value={formData.objective || ''} />
      <input type="hidden" name="preference" value={formData.preference || ''} />
      <input type="hidden" name="dates" value={formData.dates} />
      <input type="hidden" name="travelers" value={formData.travelers} />
      <input type="hidden" name="specialRequests" value={formData.specialRequests} />

      {/* Step 1: Objective */}
      {currentStep === 1 && (
        <FormSection stepNumber={1} title="Quel est votre objectif principal ?" isActive={true}>
          <ObjectiveSection
            value={formData.objective}
            onChange={(value) => updateFormData({ objective: value })}
            error={state.errors?.objective?.[0]}
          />
        </FormSection>
      )}

      {/* Step 2: Preferences */}
      {currentStep === 2 && (
        <FormSection stepNumber={2} title="Quelle est votre préférence bien-être ?" isActive={true}>
          <PreferencesSection
            value={formData.preference}
            onChange={(value) => updateFormData({ preference: value })}
            error={state.errors?.preference?.[0]}
          />
        </FormSection>
      )}

      {/* Step 3: Dates & Travelers */}
      {currentStep === 3 && (
        <FormSection stepNumber={3} title="Quand souhaitez-vous partir ?" isActive={true}>
          <DatesSection
            dates={formData.dates}
            travelers={formData.travelers}
            onDatesChange={(value) => updateFormData({ dates: value })}
            onTravelersChange={(value) => updateFormData({ travelers: value })}
            errors={{
              dates: state.errors?.dates?.[0],
              travelers: state.errors?.travelers?.[0]
            }}
          />
        </FormSection>
      )}

      {/* Step 4: Details */}
      {currentStep === 4 && (
        <FormSection stepNumber={4} title="Avez-vous des demandes spéciales ?" isActive={true}>
          <DetailsSection
            value={formData.specialRequests}
            onChange={(value) => updateFormData({ specialRequests: value })}
            error={state.errors?.specialRequests?.[0]}
          />
        </FormSection>
      )}

      {/* Error Message */}
      {state.message && !state.success && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-500 text-sm">{state.message}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevStep}
          disabled={isFirstStep}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
            isFirstStep
              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/5'
          )}
        >
          <Icon name="arrow_back" />
          <span>Précédent</span>
        </button>

        {/* Next / Submit Button */}
        {isLastStep ? (
          <button
            type="submit"
            disabled={isPending || !canProceed()}
            className={cn(
              'group relative flex items-center justify-center gap-3 min-w-[280px]',
              'bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 px-8 rounded-xl',
              'shadow-lg shadow-primary/25 transition-all transform active:scale-95',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
            )}
          >
            {isPending ? (
              <>
                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <span>Demander un devis personnalisé</span>
                <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className={cn(
              'flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold',
              'hover:bg-primary/90 transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <span>Continuer</span>
            <Icon name="arrow_forward" />
          </button>
        )}
      </div>

      {/* Consultation notice */}
      {isLastStep && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Consultation offerte. Aucun engagement requis.
        </p>
      )}
    </form>
  )
}
```

##### Step 10 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Le formulaire navigue entre les 4 étapes
- [ ] La validation empêche de continuer sans sélection
- [ ] Le bouton submit affiche l'animation shine

#### Step 10 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 11: Ajouter l'Animation Shine dans globals.css

- [ ] Ouvrir `app/globals.css` et **ajouter** l'animation shine :

```css
/* Animation Shine pour le bouton submit */
@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

.animate-shine {
  animation: shine 1s ease-in-out;
}
```

##### Step 11 Verification Checklist
- [ ] L'animation shine fonctionne au hover du bouton submit

#### Step 11 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 12: Créer la Page Devis

- [ ] Créer le fichier `app/devis/page.tsx` :

```typescript
import type { Metadata } from 'next'
import { QuoteForm } from '@/components/devis/quote-form'

export const metadata: Metadata = {
  title: 'Demande de Devis | Golden Air',
  description: 'Créez votre voyage sur mesure avec Golden Air. Demandez un devis personnalisé.',
}

export default function DevisPage() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-gold-accent text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            Voyage Sur Mesure
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
            Demande de Devis
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Répondez à quelques questions pour nous aider à créer votre expérience parfaite.
          </p>
        </div>

        {/* Concierge Card */}
        <div className="flex items-center gap-5 p-4 bg-white dark:bg-[#1a2332] rounded-xl border border-gray-100 dark:border-[#2a3850] shadow-sm mb-10">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 ring-2 ring-primary/20 flex-shrink-0"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200")' }}
          />
          <div className="flex flex-col">
            <p className="text-gray-900 dark:text-white text-base font-bold">
              Votre Concierge : Elena
            </p>
            <p className="text-gray-500 dark:text-[#92a4c9] text-sm font-normal">
              "Je suis là pour m'assurer que chaque détail de votre demande soit parfait."
            </p>
          </div>
        </div>

        {/* Quote Form */}
        <QuoteForm />
      </div>
    </main>
  )
}
```

##### Step 12 Verification Checklist
- [ ] Pas d'erreurs TypeScript
- [ ] Naviguer vers `/devis` affiche la page
- [ ] Le header et la carte concierge s'affichent
- [ ] Le formulaire multi-étapes fonctionne

#### Step 12 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

#### Step 13: Tester le Formulaire Complet

- [ ] Tester la navigation entre les 4 étapes
- [ ] Vérifier que la validation empêche de continuer sans sélection
- [ ] Tester la soumission complète du formulaire
- [ ] Vérifier l'état de chargement pendant l'envoi
- [ ] Vérifier le message de succès après soumission
- [ ] Vérifier la console pour le log des données
- [ ] Tester sur mobile (responsive)

##### Step 13 Verification Checklist
- [ ] Étape 1 : Impossible de continuer sans sélectionner un objectif
- [ ] Étape 2 : Impossible de continuer sans sélectionner une préférence
- [ ] Étape 3 : Impossible de continuer sans dates ni voyageurs
- [ ] Étape 4 : Optionnel, peut soumettre sans texte
- [ ] Le spinner s'affiche pendant l'envoi
- [ ] Le message de succès s'affiche après soumission
- [ ] L'animation shine fonctionne sur le bouton submit
- [ ] Responsive : le formulaire est utilisable sur mobile
- [ ] Dark/Light mode : tous les éléments sont visibles

#### Step 13 STOP & COMMIT
**STOP & COMMIT:** Agent must stop here and wait for the user to test, stage, and commit the change.

---

## Summary

### Fichiers Créés
| Fichier | Description |
|---------|-------------|
| `app/devis/page.tsx` | Page principale avec header et concierge card |
| `app/actions/quote.ts` | Server Action avec validation Zod |
| `components/devis/quote-form.tsx` | Formulaire multi-étapes principal |
| `components/devis/step-indicator.tsx` | Barre de progression animée |
| `components/devis/radio-card.tsx` | Card radio avec variants vertical/horizontal |
| `components/devis/form-section.tsx` | Wrapper section numérotée |
| `components/devis/objective-section.tsx` | Section objectifs (3 options) |
| `components/devis/preferences-section.tsx` | Section préférences (4 options) |
| `components/devis/dates-section.tsx` | Section dates + voyageurs |
| `components/devis/details-section.tsx` | Section textarea + confidentialité |
| `components/ui/date-picker.tsx` | Input date avec icône |
| `components/ui/guest-select.tsx` | Select voyageurs avec icône |
| `lib/hooks/use-multi-step-form.ts` | Hook pour formulaire multi-étapes |

### Types Ajoutés
- `QuoteObjective` - Union type pour objectifs
- `QuotePreference` - Union type pour préférences
- `QuoteFormData` - Données du formulaire
- `QuoteFormState` - État du formulaire
- `ObjectiveOption` - Option objectif
- `PreferenceOption` - Option préférence

### Icônes Material Symbols Utilisées
| Icône | Usage |
|-------|-------|
| `spa` | Objectif: Ressourcement |
| `celebration` | Objectif: Célébration |
| `explore` | Objectif: Exploration |
| `fitness_center` | Préférence: Sport |
| `self_improvement` | Préférence: Yoga |
| `hot_tub` | Préférence: Spa |
| `hiking` | Préférence: Aventure |
| `check_circle` | Radio sélectionné / Succès |
| `calendar_month` | Date picker |
| `group` | Guest select |
| `expand_more` | Select dropdown |
| `lock` | Note confidentialité |
| `arrow_forward` | Bouton next/submit |
| `arrow_back` | Bouton previous |

### Points d'Attention
- Le hook `useMultiStepForm` gère la navigation et les données entre étapes
- La validation se fait par étape avant de pouvoir continuer
- L'animation shine nécessite une classe custom dans globals.css
- Les hidden inputs transmettent les données au Server Action
- Le formulaire affiche un état de succès complet après soumission
