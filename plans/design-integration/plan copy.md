# Intégration du Design Golden Air

**Branch:** `feat/design-integration`
**Description:** Intégration complète du design HTML luxe dans l'application Next.js avec composants React réutilisables

## Goal

Transformer les 6 maquettes HTML statiques (Home, Catalogue, Détails, Contact, Concept, Devis) en une application Next.js fonctionnelle avec des composants React modulaires, un système de design cohérent et des données mock enrichies.

## Décisions Techniques

| Question | Décision |
|----------|----------|
| Filtres catalogue | ✅ Fonctionnels avec state management |
| Formulaires | ✅ Envoi vers API (server actions) |
| Images | ✅ Réutiliser placeholders du design |
| Icônes | ✅ Material Symbols (retirer lucide-react) |
| Thème | ✅ Dark mode + Light mode avec toggle |

---

## Implementation Steps

### Step 1: Configuration et Fondations
**Files:** `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `lib/types/index.ts`, `lib/data/stays.ts`, `package.json`
**What:** 
- Configurer Tailwind avec la palette de couleurs du design (primary, surface-dark, card-dark, text-muted, gold-accent)
- Importer la font Plus Jakarta Sans et Material Symbols via CDN
- Supprimer lucide-react du projet (`npm uninstall lucide-react`)
- Créer un ThemeProvider pour le toggle dark/light mode
- Mettre à jour les types TypeScript avec les nouveaux champs (rating, reviewCount, amenities, sports, wellness)
- Enrichir les données mock avec 6-8 séjours variés
- Copier les images placeholder du design vers `/public/images/`
**Testing:** Vérifier que les couleurs custom sont disponibles, que la font et les icônes Material Symbols chargent correctement, tester le toggle de thème

---

### Step 2: Composants UI de Base
**Files:** 
- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/badge.tsx`
- `components/ui/card.tsx`
- `components/ui/icon.tsx`
- `components/providers/theme-provider.tsx`
**What:** 
- Créer les composants atomiques avec variants (Button: primary/secondary/ghost, sizes)
- Input avec style glass-morphism
- Badge pour les tags (Nouveauté, Best-seller, etc.)
- Card générique avec effet hover
- Wrapper Icon pour Material Symbols avec props de style
- ThemeProvider avec next-themes pour le toggle dark/light
**Testing:** Vérifier visuellement chaque composant en isolation, tester le toggle de thème

---

### Step 3: Layout Global (Header + Footer)
**Files:** 
- `components/layout/header.tsx`
- `components/layout/footer.tsx`
- `components/layout/mobile-menu.tsx`
- `components/layout/theme-toggle.tsx`
- `app/layout.tsx`
**What:** 
- Header fixe avec navigation, logo, CTA, toggle thème et menu mobile hamburger
- Footer 4 colonnes avec newsletter et liens
- Intégrer Header/Footer dans le layout principal
- Navigation responsive avec backdrop-blur
- Bouton toggle dark/light mode dans le header
**Testing:** Naviguer sur mobile et desktop, vérifier le sticky header, menu mobile et toggle thème

---

### Step 4: Page d'Accueil
**Files:** 
- `app/page.tsx`
- `components/home/hero-section.tsx`
- `components/home/search-bar.tsx`
- `components/home/services-section.tsx`
- `components/home/wellness-section.tsx`
- `components/home/collection-section.tsx`
- `components/home/testimonial-section.tsx`
- `components/stays/stay-card.tsx`
**What:** 
- Hero plein écran avec SearchBar (destination, dates, invités)
- Section services (Chef, Conciergerie, Spa) en cards
- Section bien-être & sport avec overlay gradient
- Grille de séjours avec StayCard (image, badge, favoris, prix, note)
- Section témoignage client
**Testing:** Vérifier le responsive de toutes les sections, animations hover sur les cards

---

### Step 5: Page Catalogue avec Filtres Fonctionnels
**Files:** 
- `app/sejours/page.tsx`
- `components/catalogue/filter-sidebar.tsx`
- `components/catalogue/price-range-slider.tsx`
- `components/catalogue/filter-group.tsx`
- `components/catalogue/sort-select.tsx`
- `components/stays/stay-card-catalogue.tsx`
- `lib/hooks/use-filters.ts`
**What:** 
- Layout 2 colonnes : sidebar filtres + grille de résultats
- State management avec useState/useReducer pour les filtres
- Filtres fonctionnels : budget (slider), destination, durée, type d'expérience, sports
- Filtrage côté client des séjours selon les critères sélectionnés
- Tri par pertinence/prix/popularité fonctionnel
- URL sync avec query params pour partager les filtres
- Variante StayCard avec équipements sportifs affichés
**Testing:** Tester tous les filtres et combinaisons, vérifier le filtrage en temps réel, tester le layout responsive

---

### Step 6: Page Détails d'un Séjour
**Files:** 
- `app/sejours/[slug]/page.tsx`
- `components/details/image-gallery.tsx`
- `components/details/stay-header.tsx`
- `components/details/inclusions-grid.tsx`
- `components/details/activity-card.tsx`
- `components/details/timeline.tsx`
- `components/details/host-card.tsx`
- `components/details/review-section.tsx`
- `components/details/booking-card.tsx`
**What:** 
- Galerie photos avec grid 4 colonnes et lightbox
- Header avec badges, titre, rating, localisation
- Section "Ce qui est inclus" en grid 2x2
- Activités bien-être avec images
- Itinéraire timeline vertical
- Card concierge et avis clients
- Sidebar réservation sticky avec prix et dates
**Testing:** Vérifier le sticky booking card, animations galerie, responsive layout

---

### Step 7: Page Concept & Philosophie
**Files:** 
- `app/concept/page.tsx`
- `components/concept/page-hero.tsx`
- `components/concept/quote-section.tsx`
- `components/concept/feature-row.tsx`
- `components/concept/vertical-timeline.tsx`
- `components/concept/partner-logos.tsx`
- `components/concept/cta-section.tsx`
**What:** 
- Hero full-screen avec badge "The Vision"
- Citation philosophie en italique centrée
- Sections alternées image/texte
- Timeline verticale historique (2020-2024)
- Grille logos partenaires
- CTA final avec blur background
**Testing:** Vérifier les animations au scroll, alternance gauche/droite responsive

---

### Step 8: Page Contact avec Envoi de Formulaire
**Files:** 
- `app/contact/page.tsx`
- `app/actions/contact.ts`
- `components/contact/contact-form.tsx`
- `components/contact/form-section.tsx`
- `components/contact/concierge-card.tsx`
- `components/contact/service-quick-pick.tsx`
- `components/contact/contact-sidebar.tsx`
- `components/ui/counter.tsx`
- `components/ui/textarea.tsx`
**What:** 
- Formulaire multi-sections numérotées avec validation
- Server Action pour l'envoi du formulaire (préparé pour email/API)
- Compteur de voyageurs (+/-)
- Boutons quick services (Jet privé, Chauffeur, Chef, Yacht)
- Sidebar avec contacts et mini carte
- Card concierge avec statut online
- Feedback utilisateur (loading, success, error states)
**Testing:** Validation formulaire, soumission, affichage des états, interaction compteurs, responsive sidebar

---

### Step 9: Page Demande de Devis avec Envoi Multi-étapes
**Files:** 
- `app/devis/page.tsx`
- `app/actions/quote.ts`
- `components/devis/step-indicator.tsx`
- `components/devis/radio-card.tsx`
- `components/devis/objective-section.tsx`
- `components/devis/preferences-section.tsx`
- `components/devis/dates-section.tsx`
- `components/ui/date-picker.tsx`
- `components/ui/guest-select.tsx`
- `lib/hooks/use-multi-step-form.ts`
**What:** 
- Formulaire multi-étapes avec state management (4 étapes)
- Barre de progression étapes animée
- Radio cards pour objectif (Ressourcement, Célébration, Exploration)
- Radio cards préférences physiques (Sport, Yoga, Spa, Aventure)
- Date picker et sélecteur voyageurs
- Textarea besoins avec note confidentialité
- Server Action pour soumission finale
- Bouton submit avec animation shine
- Validation par étape avant de continuer
**Testing:** Navigation entre étapes, validation par étape, sélection radio cards, soumission finale

---

### Step 10: Responsive & Animations Finales
**Files:** Tous les composants créés
**What:** 
- Audit responsive sur toutes les pages (mobile, tablet, desktop)
- Ajout d'animations subtiles (fade-in au scroll, hover states)
- Optimisation des images avec next/image et placeholder blur
- Tests d'accessibilité (focus states, aria labels)
- Vérification des performances (Core Web Vitals)
**Testing:** Test sur différents devices, Lighthouse audit, navigation clavier

---

## Notes Techniques

### Packages à Installer
```bash
npm install @radix-ui/react-slider react-day-picker date-fns framer-motion next-themes
npm uninstall lucide-react
```

### Material Symbols (via CDN dans layout.tsx)
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
```

### Structure des Routes
```
app/
├── page.tsx                    → Home
├── sejours/
│   ├── page.tsx               → Catalogue
│   └── [slug]/page.tsx        → Détails
├── concept/page.tsx           → Philosophie
├── contact/page.tsx           → Contact
└── devis/page.tsx             → Demande de devis
```

### Palette de Couleurs (Dark + Light Mode)
| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| primary | `#1152d4` | `#1152d4` |
| background | `#101622` | `#f6f6f8` |
| surface | `#1e2738` | `#ffffff` |
| card | `#1e293b` | `#ffffff` |
| text-muted | `#92a4c9` | `#6b7280` |
| gold-accent | `#C5A059` | `#C5A059` |

### Server Actions (Formulaires)
```typescript
// app/actions/contact.ts
'use server'
export async function submitContactForm(formData: FormData) {
  // Validation + envoi email/API
}

// app/actions/quote.ts  
'use server'
export async function submitQuoteRequest(formData: FormData) {
  // Validation + envoi email/API
}
```

---

## Estimations

| Step | Complexité | Estimation |
|------|------------|------------|
| Step 1 | Moyenne | 45 min |
| Step 2 | Moyenne | 1h15 |
| Step 3 | Moyenne | 1h15 |
| Step 4 | Complexe | 2h |
| Step 5 | Complexe | 2h |
| Step 6 | Complexe | 2h |
| Step 7 | Moyenne | 1h |
| Step 8 | Complexe | 1h45 |
| Step 9 | Complexe | 2h |
| Step 10 | Moyenne | 1h |
| **Total** | | **~15h** |
